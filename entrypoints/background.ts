import { Summarize, Chat, Translate, Detect } from "@/services/aiService";
import { getCurrentTabs, getTabHistory, getVisits } from "@/services/tabService";
import { search, getPageHtml } from "@/services/searchService";
import { addReadLaterItem, getReadLaterItem, removeReadLaterItem, updateReadLaterItem } from "@/services/readLaterService";
import { createNotification, createAlarm, getAllAlarm, clearAlarm } from "@/services/alarmService";

export default defineBackground({
  type: 'module',

  main() {
    chrome.sidePanel
      .setPanelBehavior({ openPanelOnActionClick: true })
      .catch((error) => console.error(error));

    chrome.runtime.onMessage.addListener((message, sender) => {
      (async () => {
        if (message.action === 'console') {
          console.log(message.data);
        }
      })();
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'summary') {
        Summarize(message.content, message.options, sendResponse);
        return true;
      }
    });
    
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'prompt') {
        Chat(message.systemPrompt, message.content, sendResponse);
        return true;
      }
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'translate') {
        Translate(message.content, message.targetLanguage, sendResponse);
        return true;
      }
    });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'detect') {
        Detect(message.content, sendResponse);
        return true;
      }
    });

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      if (message.action === 'getCurrentTabs') {
        getCurrentTabs(sendResponse);
        return true;
      }
    })

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      if (message.action === 'getTabHistory') {
        getTabHistory(sendResponse);
        return true;
      }
    });

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      if (message.action === 'getVisits') {
        getVisits(message.url, sendResponse);
        return true;
      }
    });

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      if (message.action === 'search') {
        search(message.key, message.cx, message.query, sendResponse);
        return true;
      }
    });

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      if (message.action === 'getPageHtml') {
        getPageHtml(message.url, sendResponse);
        return true;
      }
    });

    chrome.runtime.onMessage.addListener(function(message, sender) {
      if (message.action === 'switchTab') {
        chrome.tabs.update(message.tabId, {active: true});
        return true;
      }
    });

    chrome.runtime.onMessage.addListener(function(message, sender) {
      if (message.action === 'openTab') {
        chrome.tabs.create({
          url: message.url
        });
        return true;
      }
    });

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      if (message.action === 'createNotification') {
        createNotification(message.title, message.message, sendResponse);
        return true;
      }
    });

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      if (message.action === 'createAlarm') {
        createAlarm(message.name, message.options, sendResponse);
        return true;
      }
    });

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      if (message.action === 'getAllAlarm') {
        getAllAlarm(sendResponse);
        return true;
      }
    });

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      if (message.action === 'clearAlarm') {
        clearAlarm(message.name, sendResponse);
        return true;
      }
    });

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      if (message.action === 'addReadLaterItem') {
        addReadLaterItem(message.title, message.url, sendResponse);
        return true;
      }
    });

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      if (message.action === 'removeReadLaterItem') {
        removeReadLaterItem(message.url, sendResponse);
        return true;
      }
    });

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      if (message.action === 'getReadLaterItems') {
        getReadLaterItem(message.query, sendResponse);
        return true;
      }
    });

    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
      if (message.action === 'updateReadLaterItem') {
        updateReadLaterItem(message.item, sendResponse);
        return true;
      }
    });

    // read later notifications
    chrome.alarms.onAlarm.addListener(async (alarm) => {
      if (alarm.name.startsWith('readLater_')) {
        const itemUrl = alarm.name.split('_')[1] 
        const items = await chrome.readingList.query( { url: itemUrl });
        const item = items[0]

        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon/32.png',
          title: 'Read reminder',
          message: `${item.title}`,
          requireInteraction: true
        })

        return true
      }
    })
  },
});