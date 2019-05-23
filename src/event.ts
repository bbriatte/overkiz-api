export enum EventState {
    initialized = 'INITIALIZED',
    notTransmistted = 'NOT_TRANSMITTED',
    transmistted = 'TRANSMITTED',
    inProgress = 'IN_PROGRESS',
    completed = 'COMPLETED',
    failed = 'FAILED'
}

export interface RAWEvent {
    readonly timestamp: number;
    readonly name: string;
    readonly setupOID: string;
    readonly execId: string;
    readonly newState: EventState;
    readonly ownerKey: string;
    readonly type: number;
    readonly subType: number;
    readonly oldState: EventState;
    readonly timeToNextState: number;
}