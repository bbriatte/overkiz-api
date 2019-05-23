export interface Command {
    readonly name: string;
    readonly parameters?: any[];
}

export interface Action {
    readonly deviceURL: string;
    readonly commands: Command[];
}

export interface ExecutionInfo {
    readonly label?: string;
    readonly metadata?: string;
}

export interface Execution extends ExecutionInfo {
    readonly actions: Action[];
}