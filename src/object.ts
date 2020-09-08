import {API} from './api';
import {Entry} from './entry';
import {Command, Task} from './execution';
import {RAWDefinition, Definition} from './definition';

export interface RAWObject {
    readonly creationTime: number;
    readonly lastUpdateTime: number;
    readonly label: string;
    readonly deviceURL: string;
    readonly shortcut: boolean;
    readonly controllableName: string;
    readonly definition: RAWDefinition;
    readonly states: Entry[];
    readonly attributes: Entry[];
    readonly available: boolean;
    readonly enabled: boolean;
    readonly placeOID: string;
    readonly widget: string;
    readonly type: number;
    readonly oid: string;
    readonly uiClass: string;
}

export class APIObject {

    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly name: string;
    readonly URL: string;
    readonly shortcut: boolean;
    readonly model: string;
    readonly definition: Definition;
    readonly states: Entry[];
    readonly attributes: Entry[];
    readonly available: boolean;
    readonly enabled: boolean;
    readonly placeOID: string;
    readonly widget: string;
    readonly type: number;
    readonly oid: string;
    readonly uiClass: string;
    readonly api: API;
    private currentTask?: Task;

    constructor(object: RAWObject, api: API) {
        this.createdAt = new Date(object.creationTime);
        this.updatedAt = new Date(object.lastUpdateTime);
        this.name = object.label;
        this.URL = object.deviceURL;
        this.shortcut = object.shortcut;
        this.model = object.controllableName;
        this.definition = new Definition(object.definition);
        this.states = object.states;
        this.attributes = object.attributes;
        this.available = object.available;
        this.enabled = object.enabled;
        this.placeOID = object.placeOID;
        this.widget = object.widget;
        this.type = object.type;
        this.oid = object.oid;
        this.uiClass = object.uiClass;
        this.api = api;
    }

    public getStateEntry(name: string): Entry | undefined {
        const index = this.indexOfState(name);
        return index >= 0 ? this.states[index] : undefined;
    }

    public getStateValue(name: string): any | undefined {
        const entry = this.getStateEntry(name);
        return entry !== undefined ? entry.value : undefined;
    }

    public hasCommand(name: string): boolean {
        return this.definition.getCommandDefinition(name) !== undefined;
    }

    private indexOfState(name: string): number {
        return this.states.findIndex((s) => s.name === name);
    }

    public async refreshStates(): Promise<Entry[]> {
        const res: Entry[] = await this.api.get(`setup/devices/${encodeURIComponent(this.URL)}/states`);
        this.states.splice(0, this.states.length, ...res);
        return res;
    }

    public async refreshState(name: string): Promise<Entry | undefined> {
        const res: Entry = await this.api.get(`setup/devices/${encodeURIComponent(this.URL)}/states/${encodeURIComponent(name)}`);
        if(res !== undefined) {
            const stateIndex = this.indexOfState(name);
            if(stateIndex >= 0) {
                this.states[stateIndex] = res;
            }
        }
        return res;
    }

    public async exec(...commands: Command[]): Promise<boolean> {
        if(this.currentTask !== undefined) {
            await this.currentTask.cancel();
        }
        this.currentTask = await this.api.exec({
            label: `${this.name}: ${commands.join('|')}`,
            actions: [{
                deviceURL: this.URL,
                commands: commands
            }]
        });
        if(this.currentTask !== undefined) {
            return this.currentTask.wait();
        }
        return false;
    }
}
