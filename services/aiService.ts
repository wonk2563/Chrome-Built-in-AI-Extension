export async function Summarize(content: string, options: any, sendResponse: (response: any) => void) {
  try {
    const tabs = await chrome.tabs.query({ active: true });
    if (!tabs || !tabs[0] || !tabs[0].id) {
      sendResponse({
        success: false,
        data: null,
        error: "No active tab found"
      });
      return;
    }

    const results = await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: GenerateSummary,
      args: [content, options],
    });

    sendResponse(results[0].result);
  } catch (error) {
    sendResponse({
      success: false,
      data: null,
      error: error
    });
  }
}

async function GenerateSummary(content: string, options: any) {
  try {
    const canSummarize = await self.ai.summarizer.capabilities();
    if (!canSummarize || canSummarize.available === 'no') {
      throw new Error('Summarizer not available');
    }

    const summarizer = await self.ai.summarizer.create({ type: options.type, format: options.format, length: options.length });
    const result = await summarizer.summarize(content);

    summarizer.destroy();

    return {
      success: true,
      data: result,
      error: null
    };
  }
  catch (e) {
    console.log(e);
    return {
      success: false,
      data: null,
      error: e
    };
  }
}

export async function Chat(systemPrompt: string, content: string, sendResponse: (response: any) => void) {
  try {
      const tabs = await chrome.tabs.query({ active: true });
      if (!tabs || !tabs[0] || !tabs[0].id) {
          sendResponse({
              success: false,
              data: null,
              error: "No active tab found"
          });
          return;
      }

      const results = await chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: Prompt,
          args: [systemPrompt, content],
      });

      sendResponse(results[0].result);
  } catch (error) {
      sendResponse({
          success: false,
          data: null,
          error: error
      });
  }
}

async function Prompt(systemPrompt: string, content: string) {
  try {
    const capabilities = await self.ai.languageModel.capabilities();
    if (!capabilities || capabilities.available === "no") {
      throw new Error("Language model not available");
    }

    const session = await self.ai.languageModel.create({
      systemPrompt: systemPrompt
    });

    const result = await session.prompt(content);

    session.destroy();

    return {
      success: true,
      data: result,
      error: null
    };
  } 
  catch (e) {
    console.log(e);
    return {
      success: false,
      data: null,
      error: e
    }
  }
}

export async function Translate(content: string, targetLanguage: string, sendResponse: (response: any) => void) {
  try {
    const tabs = await chrome.tabs.query({ active: true });
    if (!tabs || !tabs[0] || !tabs[0].id) {
      sendResponse({
        success: false,
        data: null,
        error: "No active tab found"
      });
      return;
    }

    const detectionResults = await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: LanguageDetection,
      args: [content],
    });

    if (!detectionResults || !detectionResults[0] || !detectionResults[0].result || !detectionResults[0].result?.success) {
      sendResponse({
        success: false,
        data: null,
        error: "Language detection failed"
      });
      return;
    }
    if (detectionResults[0].result?.data.detectedLanguage === targetLanguage) {
      sendResponse({
        success: true,
        data: content,
        error: null
      });
      return;
    }

    const translationResults = await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: Translation,
      args: [content, detectionResults[0].result?.data.detectedLanguage, targetLanguage],
    });

    sendResponse(translationResults[0].result);
  } catch (error) {
    sendResponse({
      success: false,
      data: null,
      error: error
    });
  }
}

async function Translation(content: string, detectedLanguage: string, targetLanguage: string) {
  try {
    const languagePair = {
      sourceLanguage: detectedLanguage,
      targetLanguage: 'zh-Hant',
    };

    const canTranslate = await self.translation.canTranslate(languagePair);
    if (!canTranslate || canTranslate !== 'readily') {
      throw new Error('Translator not available');
    }

    const translator = await self.translation.createTranslator(languagePair);
    const results = await translator.translate(content);
    
    translator.destroy();

    return {
      success: true,
      data: results,
      error: null
    };
  }
  catch (e) {
    console.log(e);
    return {
      success: false,
      data: null,
      error: e
    }
  }
}

export async function Detect(content: string, sendResponse: (response: any) => void) {
  try {
    const tabs = await chrome.tabs.query({ active: true });
    if (!tabs || !tabs[0] || !tabs[0].id) {
      sendResponse({
        success: false,
        data: null,
        error: "No active tab found"
      });
      return;
    }

    const results = await chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: LanguageDetection,
      args: [content],
    });

    sendResponse(results[0].result);
  } catch (error) {
    sendResponse({
      success: false,
      data: null,
      error: error
    });
  }
}

async function LanguageDetection(content: string) {
  try {
    const canDetect = await self.translation.canDetect();
    if (!canDetect || canDetect !== 'readily') {
      throw new Error('LanguageDetector not available');
    }

    const detector = await self.translation.createDetector();
    const results = await detector.detect(content);

    return {
      success: true,
      data: results[0],
      error: null
    };
  }
  catch (e) {
    console.log(e);
    return {
      success: false,
      data: null,
      error: e
    }
  }
}
