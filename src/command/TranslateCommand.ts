import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import {
    ISlashCommand,
    SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';
import { translateAudio } from '../lib/audioTranslate';
import { TranslationApp } from '../../TranslateApp';
import { notifyMessage } from '../utils/message';
import { IMessage, IMessageRaw } from '@rocket.chat/apps-engine/definition/messages';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
export class TranslateCommand implements ISlashCommand{
    constructor(public app: TranslationApp) {}
    public command = 'translate';
    public i18nParamsExample: string = "";
    public i18nDescription: string = "Translate Voice Message";
    public providesPreview: boolean = false;

    public async executor(
        context: SlashCommandContext,
        read: IRead,
        modify: IModify,
        http: IHttp,
        persistance: IPersistence
    ): Promise<void> {

        const user = context.getSender();
        const command = context.getArguments();
        const room: IRoom = context.getRoom();
        const languages = context.getSender().settings?.preferences?.language || "en";
        const threadId = context.getThreadId() || "";

        const status = command[0];
        const statusText = command.length > 1 ? command.slice(1).join(' ') : '';
        const subCommand = command[1];

        if(subCommand) {
            switch(subCommand) {
                case 'help': {}
                case 'auto': {}
                case 'language': {}
                default:
                throw new Error('Invalid Command');
            }
        }
        else {
            let lastMessage
            if(threadId) {
                lastMessage = await this.getThreadMessages(room, read, user, threadId);
                this.app.getLogger().debug(lastMessage)
            }
            else {
                lastMessage = await this.getRoomMessage(room, read)
            }
            //@ts-ignore
            //translateAudio function to translate the audio
            const response = await translateAudio(http,
                lastMessage,
                read,
                this.app.getLogger(),
                languages);
            await modify.getUpdater().getUserUpdater().updateStatus(user,
                statusText,
                status);
            await notifyMessage(room, read, user, response, threadId);
        }
    }

    private async getRoomMessage(
		room: IRoom,
		read: IRead,
	): Promise<IMessageRaw | undefined> {
		const roomMessages = await read
			.getRoomReader()
			.getMessages(room.id);

		const lastMessage = roomMessages.pop();

        return lastMessage
	}

    private async getThreadMessages(
		room: IRoom,
		read: IRead,
		user: IUser,
		threadId: string,
	): Promise<IMessage | undefined> {
		const threadReader = read.getThreadReader();
		const thread = await threadReader.getThreadById(threadId);

		if (!thread) {
			await notifyMessage(room, read, user, 'Thread not found');
			throw new Error('Thread not found');
		}

        const roomMessages = await read.getThreadReader().getThreadById(threadId);
        const lastMessage = roomMessages?.pop()
        return lastMessage
	}
}
