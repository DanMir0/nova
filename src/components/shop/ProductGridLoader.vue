<template>
  <div
      class="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
    <div
        v-for="n in 8"
        :key="n"
        class="animate-pulse">
      <!-- Image -->
      <div class="aspect-[3/4] bg-neutral-100" />

      <!-- Name -->
      <div class="mt-4 h-4 w-3/4 bg-neutral-100" />

      <!-- Category -->
      <div class="mt-2 h-3 w-1/3 bg-neutral-100" />

      <!-- Price -->
      <div class="mt-3 h-4 w-1/4 bg-neutral-100" />
    </div>
  </div>
</template>