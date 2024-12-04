import { defineStore } from 'pinia'

export const useReadLaterStore = defineStore('readLater', {
    state: () => ({
        items: []
    }),
    actions: {
        async init() {
            this.items = await this.getReadLaterItems()
        },

        async getReadLaterItems() {
            try {
                const result = await chrome.runtime.sendMessage({ action: 'getReadLaterItems', query: {} });
                if(result.data) return (result.data.sort(function(a, b) {
                    return b.creationTime - a.creationTime;
                }))

                return [] 
            }
            catch (e) {
                chrome.runtime.sendMessage({ action: 'console', data: 'getReadLaterItems error' });
                return []
            }
        },

        async addToReadLater(title, url) {
            try {
                const result = await chrome.runtime.sendMessage({ action: 'addReadLaterItem', title, url });
                if (!result.success) return false

                this.items = await this.getReadLaterItems()

                return true
            }
            catch (e) {
                chrome.runtime.sendMessage({ action: 'console', data: 'addToReadLater error' });
                return false
            }
        },
    
        async removeFromReadLater(item) {
            try {
                await chrome.runtime.sendMessage({ action: 'removeReadLaterItem', url: item.url });
                this.items = await this.getReadLaterItems()
            }
            catch (e) {
                chrome.runtime.sendMessage({ action: 'console', data: 'removeFromReadLater error' });
            }
        },

        async updateReadLaterItem(item) {
            try {
                await chrome.runtime.sendMessage({ action: 'updateReadLaterItem', item });
                this.items = await this.getReadLaterItems()
            }
            catch (e) {
                chrome.runtime.sendMessage({ action: 'console', data: 'updateReadLaterItem error' });
            }
        },
    }
})