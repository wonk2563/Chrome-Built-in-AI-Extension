import { defineStore } from 'pinia'
import { storage } from 'wxt/storage';

export const useAlarmStore = defineStore('alarm', {
    state: () => ({
        alarms: [],
        errMsg: ''
    }),

    actions: {
        async init() {
            this.alarms = await this.getalarms()
            const alarms = await chrome.runtime.sendMessage({ action: 'getAllAlarm' })
            chrome.runtime.sendMessage({ action: 'console', data: { alarms, this_alarms: this.alarms } })

            for (const alarm of this.alarms) {
                if (alarms.data.find((a) => a.name === alarm.name)) continue
                if (alarm.options?.when < Date.now()) continue

                await chrome.runtime.sendMessage({ action: 'createAlarm', name: alarm.name, options: alarm.options })
            }
        },

        async getalarms() {
            const alarms = await storage.getItem('local:alarms')
            if (alarms) return Object.values(alarms)

            return []
        },

        async setalarms(name, options) {
            try {
                const alarms = await chrome.runtime.sendMessage({ action: 'getAllAlarm' })
                for (const alarm of alarms.data) {
                    if (alarm.name === name) {
                        await chrome.runtime.sendMessage({ action: 'clearAlarm', name })
                    }
                }

                await chrome.runtime.sendMessage({ action: 'createAlarm', name, options })

                this.alarms = this.alarms.filter((a) => a.name !== name)
                this.alarms.push({ name, options })
                await storage.setItem('local:alarms', this.alarms)
            }
            catch (e) {
                chrome.runtime.sendMessage({ action: 'console', data: 'setalarms error' })
                this.errMsg = 'setalarms error'
            }
        },

        async removealarm(name) {
            try {
                await chrome.runtime.sendMessage({ action: 'clearAlarm', name })
                this.alarms = this.alarms.filter((a) => a.name !== name)
                await storage.setItem('local:alarms', this.alarms)
            }
            catch (e) {
                chrome.runtime.sendMessage({ action: 'console', data: 'removealarm error' })
                this.errMsg = 'removealarm error'
            }
        },

        async clearalarms() {
            this.alarms = []
            const alarms = await chrome.runtime.sendMessage({ action: 'getAllAlarm' })
            for (const alarm of alarms.data) {
                await chrome.runtime.sendMessage({ action: 'clearAlarm', name: alarm.name })
            }
            await storage.removeItem('local:alarms')
        }
    }
})