import { IRead, IHttp, ILogger } from "@rocket.chat/apps-engine/definition/accessors";
import { IMessage, IMessageAttachment } from "@rocket.chat/apps-engine/definition/messages";
import { Settings } from "../config/settings";
import { format } from "path";

export async function translateAudio (
    http: IHttp,
    message: IMessage,
    read: IRead,
    logger: ILogger,
    language: string
): Promise<any> {
    try {
        const speechToTextApiKey =  await read.getEnvironmentReader().getSettings().getValueById(Settings.API_KEY);
        const translationApiKey = await read.getEnvironmentReader().getSettings().getValueById(Settings.API_KEY_TRANSLATION);

        const audioBuffer = await getBuffer(message, read);

        const response = await http.post("https://api.assemblyai.com/v2/upload", {
            headers: {
                Authorization: speechToTextApiKey, "Content-Type": "application/octet-stream",
            },
            data: audioBuffer
        })
        logger.debug(response.data.upload_url)

        const uploadUrl = response.data.upload_url


        const transcresponse = await http.post("https://api.assemblyai.com/v2/transcript", {
            headers: {
                Authorization: speechToTextApiKey, "Content-Type": "application/json",
            },
            data: { audio_url: uploadUrl },
        })

        logger.debug(transcresponse.data)
        const transcriptId =  transcresponse.data.id;
        let transcriptStatus = transcresponse.data.status;
        let text: string = ""
        while (transcriptStatus !== "completed") {
            if (transcriptStatus === "error") {
                throw new Error("Transcription error: " + transcresponse.data.error);
            }
            console.log("Transcription status:", transcriptStatus);
            await sleep(3000); // Wait for 5 seconds before polling again
            const statusResponse = await http.get(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
                headers: { Authorization: speechToTextApiKey }
            });
            transcriptStatus = statusResponse.data.status;
            if (transcriptStatus === "completed") {
                console.log("Transcription completed.");
                text = statusResponse.data.text;
            }
        }
        logger.debug(text)

        const translatedtext = await getTranslate(text, http, logger, language, translationApiKey);
        return "translated text: "+translatedtext;

    } catch (error) {
        logger.error("Error processing audio:", error);
        throw error;
    }
}


function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getBuffer(
    message: IMessage,
    read: IRead
): Promise<Buffer> {
    try {

    const audio = await read.getUploadReader().getBufferById(message.file?._id!);
    return audio
    } catch (error) {
        throw new error;
    }
}

export function isVoiceMessage(attachment: IMessageAttachment): boolean {
    return attachment.audioUrl != undefined
}


async function getTranslate(text:string, http: IHttp, logger: ILogger, language: string, apiKey:string) {

    const response: any = await http.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            contents: [
                {
                    parts: [{
                        text: `Translate the following text to ${language}. The language may be provided as a code (e.g., "hi" for Hindi, "en" for English). Detect and translate accordingly. Return only the translated text, without any additional words or explanations: "${text}"`
                    }]
                }
            ]
        }
    })
    const data = response.data;
    logger.debug(data.candidates[0].content.parts[0].text)
	return data.candidates[0].content.parts[0].text;
}
