import {
    IAppAccessors,
    ILogger,
    IRead,
    IConfigurationExtend,
    IHttp,
    IModify,
    IPersistence,
    IEnvironmentRead
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { settings } from './src/config/settings';
import { TranslateCommand } from './src/command/TranslateCommand';
import { UIActionButtonContext } from '@rocket.chat/apps-engine/definition/ui';
import { IUIKitResponse, UIKitActionButtonInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { notifyMessage } from './src/utils/message';
import { translateAudio} from './src/lib/audioTranslate';
import { IMessage, IMessageAttachment, IPostMessageSent } from '@rocket.chat/apps-engine/definition/messages';
import { IUser } from '@rocket.chat/apps-engine/definition/users';
//import statements

export class TranslationApp extends App implements IPostMessageSent  {
    public user:IUser

    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors, user:IUser) {
        super(info, logger, accessors);
    }

    public async initialize(
		configuration: IConfigurationExtend
	): Promise<void> {
		await configuration.slashCommands.provideSlashCommand(
			new TranslateCommand(this),
		);


        configuration.ui.registerButton({
            actionId: 'my-action-id',
            labelI18n: 'translate',
            context: UIActionButtonContext.MESSAGE_ACTION,

        })


		await Promise.all(
			settings.map((setting) => {
				configuration.settings.provideSetting(setting);
			}),
		);
	}


    public async executeActionButtonHandler(
        context: UIKitActionButtonInteractionContext,
        read: IRead,
        http: IHttp,
        _persistence: IPersistence,
        modify: IModify,
    ): Promise<IUIKitResponse> {
        const {
            buttonContext,
            actionId,
            triggerId,
            user,
            room,
            message,
        } = context.getInteractionData();

        this.getLogger().debug("message", message)

        const languages = user.settings?.preferences?.language || "en"

        if (actionId === 'my-action-id') {
            //@ts-ignore
            const response = await translateAudio(http, message, read, this.getLogger(), languages);
                    await notifyMessage(room, read, user, response);
        }
        return context.getInteractionResponder().successResponse();
}

public async executePostMessageSent(
    message: IMessage,
    read: IRead,
    http: IHttp,
    persistence: IPersistence,
    modify: IModify,
): Promise<void> {

    try {

    this.getLogger().info("Execute post message sent");
    const user = await read.getUserReader().getById(message.sender.id || "");
    const language = user?.settings?.preferences?.language || 'en'
    const response = await translateAudio(http, message, read, this.getLogger(), language);
    modify.getNotifier().notifyRoom(message.room, response);

    } catch (error) {
        this.getLogger().debug(error)
    }
}

public async checkPostMessageSent(message: IMessage): Promise<boolean> {
    return message.attachments?.some(this.isAudioAttachment) ?? false;
}

public isAudioAttachment(attachment: IMessageAttachment): boolean {
        return attachment.audioUrl != undefined
    }

}



