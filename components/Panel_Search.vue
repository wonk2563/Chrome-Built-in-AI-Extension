
<script setup lang="ts">
  import { Button } from '@/components/ui/button'
  import { Badge } from '@/components/ui/badge'
  import { Alert, AlertDescription } from '@/components/ui/alert'
  import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
  } from '@/components/ui/dialog'
  import {
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger
  } from '@/components/ui/tooltip'
  import { Input } from '@/components/ui/input'
  import { Edit2, Search, Trash2, Plus, Check, List, Loader2 } from 'lucide-vue-next';
  import { useSearchStore } from '@/stores/search'
  import { useSummaryStore } from '@/stores/summary'
  import { useReadLaterStore } from '@/stores/readlater'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const summaryStore = useSummaryStore()
  const searchStore = useSearchStore()
  const readLaterStore = useReadLaterStore()
  const searchQuery = ref('')

  const getDate = (date: string) => {
    const d = new Date(date)

    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()

    return `${year}-${month}-${day}`
  }

  async function openItem(item: any) {
    chrome.tabs.create({ url: item.formattedUrl })
  }

  const handleAddToReadLater = async (item: any) => {
    const added = await readLaterStore.addToReadLater(item.title, item.formattedUrl);
    item.addedToReadLater = added;
  };
</script>

<template>

  <Dialog>
    <DialogTrigger as-child>
      <Button class="w-full mt-4" :disabled="searchStore.searching">
        Search
        <Loader2 
          v-if="searchStore.searching" 
          class="w-4 h-4 mr-2 animate-spin" 
          :size="32"
        />
        <Search
          v-else
          :size="32"  
        />
      </Button>
    </DialogTrigger>

    <DialogContent class="sm:max-w-[425px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh] rounded-lg">
      <DialogHeader class="p-6 pb-0">
        <DialogTitle>
          <div class="grid grid-cols-8 gap-4 items-center justify-center">
            <div class="col-span-6 mt-8 relative">
              <Input v-model="searchQuery" type="text" placeholder="Search..." class="pl-10 w-full" />
              <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
                <Search class="size-6 text-muted-foreground" />
              </span>
            </div>

            <DialogClose class="col-span-1 mt-8">
              <Button class="bg-gray-600" @click="searchStore.search(searchQuery)">
                Search
              </Button> 
            </DialogClose>
          </div>
        </DialogTitle>
      </DialogHeader>

      <div v-if="searchStore.history.length > 0" class="flex flex-col py-6 px-6 overflow-auto">
        <Button class="self-end" variant="ghost" @click="searchStore.clearHistory">
          Clear all search history
        </Button>

        <DialogClose v-for="history in searchStore.history" :key="history" class="mt-4">
          <Alert
            class="grid grid-cols-7 gap-4 justify-between items-center w-full cursor-pointer bg-gray-200 hover:bg-gray-300 duration-300 transition-colors"
            @click="searchStore.search(history.query)"
          >
            <div class="col-span-7 flex flex-row justify-between items-center">
              <div class="flex flex-col items-center w-full max-w-full">
                <div class="flex flex-row items-center w-full max-w-full">
                  <AlertDescription class="text-start w-full max-w-full">
                    <div class="flex flex-row justify-between items-center w-full">
                      <span class="ml-2 font-semibold text-lg line-clamp-1">{{ history.query }}</span>
                    </div>
                  </AlertDescription>
                </div>

                <div class="mt-4 flex flex-row justify-start w-full">
                  <Badge>
                    searched: {{ getDate(history.date) }}
                  </Badge>
                </div>
              </div>

              <Button variant="ghost" size="icon" @click.stop="searchStore.removeFromHistory(history)">
                <Trash2
                  :size="32"
                />
              </Button>
            </div>
          </Alert> 
        </DialogClose>
      </div>

      <div v-else class="p-6 w-full">
        <Alert class="bg-gray-200">
          <AlertDescription class="text-center">
            Here is no search history yet.
          </AlertDescription>
        </Alert>
      </div>
    </DialogContent>
  </Dialog>

  <Alert v-if="searchStore.errorMsg" class="mt-10 w-full" variant="destructive">
    <AlertDescription class="text-center font-semibold">
      {{ searchStore.errorMsg }}
    </AlertDescription>
  </Alert>

  <div v-if="searchStore.results.length > 0" class="mt-10 space-y-4">
    <Alert 
      v-for="result in searchStore.results" :key="result"
      class="grid grid-cols-7 gap-4 justify-between items-center w-full cursor-pointer bg-gray-200 hover:bg-gray-300 duration-300 transition-colors" 
      @click="openItem(result)"
    >
      <div class="col-span-7 flex flex-col justify-between items-center">
        <div class="flex flex-row items-center w-full max-w-full">
          <AlertDescription class="text-start w-full max-w-full">
            <div class="grid grid-cols-7 gap-4 justify-between items-center w-full">
              <div class="col-span-6">
                <span class="font-semibold text-lg line-clamp-1">{{ result.title }}</span>
                <span class="font-semibold text-gray-400 line-clamp-1">{{ result.formattedUrl }}</span>
                <br>
                <span class="text-gray-800 line-clamp-3">{{ result.snippet }}</span>
              </div>

              <div class="col-span-1 flex flex-col items-center space-y-6">
                <TooltipProvider :delayDuration="0">
                  <Tooltip>
                      <TooltipTrigger>
                        <Button class="col-span-1" variant="ghost" size="icon" @click.stop="summaryStore.generateSummaryFromUrl(result.title, result.formattedUrl); router.push('/summary');">
                          <Edit2
                            :size="32"
                          />
                        </Button>
                      </TooltipTrigger>

                      <TooltipContent side="left">
                          <p>Generate Sumary</p>
                      </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider :delayDuration="0">
                  <Tooltip>
                    <TooltipTrigger>
                      <Button class="col-span-1" variant="ghost" size="icon" @click.stop="handleAddToReadLater(result)">
                        <Plus
                          v-if="!result?.addedToReadLater"
                          :size="32"
                        />
                        <Check
                          v-else
                          :size="32"
                          color="green"
                        />
                      </Button>
                    </TooltipTrigger>

                    <TooltipContent side="left">
                        <p>Add to Read Later</p>
                    </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              </div>
            </div>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  </div>

  <div v-else class="mx-auto p-4 bg-white dark:bg-gray-900">
    <div
      class="text-center text-gray-500 py-8 animate-slide-up"
    >
      <List class="mx-auto h-12 w-12 mb-4 text-primary-500" />
      <p>No search results</p>
    </div>
  </div>
</template>