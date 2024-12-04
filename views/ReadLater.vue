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
import { ArrowLeftIcon } from 'lucide-vue-next';
import PanelReadLater from '@/components/Panel_ReadLater.vue';

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
        <CardTitle>Read Later</CardTitle>
      </div>
      <CardDescription class="ml-2 text-start">Manage your read later list</CardDescription>
    </CardHeader>

    <CardContent>
      <PanelReadLater />
    </CardContent>
  </Card>
</template>

<style scoped>
</style> 