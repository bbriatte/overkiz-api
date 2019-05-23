export interface RAWPlace {
    readonly creationTime: number;
    readonly lastUpdateTime: number;
    readonly label: string;
    readonly type: number;
    readonly oid: string;
    readonly subPlaces: RAWPlace[];
}

export class Place {
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly name: string;
    readonly type: number;
    readonly oid: string;
    readonly subPlaces: Place[];

    constructor(place: RAWPlace) {
        this.createdAt = new Date(place.creationTime);
        this.updatedAt = new Date(place.lastUpdateTime);
        this.name = place.label;
        this.type = place.type;
        this.oid = place.oid;
        this.subPlaces = place.subPlaces.map((p) => new Place(p));
    }
}