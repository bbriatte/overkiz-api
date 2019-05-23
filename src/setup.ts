import {Location, RAWLocation} from './location';
import {Gateway, RAWGateway} from './gateway';
import {APIDevice, RAWDevice} from './device';
import {Place, RAWPlace} from './place';
import {API} from './api';

export interface RAWSetup {
    readonly creationTime: number;
    readonly lastUpdateTime: number;
    readonly id: string;
    readonly location: RAWLocation;
    readonly gateways: RAWGateway[];
    readonly devices: RAWDevice[];
    readonly resellerDelegationType: string;
    readonly oid: string;
    readonly rootPlace: RAWPlace;
}

export class Setup {

    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly id: string;
    readonly location: Location;
    readonly gateways: Gateway[];
    readonly devices: APIDevice[];
    readonly resellerDelegationType: string;
    readonly oid: string;
    readonly rootPlace: Place;

    constructor(setup: RAWSetup, api: API) {
        this.createdAt = new Date(setup.creationTime);
        this.updatedAt = new Date(setup.lastUpdateTime);
        this.id = setup.id;
        this.location = new Location(setup.location);
        this.gateways = setup.gateways.map((g) => new Gateway(g));
        this.devices = setup.devices.map((d) => new APIDevice(d, api));
        this.resellerDelegationType = setup.resellerDelegationType;
        this.oid = setup.oid;
        this.rootPlace = new Place(setup.rootPlace);
    }
}