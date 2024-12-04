<script lang="ts" setup>
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card'
  import { Loader2 } from 'lucide-vue-next';
  import PanelTab from '@/components/Panel_Tab.vue';
  import { useTabsStore } from '@/stores/tabs';

  const tabsstore = useTabsStore()
</script>

<template>
  <Card class="w-full">
    <CardHeader class="relative">
      <CardTitle>Tabs</CardTitle>

      <div class="absolute mt-4 right-6">
        <Loader2 
          v-if="tabsstore.sorting" 
          class="absolute top-1/2 end-1/2  w-4 h-4 mr-2 animate-spin" 
          :size="32"
        />
      </div>

      <CardDescription>Sorted tabs that you might want</CardDescription>

      
    </CardHeader>
    <CardContent>
      <PanelTab />
    </CardContent>
  </Card>
</template>

<style scoped>
</style>
