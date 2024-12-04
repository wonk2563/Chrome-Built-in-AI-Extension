# AI-Powered Chrome Extension

A smart tab management extension powered by Chrome's built-in AI capabilities.

## Background & Inspiration

During daily web browsing, I often find myself overwhelmed with numerous open tabs, leading to a cluttered browser interface. I wanted a tool that could help me better manage these tabs and quickly understand the content of each page. Chrome's recent introduction of built-in AI features inspired me - why not integrate AI capabilities into tab management?

## Key Features

- AI Tab Manager: Intelligently organize tabs using Chrome's built-in AI Prompt API
- AI Summary Manager: Quickly extract page summaries using Chrome's built-in AI Summary API and Translation API
- AI Search Manager: Combine Chrome AI Prompt API with Google Custom Search API
- Read Later Manager: Integration with Chrome ReadingList and Alarm API
- Alarm Manager: Built on Chrome Alarms and Notifications API

## Technical Implementation

This project is built with:

- WXT: Modern browser extension development framework
- Vue 3: Progressive JavaScript framework
- Pinia: State management solution for Vue
- Chrome Extensions API: For browser extension functionality

## Development Challenges

1. Chrome AI API Rate Limiting
   - Solution: Implemented request queuing and error retry mechanisms

2. Real-time Tab Data Synchronization
   - Solution: Utilized Chrome storage API with Vue's reactivity system

3. Prompt Optimization
   - Token Length Control
     - Implemented smart text truncation to stay within model's token limits
     - Dynamic prompt templates based on content type
     - Automatic content summarization for long pages
   
   - Prompt Engineering
     - Designed specialized prompts for different tasks:
       - Tab grouping: Focus on URL patterns and page semantics
       - Content summarization: Emphasis on key points extraction
       - Search enhancement: Query reformulation and expansion
     - Implemented prompt chaining for complex operations
   
   - Response Quality Control
     - Structured output formatting for consistent results
     - Error handling for incomplete or invalid responses
     - Fallback mechanisms for rate-limited API calls

## Demo

[![Extension Demo](https://img.youtube.com/vi/b48iiON4_9A/0.jpg)](https://www.youtube.com/watch?v=b48iiON4_9A)

Watch the demo video to see the extension in action:
- Tab management features
- AI-powered summarization
- Search functionality
- Read Later integration

## Development Guide

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

## Build Output Structure

After building, the `.output` directory will contain:

```
.output/
└── chrome-mv3/        # Chrome Manifest V3 extension
```

## Installing the Extension

After building, find the extension in the `.output` directory:

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `.output/chrome-mv3` directory

## Future Plans

- [ ] Support for additional AI models
- [ ] Tab grouping functionality
- [ ] Enhanced UI/UX design
- [ ] Multi-browser support

## License

MIT