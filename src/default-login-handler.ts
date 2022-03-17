import {PlatformLoginHandler} from "./platform-login-handler";

export class DefaultLoginHandler implements PlatformLoginHandler {

    readonly user: string;
    readonly password: string;

    constructor(user: string, password: string) {
        this.user = user;
        this.password = password;
    }

    public getLoginData(): Promise<{ [p: string]: any }> {
        return Promise.resolve({
            userId: this.user,
            userPassword: this.password
        });
    }
}
