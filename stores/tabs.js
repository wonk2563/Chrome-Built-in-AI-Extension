import { defineStore } from 'pinia'
import { storage } from 'wxt/storage';

export const useTabsStore = defineStore('tabs', {
    state: () => ({
        tabs: [],
        isSorted: false,
        sorting: false,
        lastSorted: null,
        errMsg: ''
    }),

    actions: {
        async init() {
            this.tabs = await this.getTabs()
            this.lastSorted = await this.getLastSorted()
            await this.setSortTabsTimer()
        },

        async getTabs() {
            let tabs = await storage.getItem('local:tabs')
            if (tabs) {
                this.isSorted = true
                return tabs
            }
            
            tabs = await chrome.runtime.sendMessage({ action: 'getCurrentTabs' });
            const historys = await chrome.runtime.sendMessage({ action: 'getTabHistory' });
            return await this.simplifyTabsData(tabs.data, historys.data);
        },

        async getLastSorted() {
            let lastSorted = await storage.getItem('local:lastSorted')
            if (lastSorted) return lastSorted

            return null
        },

        async setLastSorted(lastSorted) {
            try {
                this.errMsg = ''
                this.lastSorted = lastSorted
                await storage.setItem('local:lastSorted', lastSorted)
            }
            catch (error) {
                this.errMsg = 'setLastSorted error'
                chrome.runtime.sendMessage({ action: 'console', data: error });
            }
        },

        async sortTabs(force=false) {
            try {
                if (this.sorting) return
                if (Date.now() - this.lastSorted < 5 * 60 * 1000 && !force) return

                chrome.runtime.sendMessage({ action: 'console', data: 'sortTabs' });
                this.sorting = true
                this.setLastSorted(Date.now())
                this.errMsg = ''
                
                const tabs = await chrome.runtime.sendMessage({ action: 'getCurrentTabs' });
                const historys = await chrome.runtime.sendMessage({ action: 'getTabHistory' });
                const simplifiedTabs = await this.simplifyTabsData(tabs.data, historys.data);
                const response = await chrome.runtime.sendMessage({ 
                    action: 'prompt', 
                    systemPrompt: `
                    Analyze the provided browser tabs data and determine the user's most likely required tab. Evaluate relevance based on the following criteria:  
                    - Last Accessed: Higher preference for recently accessed tabs.  
                    - Visits in 24 Hours: Tabs with more visits in the last 24 hours should be prioritized.  
                    - Total Visits: Tabs with a higher total visit count indicate ongoing or important tasks.  
                    - Title Relevance: Titles that imply user engagement (e.g., search results, ongoing tasks, or interactive tools).  

                    For each tab, assign a likelihood score between 0 (least relevant) and 1 (most relevant). Weight the factors proportionally, with the highest priority given to recent access and frequent usage.  

                    The response must meet the following requirements:
                    1. Include only the following fields for each tab: \`id\`, \`title\`, \`favIconUrl\`, \`lastAccessed\`, \`visitsIn24Hours\`, \`totalVisits\`, and \`likelihoodScore\`.
                    2. Ensure the \`id\` field remains unchanged and consistent with the input data.
                    3. Sort the response array in descending order by the \`likelihoodScore\`.
                    4. Each tab’s \`likelihoodScore\` should be a number between 0 and 1, indicating the likelihood of relevance.
                    5. The \`title\` should remain unchanged and exactly match the input data.
                    6. Do not add or remove any tabs from the input array; simply adjust their format and calculate the \`likelihoodScore\`.
                    
                    Return the tabs sorted by score in descending order in JSON format. Example output:

                    [
                        {
                            "id": 12345,
                            "title": "Example Tab Title",
                            "favIconUrl": "https://example.com/favicon.ico",
                            "lastAccessed": 1667307600000,
                            "visitsIn24Hours": 5,
                            "totalVisits": 10,
                            "likelihoodScore": 0.95
                        },
                        {
                            "id": 67890,
                            "title": "Another Tab",
                            "favIconUrl": "https://example.com/anotherfavicon.ico",
                            "lastAccessed": 1667307200000,
                            "visitsIn24Hours": 3,
                            "totalVisits": 8,
                            "likelihoodScore": 0.78
                        }
                    ]

                    Focus on identifying the most relevant tab for the user. Ensure the results are concise and sorted by score.
                    `.trim(), 
                    content: JSON.stringify(simplifiedTabs)
                });

                if (!response.success) {
                    this.errMsg = 'sortTabs failed'
                    this.sorting = false
                    return
                }
                
                const validResult =  await this.validateModelResponse(response.data)
                if (!validResult.valid) {
                    this.errMsg = validResult.message
                    this.sorting = false
                    return
                }

                chrome.runtime.sendMessage({ action: 'console', data: 'sortTabs success' });
                this.tabs = validResult.data
                this.sorting = false
                this.isSorted = true
                await storage.setItem('local:tabs', validResult.data);
            }
            catch (error) {
                chrome.runtime.sendMessage({ action: 'console', data: error });
            }
        },

        // 每 5 分鐘排序 
        async setSortTabsTimer() {
            const alarms = await chrome.runtime.sendMessage({ action: 'getAllAlarm' });

            for (const alarm of alarms.data) {
                if (alarm.name === 'SortTabs') {
                    await chrome.runtime.sendMessage({ action: 'clearAlarm', name: 'SortTabs' });
                }
            }

            const alarm = await chrome.runtime.sendMessage({ action: 'createAlarm', name: 'SortTabs', options: { 
                periodInMinutes: 5,
                when: Date.now() + 1 * 1000
            }});

            const alarmListener = async (alarm) => {
                if (alarm.name === 'SortTabs') {
                    await this.sortTabs()
                }
            }

            chrome.alarms.onAlarm.removeListener(alarmListener);

            if (alarm.success) {
                chrome.alarms.onAlarm.addListener(alarmListener);
            }
        },

        async simplifyTabsData(tabs, historys) {
            return Promise.all(tabs.map(async tab => ({
              id: tab.id,
              title: tab.title,
              favIconUrl: tab.favIconUrl || '',
              lastAccessed: tab.lastAccessed,
              visitsIn24Hours: historys.filter(history => history.url === tab.url)[0]?.visitCount || 0,
              totalVisits: (await chrome.runtime.sendMessage({ action: 'getVisits', url: tab.url })).data.length,
            })));
        },

        async validateModelResponse(response) {
            const jsonResponse = JSON.parse(response);
            chrome.runtime.sendMessage({ action: 'console', data: jsonResponse });

            if (!Array.isArray(jsonResponse)) {
                return { valid: false, message: "Response is not an array." };
            }
        
            for (const item of jsonResponse) {
                // Check if required fields exist and have correct types
                if (typeof item.id !== "number") {  
                    return { valid: false, message: `Invalid or missing 'id' in item: ${JSON.stringify(item)}` };
                }
                if (typeof item.title !== "string") {
                    return { valid: false, message: `Invalid or missing 'title' in item: ${JSON.stringify(item)}` };
                }
                if (typeof item.favIconUrl !== "string") {
                    return { valid: false, message: `Invalid or missing 'favIconUrl' in item: ${JSON.stringify(item)}` };
                }
                if (typeof item.lastAccessed !== "number") {
                    return { valid: false, message: `Invalid or missing 'lastAccessed' in item: ${JSON.stringify(item)}` };
                }
                if (typeof item.visitsIn24Hours !== "number" || item.visitsIn24Hours < 0) {
                    return { valid: false, message: `Invalid or missing 'visitsIn24Hours' in item: ${JSON.stringify(item)}` };
                }
                if (typeof item.totalVisits !== "number" || item.totalVisits < 0) {
                    return { valid: false, message: `Invalid or missing 'totalVisits' in item: ${JSON.stringify(item)}` };
                }
                if (typeof item.likelihoodScore !== "number" || item.likelihoodScore < 0 || item.likelihoodScore > 1) {
                    return { valid: false, message: `Invalid 'likelihoodScore' in item: ${JSON.stringify(item)}` };
                }
            }
        
            // Check if the array is sorted in descending order by likelihoodScore
            for (let i = 1; i < jsonResponse.length; i++) {
                if (jsonResponse[i - 1].likelihoodScore < jsonResponse[i].likelihoodScore) {
                    return { valid: false, message: "Array is not sorted by 'likelihoodScore' in descending order." };
                }
            }
        
            return { valid: true, message: "Response is valid.", data: jsonResponse };
        },

        async switchTab(tabId) {
            await chrome.runtime.sendMessage({ action: 'switchTab', tabId });
        },
    }
})