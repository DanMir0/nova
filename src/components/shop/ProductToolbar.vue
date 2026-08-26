<script setup>
defineProps({
  count: {
    type: Number,
    default: 0,
  },

  sort: {
    type: String,
    default: 'newest',
  },
})

defineEmits([
  'update:sort',
])
</script>
<template>
  <div
      class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <p class="text-sm text-neutral-500">
      {{ count }} товаров
    </p>

    <select
        :value="sort"
        class="border-none bg-transparent text-sm outline-none"
        @change="$emit('update:sort', $event.target.value)">
      <option value="newest">
        Сначала новые
      </option>

      <option value="price-asc">
        Цена: по возрастанию
      </option>

      <option value="price-desc">
        Цена: по убыванию
      </option>

      <option value="name-asc">
        По названию
      </option>
    </select>
  </div>
</template>
