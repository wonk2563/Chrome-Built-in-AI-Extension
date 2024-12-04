import { defineStore } from 'pinia'
import { storage } from 'wxt/storage';
import { useTranslationStore } from '@/stores/translation'

export const useSummaryStore = defineStore('summary', {
    state: () => ({
        summary: {
            title: '',
            content: '',
        },
        history: [],
        options: {
            type: '',
            format: '',
            length: '',
        },
        generating: false,
        errorMsg: ''
    }),
    getters: {
        hasOptions: (state) => state.options.type !== '' && state.options.format !== '' && state.options.length !== '',
        lastSummary: (state) => state.history[state.history.length - 1],
        isSummaryEmpty: (state) => state.summary.title === '' && state.summary.content === '',
        isHistoryEmpty: (state) => state.history.length === 0
    },
    actions: {
        async init() {
            this.summary = await this.get('summary')   
            this.history = await this.get('summaryHistory')
            this.options = await this.get('summaryOptions')
        },

        async clear() {
            try {
                this.errorMsg = ''

                await storage.removeItem('local:summary')
                await storage.removeItem('local:summaryHistory')
                await this.resetSummaryOptions()
                this.summary = {}
                this.history = []
            } 
            catch (error) {
                chrome.runtime.sendMessage({ action: 'console', data: 'summary clear error' })
                this.errorMsg = 'summary clear error'
            }
        },

        async get(key) {
            try {
                this.errorMsg = ''
                
                const result = await storage.getItem(`local:${key}`)
                if (result) {
                    return key === 'summaryHistory' ? Object.values(result) : result
                }
        
                return key === 'summaryHistory' ? [] : {}
            } 
            catch (error) {
                chrome.runtime.sendMessage({ action: 'console', data: `get ${key} error` })
                this.errorMsg = `get ${key} error`

                return key === 'summaryHistory' ? [] : {}
            }
        },

        async setSummary(summary) {
            try {
                this.errorMsg = ''
                this.summary = summary
                await storage.setItem('local:summary', summary)
                await this.setSummaryHistory(summary)
            } 
            catch (error) {
                chrome.runtime.sendMessage({ action: 'console', data: 'setSummaryHistory error' })
                this.errorMsg = 'setSummaryHistory error'
            }
        },

        async setSummaryHistory(summary) {
            try {
                this.errorMsg = ''
                if (!Array.isArray(this.history)) {
                    this.history = [];
                }
                this.history.unshift(summary)
                chrome.runtime.sendMessage({ action: 'console', data: this.history });
                await storage.setItem('local:summaryHistory', this.history)
            } 
            catch (error) {
                chrome.runtime.sendMessage({ action: 'console', data: 'setSummaryHistory error' })
                this.errorMsg = 'setSummaryHistory error'
            }
        },

        async removeFromSummaryHistory(summary) {
            try {
                this.errorMsg = ''
                this.history = this.history.filter((item) => item !== summary)
                await storage.setItem('local:summaryHistory', this.history)
            } 
            catch (error) {
                chrome.runtime.sendMessage({ action: 'console', data: 'removeSummaryHistory error' })
                this.errorMsg = 'removeSummaryHistory error'
            }
        },

        async setSummaryOptions() {
            try {
                this.errorMsg = ''
                if (!this.options.type || !this.options.format || !this.options.length) {
                    this.errorMsg = 'Type, Format and Length is required'
                    throw new Error('Type, Format and Length is required')
                }

                await storage.setItem('local:summaryOptions', this.options)
            } 
            catch (error) {
                chrome.runtime.sendMessage({ action: 'console', data: 'setSummaryOptions error' })
            }
        },

        async resetSummaryOptions() {
            try {
                this.errorMsg = ''
                await storage.setItem('local:summaryOptions', {
                    type: 'key-points',
                    format: 'plain-text',
                    length: "long"
                })
                this.options = {
                    type: 'key-points',
                    format: 'plain-text',
                    length: "long"
                }
            } 
            catch (error) {
                chrome.runtime.sendMessage({ action: 'console', data: 'resetSummaryOptions error' })
                this.errorMsg = 'resetSummaryOptions error'
            }
        },

        async generateSummary(title, tabId, url='') {
            try {
                this.errorMsg = ''
                this.generating = true

                let response
                if (url === '') response = await chrome.tabs.sendMessage(tabId, { action: 'extractPageContent' })
                else {
                    const html = await chrome.runtime.sendMessage({ action: 'getPageHtml', url: url });
                    response = await chrome.tabs.sendMessage(tabId, { action: 'extractPageContent', html: html.data })
                }

                if (!response.success) {
                    chrome.runtime.sendMessage({ action: 'console', data: 'extractPageContent failed' });
                    this.errorMsg = 'extractPageContent failed'
                    this.generating = false
                    throw new Error('extractPageContent failed')
                }

                const summary = await chrome.runtime.sendMessage({ action: 'summary', options: this.options, content: response.data });

                if (!summary.success) {
                    chrome.runtime.sendMessage({ action: 'console', data: 'summary failed' });
                    this.errorMsg = 'summary failed'
                    this.generating = false

                    return {
                        success: false
                    }
                }
                
                const translationstore = useTranslationStore()
                const translate = await translationstore.translate(summary.data)
                if (!translate.success) {
                    this.setSummary({ title: title, content: summary.data, date: new Date().toISOString() });
                    this.generating = false

                    return {
                        success: true,
                        data: summary.data
                    }
                }

                this.setSummary({ title: title, content: translate.data, date: new Date().toISOString() });
                this.generating = false

                return {
                    success: true,
                    data: translate.data
                }
            } 
            catch (error) {
                chrome.runtime.sendMessage({ action: 'console', data: 'generateSummary error' })
                this.errorMsg = 'generateSummary error'
                this.generating = false
            }
        },

        async generateSummaryFromCurrentTab() {
            try {
                this.errorMsg = ''
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

                return await this.generateSummary(tab.title, tab.id)
            } 
            catch (error) {
                chrome.runtime.sendMessage({ action: 'console', data: 'generateSummaryFromCurrentTab error' })
                this.errorMsg = 'generateSummaryFromCurrentTab error'
            }
        },

        async generateSummaryFromUrl(title, url) {
            try {
                this.errorMsg = ''
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

                return await this.generateSummary(title, tab.id, url)
            } 
            catch (error) {
                chrome.runtime.sendMessage({ action: 'console', data: 'generateSummaryFromUrl error' })
                this.errorMsg = 'generateSummaryFromUrl error'
            }
        },
    }
})