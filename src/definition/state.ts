export interface RAWStateDefinition {
    readonly type: string;
    readonly qualifiedName: string;
    readonly values?: string[];
}

export class StateDefinition {

    readonly type: string;
    readonly name: string;
    readonly values?: string[];

    constructor(state: RAWStateDefinition) {
        this.type = state.type;
        this.name = state.qualifiedName;
        this.values = state.values;
    }
}