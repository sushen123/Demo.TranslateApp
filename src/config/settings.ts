import {
    ISetting,
    SettingType,
} from "@rocket.chat/apps-engine/definition/settings";

export enum Settings {
    SPEECH_TO_TEXT_PROVIDER = 'speech-to-text-provider',
    TRANSLATION_PROVIDER = 'translation-provider',
	API_KEY = 'api_key_speech_to_text',
    API_KEY_TRANSLATION = "api_key_translation",
    API_ENDPOINT = 'api_endpoint',
    REAL_TIME_TRANSLATION = 'realtime-translation'
}

export const settings: ISetting[] = [
    {
        id: Settings.SPEECH_TO_TEXT_PROVIDER,
        type: SettingType.SELECT,
        i18nLabel: "Speech to Text Provider",
        values: [
            { key: "assembly", i18nLabel: "Assembly AI" }
        ],
        required: true,
        public: true,
        packageValue: "assembly",
    },
    {
        id: Settings.TRANSLATION_PROVIDER,
        type: SettingType.SELECT,
        i18nLabel: "Model selection",
        i18nDescription: "AI model to use for inference.",
        values: [
            { key: "gemini", i18nLabel: "GEMINI" }
        ],
        required: true,
        public: true,
        packageValue: "gemini",
    },
    {
		id: Settings.API_KEY,
		type: SettingType.PASSWORD,
        i18nLabel: 'API Key(Speech to text)',
        i18nDescription: "API Key of Speech to text services",
		i18nPlaceholder: '',
		required: true,
		public: false,
        packageValue: '',
	},
    {
		id: Settings.API_KEY_TRANSLATION,
		type: SettingType.PASSWORD,
        i18nLabel: 'API Key(Translation)',
        i18nDescription: "API Key of Translation Services",
		i18nPlaceholder: '',
		required: true,
		public: false,
        packageValue: '',
	},
    {
		id: Settings.REAL_TIME_TRANSLATION,
		type: SettingType.BOOLEAN,
        i18nLabel: 'Real Time Translation',
        i18nDescription: "Translate voice message automatically",
		i18nPlaceholder: '',
		required: true,
		public: false,
        packageValue: '',
	},


];

