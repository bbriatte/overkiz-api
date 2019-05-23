import {API} from './api';
import {RAWEvent} from './event';

export interface PollingInfo {
    readonly always: boolean;
    readonly interval: number;
}

export class EventListener {

    private id?: string;
    readonly polling: PollingInfo;
    readonly api: API;
    readonly callbacks: {[taskId: string]: (event: RAWEvent) => void};

    constructor(polling: PollingInfo, api: API) {
        this.polling = polling;
        this.api = api;
        this.callbacks = {};
        if(this.polling.always === true) {
            this.registerEvents();
        }
    }

    public listenStateChange(taskId: string, callback: (event: RAWEvent) => void): void {
        this.callbacks[taskId] = callback;
        this.registerEvents();
    }

    private registerEvents(completion?: (err?: Error, id?: string) => void): void {
        if(this.id === undefined) {
            this.api.post('events/register').then((res) => {
                this.id = res.id;
                if(completion !== undefined) {
                    completion(undefined, this.id);
                }
                setTimeout(this.fetchEvents.bind(this), this.polling.interval);
            }).catch((err) => {
                if(completion !== undefined) {
                    completion(err);
                }
            });
        } else if(completion !== undefined) {
            completion(undefined, this.id);
        }
    }

    private unregisterEvents(completion?: (err?: Error) => void): void {
        if(this.id !== undefined) {
            this.api.post(`events/${this.id}/unregister`).then(() => {
                this.id = undefined;
                if(completion !== undefined) {
                    completion(undefined);
                }
            }).catch((err) => {
                if(completion !== undefined) {
                    completion(err);
                }
            });
        } else if(completion !== undefined) {
            completion(undefined);
        }
    }

    private fetchEvents(): void {
        this.api.post(`events/${this.id}/fetch`).then((events: RAWEvent[]) => {
            events.forEach((event) => {
                if(event.name === 'ExecutionStateChangedEvent' &&
                    event.execId !== undefined &&
                    this.callbacks[event.execId] !== undefined) {
                    const callback = this.callbacks[event.execId];
                    if(event.timeToNextState === -1) {
                        delete this.callbacks[event.execId]
                    }
                    callback(event);
                }
            });
            if(this.polling.always === false && Object.keys(this.callbacks).length === 0) {
                this.unregisterEvents();
            } else {
                setTimeout(this.fetchEvents.bind(this), this.polling.interval);
            }
        }).catch(() => {
            this.unregisterEvents((err) => {
                if(err !== undefined) {
                    this.registerEvents();
                }
            });
        });
    }
}