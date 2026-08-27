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
      class="mb-6 flex flex-wrap items-center justify-between gap-3">

    <!-- Filter buttons -->
    <div class="flex flex-wrap gap-2">

      <button
          type="button"
          class="flex items-center gap-2 rounded-md bg-neutral-100 px-4 py-2.5 text-xs transition hover:bg-neutral-200">
        Фильтры

        <span class="text-neutral-400">
          +
        </span>
      </button>


      <button
          type="button"
          class="filter-button">
        Категория

        <span>
          ⌄
        </span>
      </button>


      <button
          type="button"
          class="filter-button">
        Размер

        <span>
          ⌄
        </span>
      </button>


      <button
          type="button"
          class="filter-button">
        Цвет

        <span>
          ⌄
        </span>
      </button>


      <button
          type="button"
          class="filter-button">
        Цена

        <span>
          ⌄
        </span>
      </button>

    </div>

    <!-- Sort -->
    <select
        :value="sort"
        class="cursor-pointer rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-xs outline-none transition hover:border-neutral-300"
        @change="$emit('update:sort', $event.target.value)">
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
.filter-button {
  display: flex;
  align-items: center;
  gap: 1.5rem;

  border: 1px solid #e5e5e5;
  border-radius: 0.375rem;

  padding: 0.625rem 1rem;

  background: white;

  font-size: 0.75rem;

  transition: background-color 0.2s,
  border-color 0.2s;
}

.filter-button:hover {
  background: #f7f7f7;
  border-color: #d4d4d4;
}
</style>