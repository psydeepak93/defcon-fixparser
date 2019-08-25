import { ISpecDatatypes } from '../../../spec/SpecDatatypes';

export class FieldType {
    public name: string | null = null;
    public baseType: string | null = null;
    public description: string | null = null;
    public added: string | null = null;

    constructor() {
        this.reset();
    }

    public reset() {
        this.name = null;
        this.baseType = null;
        this.description = null;
        this.added = null;
    }

    public setType(type: ISpecDatatypes) {
        this.name = type.Name;
        this.baseType = type.BaseType!;
        this.description = type.Description;
        this.added = type.Added!;
    }
}
