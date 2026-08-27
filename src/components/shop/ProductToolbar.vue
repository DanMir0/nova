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

const emit = defineEmits(['update:sort'])

const handleSortChange = (event) => {
  emit('update:sort', event.target.value)
}
</script>


<template>
  <div class="mb-5 flex items-center justify-between gap-3">

    <div class="text-sm text-neutral-500">
      {{ count }} товаров
    </div>

    <select
        :value="sort"
        class="cursor-pointer rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-xs outline-none"
        @change="handleSortChange">
      <option value="newest">
        Сортировка: Новинки
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


<style scoped>
</style>