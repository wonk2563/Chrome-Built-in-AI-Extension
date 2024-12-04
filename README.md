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

# WXT + Vue 3 + Pinia

Developing with Vue 3 and Pinia in WXT.

### Development Steps

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

### Loading the Extension

After building, you can find the extension in the `.output` directory:

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `.output/chrome-mv3` directory

### Build Output Structure

After building, the `.output` directory will contain:

```
.output/
└── chrome-mv3/        # Chrome Manifest V3 extension
```

## License

MIT