<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './index'

const props = defineProps<{
  modelValue: boolean
  title?: string
  message: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <AlertDialog :open="modelValue" @update:open="emit('update:modelValue', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ title || '警告' }}</AlertDialogTitle>
        <AlertDialogDescription>
          {{ message }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction @click="emit('update:modelValue', false)">
          确定
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template> 