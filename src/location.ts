export interface RAWLocation {
    readonly creationTime: number;
    readonly lastUpdateTime: number;
    readonly city: string;
    readonly country: string;
    readonly postalCode: string;
    readonly addressLine1: string;
    readonly addressLine2: string;
    readonly timezone: string;
    readonly longitude: number;
    readonly latitude: number;
    readonly twilightMode: number;
    readonly twilightAngle: string;
    readonly twilightCity: string;
    readonly summerSolsticeDuskMinutes: number;
    readonly winterSolsticeDuskMinutes: number;
    readonly twilightOffsetEnabled: number;
    readonly dawnOffset: number;
    readonly duskOffset: number;
}

export class Location {
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly address: Address;
    readonly coordinates: Coordinates;
    readonly twilight: Twilight;
    readonly solstice: Solstice;
    readonly offsets: Offsets;

    constructor(location: RAWLocation) {
        this.createdAt = new Date(location.creationTime);
        this.updatedAt = new Date(location.lastUpdateTime);
        this.address = {
            city: location.city,
            country: location.country,
            postalCode: location.postalCode,
            line1: location.addressLine1,
            line2: location.addressLine2
        };
        this.coordinates = {
            lat: location.latitude,
            lon: location.longitude
        };
        this.twilight = {
            mode: location.twilightMode,
            angle: location.twilightAngle,
            city: location.twilightCity,
            offsetEnabled: location.twilightOffsetEnabled
        };
        this.solstice = {
            summerDuskMinutes: location.summerSolsticeDuskMinutes,
            winterDuskMinutes: location.winterSolsticeDuskMinutes
        };
        this.offsets = {
            dawn: location.dawnOffset,
            dusk: location.duskOffset
        };
    }
}

export interface Address {
    readonly city: string;
    readonly country: string;
    readonly postalCode: string;
    readonly line1: string;
    readonly line2: string;
}

export interface Coordinates {
    readonly lon: number;
    readonly lat: number;
}

export interface Twilight {
    readonly mode: number;
    readonly angle: string;
    readonly city: string;
    readonly offsetEnabled: number;
}

export interface Solstice {
    readonly summerDuskMinutes: number;
    readonly winterDuskMinutes: number;
}

export interface Offsets {
    readonly dawn: number;
    readonly dusk: number;
}