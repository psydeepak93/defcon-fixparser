import Message from '../message/Message';
import prebuiltMap from '../../prebuild/built/MessageContents.prebuilt.json';

import { ISpecMessageContents } from '../../spec/SpecMessageContents';

export class MessageContents {
    public cacheMap: Map<string, ISpecMessageContents[]> = new Map<
        string,
        ISpecMessageContents[]
    >();
    public validated: boolean = false;

    constructor() {
        Object.entries(prebuiltMap).forEach(
            (pair) => this.cacheMap.set(pair[0], pair[1] as any), // ISpecMessageContents[]
        );
    }

    public processMessageContents(message: Message, componentId: string) {
        const messageContents = this.cacheMap.get(componentId);
        if (messageContents) {
            message.setMessageContents(messageContents);
        }
    }
}
