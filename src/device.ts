import {API} from './api';
import {Entry} from './entry';
import {Command, ExecutionInfo} from './execution';
import {RAWDefinition, Definition} from './definition';

export interface RAWDevice {
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

export class APIDevice {

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

    constructor(device: RAWDevice, api: API) {
        this.createdAt = new Date(device.creationTime);
        this.updatedAt = new Date(device.lastUpdateTime);
        this.name = device.label;
        this.URL = device.deviceURL;
        this.shortcut = device.shortcut;
        this.model = device.controllableName;
        this.definition = new Definition(device.definition);
        this.states = device.states;
        this.attributes = device.attributes;
        this.available = device.available;
        this.enabled = device.enabled;
        this.placeOID = device.placeOID;
        this.widget = device.widget;
        this.type = device.type;
        this.oid = device.oid;
        this.uiClass = device.uiClass;
        this.api = api;
    }

    public getState(name: string): Entry | undefined {
        const index = this.indexOfState(name);
        return index >= 0 ? this.states[index] : undefined;
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

    public async exec(info?: ExecutionInfo, ...commands: Command[]): Promise<boolean> {
        return this.api.exec({
            ...info,
            actions: [{
                deviceURL: this.URL,
                commands: commands
            }]
        });
    }
}