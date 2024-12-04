<template>
  <div class="mx-auto p-4 bg-white dark:bg-gray-900">
    <div 
      v-if="alarmStore.alarms.length === 0" 
      class="text-center text-gray-500 py-8 animate-slide-up"
    >
      <Clock class="mx-auto h-12 w-12 mb-4 text-primary-500" />
      <p>No alarms</p>
    </div>

    <div 
      v-else 
      class="space-y-4 animate-fade-in"
    >
      <Alert 
        v-for="alarm in alarmStore.alarms" :key="alarm"
        class="grid grid-cols-7 gap-4 justify-between items-center w-full cursor-pointer bg-gray-200 hover:bg-gray-300 duration-300 transition-colors" 
        @click="openItem(alarm)"
      >
        <div class="col-span-7 flex flex-col justify-between items-center">
          <div class="flex flex-row items-center w-full max-w-full">
            <AlertDescription class="text-start w-full max-w-full">
              <div class="grid grid-cols-7 gap-4 justify-between items-center w-full">
                <div class="col-span-6">
                  <span class="font-semibold text-lg line-clamp-1">{{ alarm.name.split('_')[1] }}</span>
                </div>

                <div class="col-span-1 flex flex-col items-center space-y-2">
                  <TooltipProvider :delayDuration="0">
                    <Tooltip>
                      <TooltipTrigger>
                        <Button variant="ghost" size="icon" @click.stop="alarmStore.removealarm(alarm.name)">
                          <Trash2
                            :size="32"
                          />
                        </Button>
                      </TooltipTrigger>

                      <TooltipContent side="left">
                          <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div class="col-span-6 flex flex-col self-start space-y-2">
                  <Badge class="bg-gray-600">
                    In: {{ getDate(alarm.options.when) }}
                  </Badge>

                  <Badge :class="alarm.options.when < Date.now() ? 'bg-red-400' : 'bg-green-400'">
                    {{ alarm.options.when < Date.now() ? 'Passed' : 'Not pass yet' }}
                  </Badge>

                  <Badge v-if="alarm.options.periodInMinutes" class="bg-gray-400">
                    Every {{ alarm.options.periodInMinutes }} minutes
                  </Badge>
                </div>
              </div>
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </div>
  </div>
</template>

<script setup>
  import { Alert, AlertDescription } from '@/components/ui/alert'
  import {
        Tooltip,
        TooltipContent,
        TooltipProvider,
        TooltipTrigger
    } from '@/components/ui/tooltip'
  import { Button } from '@/components/ui/button'
  import Badge from './ui/badge/Badge.vue'
  import { Bell, BookOpen, Clock, Plus, Trash2 } from 'lucide-vue-next'
  import { useReadLaterStore } from '@/stores/readlater'
  import { useAlarmStore } from '@/stores/alarm'

  const readLaterStore = useReadLaterStore()
  const alarmStore = useAlarmStore()

  async function openItem(item) {
    const url = item.name.split('_')[1]

    chrome.tabs.create({ url })
    await readLaterStore.updateReadLaterItem({ url, hasBeenRead: true })
    await alarmStore.removealarm(`readLater_${url}`)
  }

  const getDate = (date) => {
    const d = new Date(date)

    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()

    const hours = d.getHours()
    const minutes = d.getMinutes()

    return `${year}-${month}-${day} ${hours}:${minutes}`
  }
</script>