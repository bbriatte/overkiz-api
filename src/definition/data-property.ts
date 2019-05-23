export interface RAWDataPropertyDefinition {
    readonly qualifiedName: string;
    readonly value: string;
}

export class DataPropertyDefinition {

    readonly name: string;
    readonly value: string;

    constructor(dataProperty: RAWDataPropertyDefinition) {
        this.name = dataProperty.qualifiedName;
        this.value = dataProperty.value;
    }
}