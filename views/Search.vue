<script lang="ts" setup>
import { useRouter } from 'vue-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon, Trash2 } from 'lucide-vue-next';
import PanelSearch from '@/components/Panel_Search.vue';
import { useSearchStore } from '@/stores/search'

const searchStore = useSearchStore()

const router = useRouter()
// 返回首頁
const goBack = () => {
  router.push('/')
}
</script>

<template>
  <Card class="w-full">
    <CardHeader class="relative">
      <div class="flex items-center">
        <Button variant="ghost" size="icon" @click="goBack" class="mr-2">
          <ArrowLeftIcon
            :size="32"  
          />
        </Button>
        <CardTitle>Search</CardTitle>
      </div>

      <div class="absolute mt-4 right-6">
        <TooltipProvider :delayDuration="0">
          <Tooltip>
              <TooltipTrigger>
                <AlertDialog>
                  <AlertDialogTrigger class="w-full text-start -ml-2 defaultWidth:ml-4">
                    <Button variant="destructive" size="icon">
                      <Trash2
                        :size="32"
                      />
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure to clear all search result？</AlertDialogTitle>

                      <AlertDialogDescription>
                        This action will clear all your search result
                      </AlertDialogDescription>

                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>

                      <AlertDialogAction @click="searchStore.clearResult">Clear</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>

              <TooltipContent side="left">
                  <p>Clear All</p>
              </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <CardDescription class="ml-2 text-start">Search what you want</CardDescription>
    </CardHeader>

    <CardContent>
      <PanelSearch />
    </CardContent>
  </Card>
</template>

<style scoped>
</style> 