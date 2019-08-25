import { DATATYPES, ISpecDatatypes } from '../../../spec/SpecDatatypes';
import Field from '../Field';
import { FieldType } from './FieldType';

export class DataTypes {
    public dataTypes: ISpecDatatypes[] = DATATYPES;
    public cacheMap: Map<string, ISpecDatatypes> = new Map<
        string,
        ISpecDatatypes
    >();
    public cacheTypeMap: Map<string, any> = new Map<string, any>();
    public fieldType: FieldType = new FieldType();

    constructor() {
        this.dataTypes.forEach((item) => {
            this.cacheMap.set(item.Name, item);
        });

        this.cacheTypeMap.set('int', parseInt);
        this.cacheTypeMap.set('Length', parseInt);
        this.cacheTypeMap.set('TagNum', parseInt);
        this.cacheTypeMap.set('SeqNum', parseInt);
        this.cacheTypeMap.set('NumInGroup', parseInt);
        this.cacheTypeMap.set('DayOfMonth', parseInt);

        this.cacheTypeMap.set('float', parseFloat);
        this.cacheTypeMap.set('Qty', parseFloat);
        this.cacheTypeMap.set('Price', parseFloat);
        this.cacheTypeMap.set('PriceOffset', parseFloat);
        this.cacheTypeMap.set('Amt', parseFloat);
        this.cacheTypeMap.set('Percentage', parseFloat);

        this.cacheTypeMap.set('char', String);
        this.cacheTypeMap.set('Boolean', String);

        this.cacheTypeMap.set('String', String);
        this.cacheTypeMap.set('MultipleCharValue', String);
        this.cacheTypeMap.set('MultipleStringValue', String);
        this.cacheTypeMap.set('Country', String);
        this.cacheTypeMap.set('Currency', String);
        this.cacheTypeMap.set('Exchange', String);
        this.cacheTypeMap.set('MonthYear', String);
        this.cacheTypeMap.set('UTCTimestamp', String);
        this.cacheTypeMap.set('UTCTimeOnly', String);
        this.cacheTypeMap.set('UTCDateOnly', String);
        this.cacheTypeMap.set('LocalMktDate', String);
        this.cacheTypeMap.set('TZTimeOnly', String);
        this.cacheTypeMap.set('TZTimestamp', String);
        this.cacheTypeMap.set('data', String);
        this.cacheTypeMap.set('XMLData', String);
        this.cacheTypeMap.set('Language', String);

        this.cacheTypeMap.set('Pattern', String);
        this.cacheTypeMap.set('Tenor', String);
        this.cacheTypeMap.set('Reserved100Plus', String);
        this.cacheTypeMap.set('Reserved1000Plus', String);
        this.cacheTypeMap.set('Reserved4000Plus', String);
    }

    public processDatatype(field: Field, type: string) {
        this.fieldType.reset();
        const dataType: ISpecDatatypes | undefined = this.cacheMap.get(type);
        if (dataType) {
            this.fieldType.setType(dataType);
            field.setType(this.fieldType);
            if (
                type === 'int' ||
                type === 'Length' ||
                type === 'TagNum' ||
                type === 'SeqNum' ||
                type === 'NumInGroup' ||
                type === 'DayOfMonth'
            ) {
                field.setValue(field.value >> 0);
            } else if (
                type === 'float' ||
                type === 'Qty' ||
                type === 'Price' ||
                type === 'PriceOffset' ||
                type === 'Amt' ||
                type === 'Percentage'
            ) {
                field.setValue(parseFloat(field.value));
            }
        }
    }
}
