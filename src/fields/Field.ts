import { EnumType } from '../enums/EnumType';
import { CategoryType } from './categories/CategoryType';
import { SectionType } from './sections/SectionType';
import { FieldType } from './datatypes/FieldType';

export default class Field {
    public tag: number;
    public value: any;
    public name: string | null = null;
    public description: string | null = null;
    public type: FieldType | null = null;
    public category: CategoryType | null = null;
    public section: SectionType | null = null;
    public enumeration: EnumType | null = null;
    public validated: boolean = false;

    constructor(tag: number, value: any) {
        this.tag = tag >> 0;
        this.value = value;
        this.name = null;
        this.description = null;
        this.type = null;
        this.category = null;
        this.section = null;
        this.enumeration = null;
        this.validated = false;
    }

    public setTag(tag: number) {
        this.tag = tag >> 0;
    }

    public setValue(value: any) {
        this.value = value;
    }

    public setName(name: string) {
        this.name = name;
    }

    public setDescription(description: string) {
        this.description = description;
    }

    public setType(type: FieldType | null) {
        this.type = type;
    }

    public setCategory(category: CategoryType) {
        this.category = category;
    }

    public setSection(section: SectionType) {
        this.section = section;
    }

    public setEnumeration(enumeration: EnumType) {
        this.enumeration = enumeration;
    }

    public setValidated(isValid: boolean) {
        this.validated = isValid;
    }

    public toString(): string {
        return `${this.tag}=${this.value}`;
    }
}
