<script setup>
import { useSecretStore } from '@/stores/secret'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CheckCircle2Icon } from 'lucide-vue-next'

const secretstore = useSecretStore()

const openCustomSearchKeyPage = () => {
  window.open('https://programmablesearchengine.google.com/', '_blank')
}
</script>

<template>
  <div class="space-y-4 w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 class="text-lg font-semibold text-gray-500">API Keys</h2>

    <div class="space-y-4">
      <div class="space-y-4 sm:space-y-3">
        <div class="relative w-full items-center">
          <Input 
            class="pr-10 w-full"
            v-model="secretstore.customSearchKey"
            type="text" 
            placeholder="輸入 CustomSearch Key" 
          />
          <span v-if="secretstore.hasCustomSearchKey" class="absolute -end-9 inset-y-0 flex items-center justify-center px-2">
            <CheckCircle2Icon 
              class="size-4 sm:size-6 text-muted-foreground" 
              color="green"
            />
          </span>
        </div>

        <div class="relative w-full items-center">
          <Input 
            class="pr-10 w-full"
            v-model="secretstore.customSearchCX"
            type="text" 
            placeholder="輸入 CustomSearch CX" 
          />
          <span v-if="secretstore.hasCustomSearchKey" class="absolute -end-9 inset-y-0 flex items-center justify-center px-2">
            <CheckCircle2Icon 
              class="size-4 sm:size-6 text-muted-foreground" 
              color="green"
            />
          </span>
        </div>

        <Button 
          variant="link" 
          class="w-full text-sm sm:text-base"
          @click="openCustomSearchKeyPage"
        >
          Get CustomSearch Key & CX
        </Button>
      </div>
    </div>
  </div>
</template>