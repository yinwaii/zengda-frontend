<template>
  <shadcn-dialog>
    <shadcn-dialog-trigger as-child>
      <shadcn-button variant="outline">
        编辑
      </shadcn-button>
    </shadcn-dialog-trigger>
    <shadcn-dialog-content class="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
      <shadcn-dialog-header>
        <shadcn-dialog-title>编辑</shadcn-dialog-title>
        <shadcn-dialog-description>
          请修改XXX
        </shadcn-dialog-description>
      </shadcn-dialog-header>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <shadcn-label for="name" class="text-right">
            Name
          </shadcn-label>
          <shadcn-input id="name" value="Pedro Duarte" class="col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <shadcn-label for="username" class="text-right">
            Username
          </shadcn-label>
          <shadcn-input id="username" value="@peduarte" class="col-span-3" />
        </div>
      </div>
      <shadcn-dialog-footer>
        <shadcn-button type="submit">
          Save changes
				</shadcn-button>
      </shadcn-dialog-footer>
    </shadcn-dialog-content>
  </shadcn-dialog>
</template>