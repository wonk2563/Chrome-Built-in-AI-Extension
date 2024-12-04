import { defineStore } from 'pinia'
import { storage } from 'wxt/storage';

export const useTranslationStore = defineStore('translation', {
    state: () => ({
        targetLang: '',
        isConfigured: false,
        errorMsg: ''
    }),
    getters: {
        hasTargetLang: (state) => state.targetLang !== '' && state.isConfigured
    },
    actions: {
        async init() {
            this.targetLang = await this.getTargetLang()
        },

        async getTargetLang() {
            try {
                const result = await storage.getItem('sync:targetLang')
                if (result) {
                    this.isConfigured = true
                    return result
                }

                return ''
            } 
            catch (error) {
                chrome.runtime.sendMessage({ action: 'console', data: 'getTargetLang error' })
            }
        },
        
        async setTargetLang() {
            try {
                this.errorMsg = ''
                if (!this.targetLang) {
                    this.errorMsg = 'Target Language is required'
                    throw new Error('Target Language is required')
                }

                await storage.setItem('sync:targetLang', this.targetLang)
                this.isConfigured = true
            } 
            catch (error) {
                chrome.runtime.sendMessage({ action: 'console', data: 'setTargetLang error' })
            }
        },

        async clearTargetLang() {
            try {
                await storage.removeItem('sync:targetLang')
                this.targetLang = ''
                this.isConfigured = false
            } 
            catch (error) {
                chrome.runtime.sendMessage({ action: 'console', data: 'clearTargetLang error' })
            }
        },

        async translate(content) {
            try {
                this.errorMsg = ''
                if (!this.hasTargetLang) {
                    this.errorMsg = 'Target Language is required'
                    throw new Error('Target Language is required')
                }

                const translation = await chrome.runtime.sendMessage({ action: 'translate', content: content, targetLanguage: this.targetLang });
                chrome.runtime.sendMessage({ action: 'console', data: translation });
                if (!translation.success) {
                    this.errorMsg = 'translate failed'
                    throw new Error('translate failed')
                }

                return translation
            } 
            catch (error) {
                chrome.runtime.sendMessage({ action: 'console', data: 'translate error' })
                this.errorMsg = 'translate error'
            }
        },
    }
})