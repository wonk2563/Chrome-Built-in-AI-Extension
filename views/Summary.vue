<script lang="ts" setup>
import { useRouter } from 'vue-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { ArrowLeftIcon, Trash2 } from 'lucide-vue-next';
import { useSecretStore } from '@/stores/secret'
import { useSummaryStore } from '@/stores/summary'
import { useTranslationStore } from '@/stores/translation';
import PanelSummary from '@/components/Panel_Summary.vue';

const secretstore = useSecretStore()
const summaryStore = useSummaryStore()
const translationstore = useTranslationStore()

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
        <CardTitle>Summary</CardTitle>
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
                      <AlertDialogTitle>Are you sure to clear all summary？</AlertDialogTitle>

                      <AlertDialogDescription>
                        This action will clear all your summary
                      </AlertDialogDescription>

                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>

                      <AlertDialogAction @click="summaryStore.clear">Clear</AlertDialogAction>
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
      
      <CardDescription class="ml-2 text-start">Summary for pages</CardDescription>
    </CardHeader>

    <CardContent>
      <PanelSummary />
    </CardContent>
  </Card>
</template>

<style scoped>
</style> 