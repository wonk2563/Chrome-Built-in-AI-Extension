    export async function getCurrentTabs(sendResponse: (response: any) => void) {
      try {
        const queryOptions = {};
        const tabs = await chrome.tabs.query(queryOptions)

        sendResponse({
          success: true,
          data: tabs,
          error: null
        })
      }
      catch (e) {
        console.log(e);
        sendResponse({
          success: false,
          data: null,
          error: e
        })
      }
    };

    export async function getTabHistory(sendResponse: (response: any) => void) {
      try {
        let queryOptions = { text: '' };
        let historys = await chrome.history.search(queryOptions);

        sendResponse({
          success: true,
          data: historys,
          error: null
        });
      }
      catch (e) {
        console.log(e);
        sendResponse({
          success: false,
          data: null,
          error: e
        })
      }
    }

    export async function getVisits(url: string, sendResponse: (response: any) => void) {
      try {
        chrome.history.getVisits({ url }, (historys) => {
          sendResponse({
            success: true,
            data: historys,
            error: null
          });
        });
      }
      catch (e) {
        console.log(e);
        sendResponse({
          success: false,
          data: null,
          error: e
        })
      }
    }

    export async function openTab(url: string) {
      await chrome.tabs.create({ url });
    }