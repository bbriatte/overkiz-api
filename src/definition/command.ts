export interface RAWCommandDefinition {
    readonly commandName: string;
    readonly nparams: number;
}

export class CommandDefinition {

    readonly name: string;
    readonly nbParams: number;

    constructor(command: RAWCommandDefinition) {
        this.name = command.commandName;
        this.nbParams = command.nparams;
    }
}