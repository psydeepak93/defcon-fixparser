import { ISpecSections } from '../../../spec/SpecSections';

export class SectionType {
    public sectionID: string | null = null;
    public name: string | null = null;
    public displayOrder: string | null = null;
    public volume: string | null = null;
    public notReqXML: string | null = null;
    public fixmlFileName: string | null = null;
    public description: string | null = null;

    public reset() {
        this.sectionID = null;
        this.name = null;
        this.displayOrder = null;
        this.volume = null;
        this.notReqXML = null;
        this.fixmlFileName = null;
        this.description = null;
    }

    public setSection(section: ISpecSections) {
        this.sectionID = section.SectionID;
        this.name = section.Name;
        this.displayOrder = section.DisplayOrder;
        this.volume = section.Volume;
        this.notReqXML = section.NotReqXML;
        this.fixmlFileName = section.FIXMLFileName;
        this.description = section.Description;
    }
}
