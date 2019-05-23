import {Action} from './action';

export interface Execution {
    readonly label?: string;
    readonly metadata?: string;
    readonly actions: Action[];
}

export * from './action';
export * from './command';
export * from './task';