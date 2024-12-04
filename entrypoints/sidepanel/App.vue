<script lang="ts" setup>
  import { useSecretStore } from '@/stores/secret'
  import { useSummaryStore } from '@/stores/summary'
  import { useTranslationStore } from '@/stores/translation';
  import { useTabsStore } from '@/stores/tabs';
  import { useAlarmStore } from '@/stores/alarm';
  import { useSearchStore } from '@/stores/search';
  import { useReadLaterStore } from '@/stores/readlater';
  import Sidepanel from '@/components/SidePanel.vue';
  
  const secretstore = useSecretStore()
  const summarystore = useSummaryStore()
  const translationstore = useTranslationStore()
  const tabsstore = useTabsStore()
  const alarmstore = useAlarmStore()
  const searchStore = useSearchStore()
  const readLaterStore = useReadLaterStore()

  onMounted(async () => {
    await secretstore.init()
    await summarystore.init()
    await translationstore.init()
    await tabsstore.init()
    await searchStore.init()
    await readLaterStore.init()
    await alarmstore.init()
  })
</script>

<template>
  <div class="flex items-center">
    <div class="flex items-center">
      <Sidepanel />
    </div>
    <div class="flex flex-1 items-center">
      <RouterView class="max-w-[15rem] defaultWidth:max-w-full min-h-svh"/>
    </div>
  </div>
</template>

<style scoped>
</style>
