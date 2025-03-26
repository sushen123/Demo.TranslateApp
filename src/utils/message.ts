import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';


export async function notifyMessage(room: IRoom, read: IRead, sender: IUser, message: string, threadId?: string): Promise<void> {
    const notifier = read.getNotifier();
    const messageBuilder = notifier.getMessageBuilder();
    messageBuilder.setText(message);
    messageBuilder.setRoom(room);
    if(threadId){
        messageBuilder.setThreadId(threadId);
    }
    return notifier.notifyUser(sender, messageBuilder.getMessage());
    }
