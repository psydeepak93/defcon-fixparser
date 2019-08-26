import { COMPONENTS, ISpecComponents } from '../../spec/SpecComponents';

export class Components {
    public components: ISpecComponents[] = COMPONENTS;
    public cacheMap = new Map<string, ISpecComponents>();
    public cacheMapByName = new Map();

    constructor() {
        this.components.forEach((component) => {
            this.cacheMap.set(component.ComponentID, component);
        });
        this.components.forEach((component) => {
            this.cacheMapByName.set(component.Name, component);
        });
    }

    public find(componentId: string) {
        return this.cacheMap.get(componentId);
    }

    public findByName(name: string) {
        return this.cacheMapByName.get(name);
    }
}
