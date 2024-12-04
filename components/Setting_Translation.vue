<script lang="js" setup>
    import {
        Select,
        SelectContent,
        SelectGroup,
        SelectItem,
        SelectTrigger,
        SelectValue,
    } from '@/components/ui/select'
    import { useTranslationStore } from '@/stores/translation';
    import { CheckCircle2Icon } from 'lucide-vue-next'

    const translationstore = useTranslationStore()
    const items = [
      'ar',
      'bn',
      'de',
      'es',
      'fr',
      'hi',
      'it',
      'ja',
      'ko',
      'nl',
      'pl',
      'pt',
      'ru',
      'th',
      'tr',
      'vi',
      'zh',
      'zh-Hant',
  ]
</script>

<template>
    <div class="space-y-4 w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-lg font-semibold text-gray-500">Translation Options</h2>

      <div class="w-full space-y-4">
          <Select v-model="translationstore.targetLang">
            <SelectTrigger class="relative">
                <SelectValue placeholder="Select Target Language"/>

                <span v-if="translationstore.hasTargetLang" class="absolute -end-9 inset-y-0 flex items-center justify-center px-2">
                    <CheckCircle2Icon 
                        class="size-4 sm:size-6 text-muted-foreground" 
                        color="green"
                    />
                </span>
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem v-for="item in items" :key="item" :value="item">
                  {{ item }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
      </div>

    </div>
</template>