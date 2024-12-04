import { extractPageContent } from "@/services/searchService";

export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
      if (message.action === 'extractPageContent') {
        let doc = document;
        if (message?.html) {
          const parser = new DOMParser();
          doc = parser.parseFromString(message.html, 'text/html');
        }

        await extractPageContent(doc, sendResponse);
        return true;
      }
    });
  },
});
