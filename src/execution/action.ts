import {Command} from './command';

export interface Action {
    readonly deviceURL: string;
    readonly commands: Command[];
}