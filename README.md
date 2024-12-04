# WXT + Vue 3 + Pinia

Developing with Vue 3 and Pinia in WXT.

## Features

- AI-powered Tab Manager use Chrome Built-in AI Prompt api
- AI-powered Summary Manager use Chrome Built-in AI Summary api and Translation api
- AI-powered Search Manager use Chrome Built-in AI Prompt api with Google Custom Search api
- Read Later Manager use Chrome ReadingList and Alarm api
- Alarm Manager use Chrome Alarms and Notifications api

## Demo

[![Extension Demo](https://img.youtube.com/vi/b48iiON4_9A/0.jpg)](https://www.youtube.com/watch?v=b48iiON4_9A)

Watch the demo video to see the extension in action:
- Tab management features
- AI-powered summarization
- Search functionality
- Read Later integration


---


# Prerequisites

1. Acknowledge [Google’s Generative AI Prohibited Uses Policy](https://policies.google.com/terms/generative-ai/use-policy).
2. Download [Canary channel](https://www.google.com/chrome/canary/) and confirm that version is equal or newer than *131.0.6778.2*.

## Enable Gemini Nano

1. Open a new tab in Chrome, go to `chrome://flags/#optimization-guide-on-device-model`
2. Select *Enabled BypassPerfRequirement*

## Enable the Prompt API

1. Open a new tab in Chrome, go to `chrome://flags/#prompt-api-for-gemini-nano`
2. Select *Enabled*

## Enable the Summarization API

1. Open a new tab in Chrome, go to `chrome://flags/#summarization-api-for-gemini-nano`
2. Select *Enabled*

## Enable the Language Detection API

1. Open a new tab in Chrome, go to `chrome://flags/#language-detection-api`
2. Select *Enabled*.

## Enable the Translation API

1. Open a new tab in Chrome, go to `chrome://flags/#translation-api`
2. Select *Enabled*
3. *Relaunch Chrome.*

## Language packs management

Navigate to `chrome://on-device-translation-internals/` to manually install or uninstall language packs.


---


## Development Steps

1. Install dependencies:

```bash
npm install
```

2. Run in development mode:

```bash
npm run dev
```

3. Build the project:

```bash
npm run build
```

## Loading the Extension

After building, you can find the extension in the `.output` directory:

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `.output/chrome-mv3` directory

## License

MIT