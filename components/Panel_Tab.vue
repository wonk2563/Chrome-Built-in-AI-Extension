<template>
    <div class="relative w-full items-center">
      <Input v-model="searchQuery" type="text" placeholder="Search tab..." class="pl-10" />
      <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
        <Search class="size-6 text-muted-foreground" />
      </span>
    </div>

    <Alert v-if="tabsstore.errMsg" class="realative mt-10 w-full" variant="destructive">
      <AlertDescription class="flex flex-row justify-center items-center text-center font-semibold">
        {{ tabsstore.errMsg }}

        <TooltipProvider class="absolute right-10" :delayDuration="0">
          <Tooltip>
              <TooltipTrigger>
                <Button v-if="tabsstore.errMsg" variant="ghost" size="icon" :disabled="tabsstore.sorting" @click="tabsstore.sortTabs(true)">
                  <RefreshCw
                    :size="32"  
                  />
                </Button>
              </TooltipTrigger>

              <TooltipContent side="right">
                  <p>Refresh</p>
              </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AlertDescription>
    </Alert>

    

    <div v-if="tabsstore.tabs.length > 0"  class="mt-10 space-y-4">
      <Alert 
        v-for="tab in tabsstore.tabs.filter((tab: any) => tab.title.toLowerCase().includes(searchQuery.toLowerCase()))" :key="tab"
        class="grid grid-cols-7 gap-4 justify-between items-center w-full cursor-pointer bg-gray-200 hover:bg-gray-300 duration-300 transition-colors" 
        @click="tabsstore.switchTab(tab.id)"
      >
        <div class="col-span-6 flex flex-col justify-between items-center">
          <div class="flex flex-row items-center w-full max-w-full">
            <img 
              :src="tab.favIconUrl" 
              alt="favicon"
              class="w-6 h-6 object-contain rounded-sm"
              @error="handleImageError"
            />
            <AlertDescription class="ml-4 text-lg truncate">
              {{ tab.title }}
            </AlertDescription>
          </div>

          <div class="mt-6 flex flex-row justify-start w-full">
            <Badge class="bg-gray-600">
              lastAccessed: {{ getDate(tab.lastAccessed) }}
            </Badge>
          </div>
        </div>

        <div class="col-span-1 flex items-center">
          <TooltipProvider :delayDuration="0">
            <Tooltip>
                <TooltipTrigger>
                  <Button :disabled="summaryStore.generating" variant="ghost" size="icon" @click.stop="summaryStore.generateSummary(tab.title, tab.id); router.push('/summary');">
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
        </div>
      </Alert>
    </div>

    <div v-else>
      <Alert v-if="tabsstore.sorting" class="mt-10 w-full">
        <AlertDescription class="flex flex-col justify-center items-center">
          <span class="text-muted-foreground">
            Sorting tabs now... Please wait for a few seconds.
          </span>
          <Loader2 class="mt-4 w-10 h-10 animate-spin" color="#9CA3AF"/>
          
        </AlertDescription>
      </Alert>

      <Alert v-else-if="!tabsstore.errMsg" class="mt-10 w-full">
        <AlertDescription class="flex flex-col justify-center text-center">
          <span class="text-muted-foreground">Here is no tab history yet.</span>
        </AlertDescription>
      </Alert>
    </div>
</template>
  
<script setup lang="ts">
  import { Button } from '@/components/ui/button'
  import { Badge } from '@/components/ui/badge'
  import { Alert, AlertDescription } from '@/components/ui/alert'
  import {
      Tooltip,
      TooltipContent,
      TooltipProvider,
      TooltipTrigger
  } from '@/components/ui/tooltip'
  import { Input } from '@/components/ui/input'
  import { Edit2, Search, Loader2, RefreshCw } from 'lucide-vue-next';
  import { useTabsStore } from '@/stores/tabs';
  import { useSummaryStore } from '@/stores/summary'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const summaryStore = useSummaryStore()
  const tabsstore = useTabsStore()
  const searchQuery = ref('')

  const getDate = (date: string) => {
    const d = new Date(date)

    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()

    return `${year}-${month}-${day}`
  }

  const handleImageError = (e: Event) => {
    const target = e.target as HTMLImageElement;
    target.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>%E2%9C%A8</text></svg>';
  }
  
  onMounted(async () => {

  })
</script>