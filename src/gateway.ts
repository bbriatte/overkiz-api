export interface RAWGateway {
    readonly gatewayId: string;
    readonly type: number;
    readonly subType: number;
    readonly placeOID: string;
    readonly alive: boolean;
    readonly timeReliable: boolean;
    readonly connectivity: Connectivity;
    readonly upToDate: boolean;
    readonly updateStatus: string;
    readonly syncInProgress: boolean;
    readonly mode: string;
    readonly functions: string;
}

export interface Connectivity {
    readonly status: string;
    readonly protocolVersion: string;
}

export class Gateway {

    readonly id: string;
    readonly type: number;
    readonly subType: number;
    readonly placeOID: string;
    readonly alive: boolean;
    readonly timeReliable: boolean;
    readonly connectivity: Connectivity;
    readonly upToDate: boolean;
    readonly updateStatus: string;
    readonly syncInProgress: boolean;
    readonly mode: string;
    readonly functions: string[];

    constructor(gateway: RAWGateway) {
        this.id = gateway.gatewayId;
        this.type = gateway.type;
        this.subType = gateway.subType;
        this.placeOID = gateway.placeOID;
        this.alive = gateway.alive;
        this.timeReliable = gateway.timeReliable;
        this.connectivity = gateway.connectivity;
        this.upToDate = gateway.upToDate;
        this.updateStatus = gateway.updateStatus;
        this.syncInProgress = gateway.syncInProgress;
        this.mode = gateway.mode;
        this.functions = gateway.functions.split(',');
    }
}