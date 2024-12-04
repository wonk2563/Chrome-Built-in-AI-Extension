import { defineStore } from 'pinia'
import { storage } from 'wxt/storage';

export const useSecretStore = defineStore('secret', {
    state: () => ({
        customSearchKey: '',
        customSearchCX: '',
        isCustomSearchConfigured: false,
        errorMsg: ''
    }),
    getters: {
        hasCustomSearchKey: (state) => state.customSearchKey !== '' && state.customSearchCX !== '' && state.isCustomSearchConfigured
    },
    actions: {
        // 初始化所有
        async init() {
            await this.initCustomSearchKey()
        },

        // 儲存所有
        async save() {
            await this.setCustomSearchKey()
        },

        // 清除所有
        async clear() {
            await this.clearCustomSearchKey()
        },

        // 初始化 Custom Search Key
        async initCustomSearchKey() {
            try {
                storage.watch('session:customSearchKey', async (newValue, oldValue) => {
                    this.customSearchKey = newValue
                    
                    if (this.customSearchKey && this.customSearchCX) {
                        this.isCustomSearchConfigured = true
                    }
                });

                storage.watch('session:customSearchCX', async (newValue, oldValue) => {
                    this.customSearchCX = newValue

                    if (this.customSearchKey && this.customSearchCX) {
                        this.isCustomSearchConfigured = true
                    }
                });

                this.customSearchKey = await this.getCustomSearchKey()
                this.customSearchCX = await this.getCustomSearchCX()

                if (this.customSearchKey && this.customSearchCX) {
                    this.isCustomSearchConfigured = true
                }
            } 
            catch (error) {
                chrome.runtime.sendMessage({ action: 'console', data: 'initCustomSearchKey error' })
            }
        },

        // 取得 Custom Search Key
        async getCustomSearchKey() {
            try {
                const result = await storage.getItem('session:customSearchKey')
                if (result) return result

                return ''
            } 
            catch (error) {
                chrome.runtime.sendMessage({ action: 'console', data: 'getCustomSearchKey error' })
            }
        },

        // 取得 Custom Search CX
        async getCustomSearchCX() {
            try {
                const result = await storage.getItem('session:customSearchCX')
                if (result) return result

                return ''
            } 
            catch (error) {
                chrome.runtime.sendMessage({ action: 'console', data: 'getCustomSearchCX error' })
            }
        },

        // 儲存 Custom Search Key
        async setCustomSearchKey() {
            this.errorMsg = ''
            if (!this.customSearchKey || !this.customSearchCX) {
                this.errorMsg = 'Key & CX is required'
                throw new Error('API key is required')
            }

            try {
                await storage.setItem('session:customSearchKey', this.customSearchKey),
                await storage.setItem('session:customSearchCX', this.customSearchCX),
                this.isCustomSearchConfigured = true
            }
            catch (error) {
                chrome.runtime.sendMessage({ action: 'console', data: 'setCustomSearchKey error' })
            }
        },

        // 刪除 Custom Search Key
        async clearCustomSearchKey() {
            try {
                await storage.removeItem('session:customSearchKey')
                await storage.removeItem('session:customSearchCX')
                this.customSearchKey = ''
                this.customSearchCX = ''
                this.isCustomSearchConfigured = false
            }
            catch (error) {
                chrome.runtime.sendMessage({ action: 'console', data: 'deleteCustomSearchKey error' })
            }
        },
    }
})