export async function addReadLaterItem(title: string, url: string, sendResponse: (response: any) => void) {
    try {
        chrome.readingList.addEntry({
            title: title,
            url: url,
            hasBeenRead: false
          });

        sendResponse({
            success: true,
            data: null,
            error: null
        });
    }
    catch (e) {
        console.log(e);
        sendResponse({
            success: false,
            data: null,
            error: e
        });
    }
}

export async function removeReadLaterItem(url: string, sendResponse: (response: any) => void) {
    try {
        chrome.readingList.removeEntry({
            url
          });

        sendResponse({
            success: true,
            data: null,
            error: null
        });
    }
    catch (e) {
        console.log(e);
        sendResponse({
            success: false,
            data: null,
            error: e
        });
    }
}

export async function getReadLaterItem(query: object, sendResponse: (response: any) => void) {
    try {
        const items = await chrome.readingList.query(query);

        sendResponse({
            success: true,
            data: items,
            error: null
        });
    }
    catch (e) {
        console.log(e);
        sendResponse({
            success: false,
            data: null,
            error: e
        });
    }
}

export async function updateReadLaterItem(item: object, sendResponse: (response: any) => void) {
    try {
        chrome.readingList.updateEntry(item);

        sendResponse({
            success: true,
            data: null,
            error: null
        });
    }
    catch (e) {
        console.log(e);
        sendResponse({
            success: false,
            data: null,
            error: e
        });
    }
}