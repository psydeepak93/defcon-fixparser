import { ISpecMessages, MESSAGES } from '../../spec/SpecMessages';
import Field from '../fields/Field';
import Message from '../message/Message';
import { MessageContents } from '../messagecontents/MessageContents';

export class Messages {
    public messages: ISpecMessages[] = MESSAGES;
    public messageContents: MessageContents = new MessageContents();
    public cacheMap: Map<string, ISpecMessages> = new Map<
        string,
        ISpecMessages
    >();

    constructor() {
        this.messages.forEach((message: ISpecMessages) => {
            this.cacheMap.set(message.MsgType, message);
        });
    }

    public processMessage(message: Message, field: Field): void {
        const messageType = this.cacheMap.get(field.value);
        if (messageType) {
            message.setDescription(messageType.Name);
            message.setMessageType(messageType.MsgType);
            this.messageContents.processMessageContents(
                message,
                messageType.ComponentID,
            );
        }
    }
}
