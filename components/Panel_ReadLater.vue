<template>
  <div class="mx-auto p-4 bg-white dark:bg-gray-900">
    <div 
      v-if="readLaterStore.items.length === 0" 
      class="text-center text-gray-500 py-8 animate-slide-up"
    >
      <BookOpen class="mx-auto h-12 w-12 mb-4 text-primary-500" />
      <p>No read later items</p>
    </div>

    <div 
      v-else 
      class="space-y-4 animate-fade-in"
    >
      <Alert 
        v-for="item in readLaterStore.items" :key="item"
        class="grid grid-cols-7 gap-4 justify-between items-center w-full cursor-pointer bg-gray-200 hover:bg-gray-300 duration-300 transition-colors" 
        @click="openItem(item)"
      >
        <div class="col-span-7 flex flex-col justify-between items-center">
          <div class="flex flex-row items-center w-full max-w-full">
            <AlertDescription class="text-start w-full max-w-full">
              <div class="grid grid-cols-7 gap-4 justify-between items-center w-full">
                <div class="col-span-6">
                  <span class="font-semibold text-lg line-clamp-1">{{ item.title }}</span>
                  <span class="font-semibold text-gray-400 line-clamp-1">{{ item.url }}</span>
                  <br>
                  <span class="text-gray-800 line-clamp-3">{{ item.content }}</span>
                </div>

                <div class="col-span-1 flex flex-col items-center space-y-2">
                  <TooltipProvider :delayDuration="0">
                    <Tooltip>
                      <TooltipTrigger>
                        <Button variant="ghost" size="icon" @click.stop="readLaterStore.removeFromReadLater(item)">
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

                  <TooltipProvider :delayDuration="0">
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertDialog>
                          <AlertDialogTrigger @click.stop>
                            <Button 
                              variant="ghost" 
                              size="icon"
                            >
                              <Bell
                                :size="32"
                              />
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Setting reminder</AlertDialogTitle>

                              <AlertDialogDescription class="space-y-10">
                                <p class="text-sm text-muted-foreground">Set how many times before you want to be reminded</p>

                                <div class="space-y-4">
                                  <Select v-model="selectedNumber">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Number to set"/>
                                    </SelectTrigger>

                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectItem v-for="nitem in numberItems" :key="nitem" :value="nitem">
                                          {{ nitem }}
                                        </SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>

                                  <Select v-model="selectedUnit">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Unit to set"/>
                                    </SelectTrigger>

                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectItem v-for="uitem in unitItems" :key="uitem" :value="uitem">
                                          {{ uitem }}
                                        </SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div class="flex items-center space-x-2">
                                  <Checkbox id="terms" :checked="repeat" @click="repeat = !repeat" />
                                  <label
                                    for="terms"
                                    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                  >
                                    Repeat
                                  </label>
                                </div>

                                <div v-if="repeat" class="space-y-4">
                                  <Select v-model="selectedRepeatNumber">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Repeat Number to set"/>
                                    </SelectTrigger>

                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectItem v-for="nitem in numberItems" :key="nitem" :value="nitem">
                                          {{ nitem }}
                                        </SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>

                                  <Select v-model="selectedRepeatUnit">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Repeat Unit to set"/>
                                    </SelectTrigger>

                                    <SelectContent>
                                      <SelectGroup>
                                        <SelectItem v-for="uitem in unitItems" :key="uitem" :value="uitem">
                                          {{ uitem }}
                                        </SelectItem>
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </AlertDialogDescription>

                            </AlertDialogHeader>

                            <AlertDialogFooter class="mt-6">
                              <AlertDialogCancel>Cancel</AlertDialogCancel>

                              <AlertDialogAction @click="createAlarm(item.url)">Set</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TooltipTrigger>

                      <TooltipContent side="left">
                          <p>Set reminder</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div class="col-span-6 flex flex-col self-start space-y-2">
                  <Badge class="bg-gray-600">
                    created: {{ getDate(item.creationTime) }}
                  </Badge>

                  <Badge :class="item.hasBeenRead ? 'bg-green-400' : 'bg-red-400'">
                    {{ item.hasBeenRead ? 'Read' : 'Unread' }}
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
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from '@/components/ui/alert-dialog'
  import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select'
  import { Button } from '@/components/ui/button'
  import { Bell, BookOpen, Plus, Trash2 } from 'lucide-vue-next'
  import { useReadLaterStore } from '@/stores/readlater'
  import { useAlarmStore } from '@/stores/alarm'
  import Badge from '@/components/ui/badge/Badge.vue'
  import Checkbox from '@/components/ui/checkbox/Checkbox.vue'

  const readLaterStore = useReadLaterStore()
  const alarmStore = useAlarmStore()

  async function openItem(item) {
    chrome.tabs.create({ url: item.url })
    await readLaterStore.updateReadLaterItem({ url: item.url, hasBeenRead: true })
    await alarmStore.removealarm(`readLater_${item.url}`)
  }

  const getDate = (date) => {
    const d = new Date(date)

    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()

    return `${year}-${month}-${day}`
  }

  const numberItems = [
    ...Array.from(Array(59).keys()).map((num) => (num + 1))
  ]
  const unitItems = [
    'minutes',
    'hours',
    'days'
  ]
  const selectedNumber = ref(5)
  const selectedUnit = ref('minutes')
  const repeat = ref(false)
  const selectedRepeatNumber = ref(5)
  const selectedRepeatUnit = ref('minutes')

  const createAlarm = (url) => {
    if (!selectedNumber.value || !selectedUnit.value) return

    let time
    if (selectedNumber.value && selectedUnit.value) {
      time = selectedNumber.value * (selectedUnit.value === 'minutes' ? 60 * 1000 : selectedUnit.value === 'hours' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000)
    }

    let repeatTime
    if (selectedRepeatNumber.value && selectedRepeatUnit.value) {
      repeatTime = selectedRepeatNumber.value * (selectedRepeatUnit.value === 'minutes' ? 60 : selectedRepeatUnit.value === 'hours' ? 60 * 60 : 24 * 60 * 60)
    }

    alarmStore.setalarms(`readLater_${url}`, {
      when: Date.now() + time,
      periodInMinutes: repeat.value ? repeatTime : null
    })
  }
</script>