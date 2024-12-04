export async function search(key: string, cx: string, query: string, sendResponse: (response: any) => void) {
  try {
    fetch(`https://www.googleapis.com/customsearch/v1?key=${key}&cx=${cx}&q=${query}`).then(r => r.json()).then(result => {
      sendResponse({
        success: true,
        data: result,
        error: null
      });
    })
  } 
  catch (e) {
    console.log('search error', e)
    sendResponse({
      success: false,
      data: null,
      error: e
    });
  }
}

export async function getPageHtml(url: string, sendResponse: (response: any) => void) {
  try {
    fetch(url).then(r => r.text()).then(result => {
      sendResponse({
        success: true,
        data: result,
        error: null
      });
    })
  }
  catch (e) {
    console.log('getPageHtml error', e)
    sendResponse({
      success: false,
      data: null,
      error: e
    });
  }
}

export async function extractPageContent(doc: Document, sendResponse: (response: any) => void) {
  const articleSelectors = [
    'article',
    'main',
    '.content',
    '.post-content',
    '.article-content',
    '#content',
    '.entry-content',
    '[role="main"]'
  ];
  
  const article = doc.querySelector(articleSelectors.join(', '));
  
  if (article) {
    const cleanContent = cleanArticleContent(article);
    sendResponse({
      success: true,
      data: cleanContent,
      error: null
    });
    return;
  }
  
  const paragraphs = Array.from(doc.querySelectorAll('p, h1, h2, h3, h4, h5, h6'))
    .map(element => element.textContent?.trim())
    .filter(text => {
      if (!text) return false;
      return text.length > 50 && 
             !text.match(/cookie|privacy policy|terms of use/i);
    })
    .slice(0, 10);

  sendResponse({
    success: true,
    data: paragraphs.join('\n\n'),
    error: null
  });
}

function cleanArticleContent(element: Element): string {
  const unwantedSelectors = [
    'script',
    'style',
    'nav',
    'header',
    'footer',
    '.advertisement',
    '.social-share',
    '.comments'
  ];
  
  const clone = element.cloneNode(true) as Element;
  unwantedSelectors.forEach(selector => {
    clone.querySelectorAll(selector).forEach(el => el.remove());
  });
  
  return clone.textContent?.trim() || '';
}