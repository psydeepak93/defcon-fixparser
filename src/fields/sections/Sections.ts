import { ISpecSections, SECTIONS } from '../../../spec/SpecSections';
import Field from '../Field';
import { SectionType } from './SectionType';

export class Sections {
    public sections: ISpecSections[] = SECTIONS;
    public cacheMap: Map<string, ISpecSections> = new Map<
        string,
        ISpecSections
    >();
    public sectionType: SectionType = new SectionType();

    constructor() {
        this.sections.forEach((section) => {
            this.cacheMap.set(section.SectionID, section);
        });
    }

    public processSection(item: Field, sectionId: string) {
        this.sectionType.reset();
        const sectionData: ISpecSections | undefined = this.cacheMap.get(
            String(sectionId),
        );
        if (sectionData) {
            this.sectionType.setSection(sectionData);
            item.setSection(this.sectionType);
        }
    }
}
