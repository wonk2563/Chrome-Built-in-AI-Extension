<template>
    <div class="relative w-full items-center">
      <Input v-model="searchQuery" type="text" placeholder="Search history..." class="pl-10 w-full" />
      <span class="absolute start-0 inset-y-0 flex items-center justify-center px-2">
        <Search class="size-6 text-muted-foreground" />
      </span>
    </div>

    <Button class="w-full mt-4" :disabled="summaryStore.generating" @click="summaryStore.generateSummaryFromCurrentTab">
      Generate Summary
      <Loader2 
        v-if="summaryStore.generating" 
        class="w-4 h-4 mr-2 animate-spin" 
        :size="32"
      />
      <Edit2
        v-else
        :size="32"  
      />
    </Button>

    <Alert v-if="summaryStore.errorMsg" class="mt-10 w-full" variant="destructive">
      <AlertDescription class="text-center font-semibold">
        {{ summaryStore.errorMsg }}
      </AlertDescription>
    </Alert>

    <div v-if="summaryStore.history.length > 0" class="mt-10 space-y-4">
      <Dialog  
        v-for="summary in summaryStore.history.filter((summary: any) => summary.title.toLowerCase().includes(searchQuery.toLowerCase()))" :key="summary"
      >
        <DialogTrigger as-child>
          <Alert 
            class="grid grid-cols-7 gap-4 justify-between items-center w-full cursor-pointer bg-gray-200 hover:bg-gray-300 duration-300 transition-colors"
          >
            <div class="col-span-7 flex flex-col justify-between items-center">
              <div class="flex flex-row items-center w-full max-w-full">
                <AlertDescription class="text-start w-full max-w-full">
                  <div class="grid grid-cols-7 gap-4 justify-between items-center w-full">
                    <span class="col-span-6 font-semibold text-lg line-clamp-1">{{ summary.title }}</span>
                    <TooltipProvider class="col-span-1" :delayDuration="0">
                      <Tooltip>
                          <TooltipTrigger>
                            <Button  variant="ghost" size="icon" @click.stop="summaryStore.removeFromSummaryHistory(summary)">
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
                  
                  <br>
                  <span class="text-muted-foreground line-clamp-2">({{ summary.content }})</span>
                </AlertDescription>
              </div>

              <div class="mt-6 flex flex-row justify-start w-full">
                <Badge class="bg-gray-600">
                  generated: {{ getDate(summary?.date) }}
                </Badge>
              </div>
            </div>
          </Alert>
        </DialogTrigger>

        <DialogContent class="sm:max-w-[425px] grid-rows-[auto_minmax(0,1fr)_auto] p-0 max-h-[90dvh]">
          <DialogHeader class="p-6 pb-0">
            <DialogTitle class="text-xl font-semibold text-foreground">{{ summary.title }}</DialogTitle>
          </DialogHeader>

          <div class="grid gap-4 py-4 overflow-y-auto px-6">
            <p class="text-lg text-muted-foreground">
              {{ summary.content }}
            </p>
          </div>

          <DialogFooter class="p-6">
            <DialogClose>
              <Button class="w-full">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <div v-else class="mx-auto p-4 bg-white dark:bg-gray-900">
      <div
        class="text-center text-gray-500 py-8 animate-slide-up"
      >
        <Edit3 class="mx-auto h-12 w-12 mb-4 text-primary-500" />
        <p>No summaries</p>
      </div>
    </div>
</template>
  
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
  import { Edit2, Search, Loader2, Trash2, Edit3 } from 'lucide-vue-next';
  import { useSummaryStore } from '@/stores/summary'

  const summaryStore = useSummaryStore()
  const searchQuery = ref('')

  const getDate = (date: string) => {
    const d = new Date(date)

    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()

    return `${year}-${month}-${day}`
  }
  
  onMounted(async () => {

  })
</script>