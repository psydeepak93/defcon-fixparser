import { FIELDS, ISpecFields } from '../../spec/SpecFields';
import Message from '../message/Message';
import { Messages } from '../messages/Messages';
import { Categories } from './categories/Categories';
import { DataTypes } from './datatypes/Datatypes';
import Field from './Field';
import { Sections } from './sections/Sections';

export class Fields {
    public fields: ISpecFields[] = FIELDS;
    public cacheMap: Map<number, ISpecFields> = new Map<number, ISpecFields>();
    public messages: Messages = new Messages();
    public categories: Categories = new Categories();
    public sections: Sections = new Sections();
    public dataTypes: DataTypes = new DataTypes();

    constructor() {
        this.fields.forEach((item: ISpecFields) => {
            this.cacheMap.set(item.Tag >> 0, item);
        });
    }

    public getField(field: Field) {
        const data = this.cacheMap.get(field.tag);
        if (data) {
            field.setName(data.Name);
            field.setDescription(data.Description);

            if (data.BaseCategory) {
                this.categories.processCategory(field, data.BaseCategory);

                if (field.category!.sectionID) {
                    this.sections.processSection(
                        field,
                        field.category!.sectionID,
                    );
                }
            }

            this.dataTypes.processDatatype(field, data.Type);
        } else {
            field.setType('');
            field.setValue(String(field.value));
        }
    }

    public processField(message: Message, field: Field) {
        const data = this.cacheMap.get(field.tag);
        if (data) {
            if (field.tag === 35) {
                this.messages.processMessage(message, field);
            }

            field.setName(data.Name);
            field.setDescription(data.Description);

            if (data.BaseCategory) {
                this.categories.processCategory(field, data.BaseCategory);

                if (field.category!.sectionID) {
                    this.sections.processSection(
                        field,
                        field.category!.sectionID,
                    );
                }
            }

            this.dataTypes.processDatatype(field, data.Type);
        } else {
            field.setType('');
            field.setValue(String(field.value));
        }
    }
}
