import {DataPropertyDefinition, RAWDataPropertyDefinition} from './data-property';
import {RAWStateDefinition, StateDefinition} from './state';
import {CommandDefinition, RAWCommandDefinition} from './command';

export interface RAWDefinition {
    readonly type: string;
    readonly qualifiedName: string;
    readonly uiClass: string;
    readonly uiClassifiers?: string[];
    readonly widgetName: string;
    readonly dataProperties: RAWDataPropertyDefinition[];
    readonly states: RAWStateDefinition[];
    readonly commands: RAWCommandDefinition[];
}

export class Definition {
    readonly type: string;
    readonly name: string;
    readonly uiClass: string;
    readonly uiClassifiers?: string[];
    readonly widget: string;
    readonly dataProperties: DataPropertyDefinition[];
    readonly states: StateDefinition[];
    readonly commands: CommandDefinition[];

    constructor(definition: RAWDefinition) {
        this.type = definition.type;
        this.name = definition.qualifiedName;
        this.uiClass = definition.uiClass;
        this.uiClassifiers = definition.uiClassifiers;
        this.widget = definition.widgetName;
        this.dataProperties = definition.dataProperties.map((dp) => new DataPropertyDefinition(dp));
        this.states = definition.states.map((s) => new StateDefinition(s));
        this.commands = definition.commands.map((c) => new CommandDefinition(c));
    }

    getStateDefinition(name: string): StateDefinition | undefined {
        return this.states.find((s) => s.name === name);
    }

    getCommandDefinition(name: string): CommandDefinition | undefined {
        return this.commands.find((c) => c.name === name);
    }

    getDataPropertyDefinition(name: string): DataPropertyDefinition | undefined {
        return this.dataProperties.find((dp) => dp.name === name);
    }
}

export * from './data-property';
export * from './state';
export * from './command';