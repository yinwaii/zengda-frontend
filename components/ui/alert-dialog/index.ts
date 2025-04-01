import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { computed, defineComponent, h } from 'vue'

const AlertDialog = Dialog
const AlertDialogTrigger = DialogTrigger

const AlertDialogContent = defineComponent({
  name: 'AlertDialogContent',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () => h(DialogContent, { class: 'sm:max-w-[425px]', ...attrs }, slots)
  }
})

const AlertDialogHeader = DialogHeader
const AlertDialogFooter = DialogFooter
const AlertDialogTitle = DialogTitle
const AlertDialogDescription = DialogDescription

const AlertDialogCancel = defineComponent({
  name: 'AlertDialogCancel',
  setup(_, { attrs, slots }) {
    return () => h(Button, { variant: 'outline', ...attrs }, slots)
  }
})

const AlertDialogAction = defineComponent({
  name: 'AlertDialogAction',
  setup(_, { attrs, slots }) {
    return () => h(Button, { variant: 'destructive', ...attrs }, slots)
  }
})

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} 