import {EventState} from '../event';
import {API} from '../api';
import {Execution} from './index';

export class Task {
    readonly execution: Execution;
    readonly id: string;
    readonly api: API;
    private readonly waitingPromise: Promise<boolean>;

    constructor(execution: Execution, id: string, api: API) {
        this.execution = execution;
        this.id = id;
        this.api = api;
        this.waitingPromise = new Promise(async (resolve, reject) => {
            try {
                this.api.eventListener.listenStateChange(this.id, (event) => {
                    if(event.newState === EventState.completed) {
                        resolve(true);
                    } else if(event.newState === EventState.failed) {
                        resolve(false);
                    }
                });
            } catch(err) {
                reject(err);
            }
        });
    }

    public isCompleted(): boolean {
        return this.api.eventListener.callbacks[this.id] === undefined
    }

    async cancel(): Promise<void> {
        if(!this.isCompleted()) {
            await this.api.delete(`exec/current/setup/${this.id}`);
        }
    }

    async wait(): Promise<boolean> {
        return this.waitingPromise;
    }
}