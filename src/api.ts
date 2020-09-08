import * as request from 'request-promise';
import {RequestPromiseOptions} from 'request-promise';
import {CookieJar, Response} from 'request';
import {APIObject, RAWObject} from './object';
import {RAWSetup, Setup} from './setup';
import {Execution, Task} from './execution';
import {EventListener, PollingInfo} from './event-listener';

export interface Config {
    readonly host: string;
    readonly user: string;
    readonly password: string;
    readonly polling: PollingInfo;
}

export class API {

    readonly host: string;
    readonly user: string;
    readonly password: string;
    readonly eventListener: EventListener;
    private cookies?: CookieJar;

    constructor(config: Config) {
        this.host = config.host;
        this.user = config.user;
        this.password = config.password;
        this.eventListener = new EventListener(config.polling, this);
    }

    private getBaseURL(): string {
        return `https://${this.host}`;
    }

    public getURL(path: string): string {
        return `${this.getBaseURL()}/enduser-mobile-web/enduserAPI/${path}`;
    }

    public async get(path: string, options?: RequestPromiseOptions): Promise<any> {
        return this.req(request.get, path, options);
    }

    public async post(path: string, options?: RequestPromiseOptions): Promise<any> {
        return this.req(request.post, path, options);
    }

    public async delete(path: string, options?: RequestPromiseOptions): Promise<any> {
        return this.req(request.delete, path, options);
    }

    public async getObjects(): Promise<APIObject[]> {
        const raw: RAWObject[] = await this.get('setup/devices');
        if(Array.isArray(raw)) {
            return raw.map((obj) => new APIObject(obj, this));
        }
        return [];
    }

    public async exec(execution: Execution): Promise<Task | undefined> {
        const res = await this.post('exec/apply', {
            body: execution
        });
        if(res.execId !== undefined) {
            return new Task(execution, res.execId, this);
        }
        return undefined;
    }

    public async getSetup(): Promise<Setup> {
        const raw: RAWSetup = await this.get('setup');
        return new Setup(raw, this);
    }

    private async req(method: Function, path: string, options?: RequestPromiseOptions): Promise<string> {
        if(this.cookies === undefined) {
            await this.ensureLogin();
        }
        if(this.cookies !== undefined) {
            try {
                return await method({
                    jar: this.cookies,
                    url: this.getURL(path),
                    json: true,
                    ...options
                });
            } catch(err) {
                if(err.statusCode === 401) {
                    this.cookies = undefined;
                    return await this.req(method, path, options);
                }
                throw err;
            }
        }
    }

    private async ensureLogin(): Promise<void> {
        let retries = 0;
        let res = undefined;
        do {
            try {
                res = await request.post(this.getURL('login'), {
                    form: {
                        userId: this.user,
                        userPassword: this.password
                    },
                    json: true,
                    transform: function(body: any, response: Response, resolveWithFullResponse?: boolean): any {
                        return {
                            headers: response.headers,
                            data: body
                        }
                    }
                });
            } catch(err) {
                if(retries < 3) {
                    retries++;
                } else {
                    throw err;
                }
            }
        } while(res === undefined);
        const json = res.data;
        if(json.success === true) {
            const jar = request.jar();
            const baseURL = this.getBaseURL();
            res.headers['set-cookie'].forEach((cookieString: string) => {
                jar.setCookie(cookieString, baseURL);
            });
            this.cookies = jar;
        } else if(json.error !== undefined) {
            throw res.error;
        }
    }
}
