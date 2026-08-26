<script setup>
defineProps({
  icon: {
    type: Object,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="flex items-start gap-5">
    <div class="shrink-0">
      <component
          :is="icon"
          :size="31"
          :stroke-width="1.4"/>
    </div>

    <div>
      <h3 class="text-sm font-medium">
        {{ title }}
      </h3>

      <p
          class="mt-1 max-w-[190px] text-sm leading-6 text-neutral-500">
        {{ description }}
      </p>
    </div>
  </div>
</template>
