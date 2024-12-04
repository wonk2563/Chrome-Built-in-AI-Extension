<script lang="ts" setup>
import Setting_ApiKey from '@/components/Setting_ApiKey.vue';
import Setting_Summary from '@/components/Setting_Summary.vue';
import Setting_Translation from '@/components/Setting_Translation.vue';
import { useRouter } from 'vue-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
import { useSecretStore } from '@/stores/secret'
import { useSummaryStore } from '@/stores/summary'
import { useTranslationStore } from '@/stores/translation';
import { ArrowLeftIcon } from 'lucide-vue-next';

const router = useRouter()
const secretstore = useSecretStore()
const summaryStore = useSummaryStore()
const translationstore = useTranslationStore()

// 返回首頁
const goBack = () => {
  router.push('/')
}

const save = () => {
  // 儲存總結設定
  summaryStore.setSummaryOptions()

  // 儲存 api key
  secretstore.save()

  // 儲存翻譯目標語言
  translationstore.setTargetLang()
}
</script>

<template>
  <Card class="w-full">
    <CardHeader>
      <div class="flex items-center">
        <Button variant="ghost" size="icon" @click="goBack" class="mr-2">
          <ArrowLeftIcon
            :size="32"  
          />
        </Button>
        <CardTitle>Settings</CardTitle>
      </div>
      <CardDescription class="ml-2 text-start">Manage your settings</CardDescription>
    </CardHeader>

    <CardContent class="mt-4">
      <div>
        <Setting_ApiKey />
        <Alert v-if="secretstore.errorMsg" class="mt-4" variant="destructive">
          <AlertDescription>{{ secretstore.errorMsg }}</AlertDescription>
        </Alert>

        <Setting_Summary class="mt-12"/>
        <Alert v-if="summaryStore.errorMsg" class="mt-4" variant="destructive">
          <AlertDescription>{{ summaryStore.errorMsg }}</AlertDescription>
        </Alert>

        <Setting_Translation class="mt-12"/>
        <Alert v-if="translationstore.errorMsg" class="mt-4" variant="destructive">
          <AlertDescription>{{ translationstore.errorMsg }}</AlertDescription>
        </Alert>
      </div>
    </CardContent>

    <CardFooter class="flex flex-col space-y-4">
      <div class="w-full flex flex-row">
        <AlertDialog>
          <AlertDialogTrigger class="w-full text-start -ml-2 defaultWidth:ml-4">Reset</AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure to reset？</AlertDialogTitle>

              <AlertDialogDescription>
                 This action will clear all your preferences
                <br>
                and reset to default.
              </AlertDialogDescription>

            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction @click="secretstore.clear">Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div class="w-full flex justify-end space-x-2">
          <Button variant="outline" @click="goBack">Cancel</Button>
          <Button @click="save">Save</Button>
        </div>
      </div>
    </CardFooter>
  </Card>
</template>