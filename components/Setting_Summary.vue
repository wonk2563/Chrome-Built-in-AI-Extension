<script lang="js" setup>
    import {
        Select,
        SelectContent,
        SelectGroup,
        SelectItem,
        SelectTrigger,
        SelectValue,
    } from '@/components/ui/select'
    import { useSummaryStore } from '@/stores/summary'
    import { CheckCircle2Icon } from 'lucide-vue-next'

    const summaryStore = useSummaryStore()
</script>

<template>
    <div class="space-y-4 w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-lg font-semibold text-gray-500">Summary Options</h2>

      <div class="w-full space-y-4">
          <Select v-model="summaryStore.options.type">
              <SelectTrigger class="relative">
                  <SelectValue placeholder="Select a type"/>

                  <span v-if="summaryStore.hasOptions" class="absolute -end-9 inset-y-0 flex items-center justify-center px-2">
                      <CheckCircle2Icon 
                          class="size-4 sm:size-6 text-muted-foreground" 
                          color="green"
                      />
                  </span>
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="key-points">
                    Key Points
                  </SelectItem>

                  <SelectItem value="tl;dr">
                    TL;DR
                  </SelectItem>

                  <SelectItem value="teaser">
                    Teaser
                  </SelectItem>

                  <SelectItem value="headline">
                    Headline
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select v-model="summaryStore.options.format">
              <SelectTrigger class="relative">
                  <SelectValue placeholder="Select a format" />

                  <span v-if="summaryStore.hasOptions" class="absolute -end-9 inset-y-0 flex items-center justify-center px-2">
                      <CheckCircle2Icon 
                          class="size-4 sm:size-6 text-muted-foreground" 
                          color="green"
                      />
                  </span>
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="markdown">
                    Markdown
                  </SelectItem>

                  <SelectItem value="plain-text">
                    Plain Text
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select v-model="summaryStore.options.length">
              <SelectTrigger class="relative">
                  <SelectValue placeholder="Select a lenth" />

                  <span v-if="summaryStore.hasOptions" class="absolute -end-9 inset-y-0 flex items-center justify-center px-2">
                      <CheckCircle2Icon 
                          class="size-4 sm:size-6 text-muted-foreground" 
                          color="green"
                      />
                  </span>
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="short">
                    Short
                  </SelectItem>

                  <SelectItem value="medium">
                    Medium
                  </SelectItem>

                  <SelectItem value="long">
                    Long
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
      </div>

    </div>
</template>