<template>
  <aside>
    <div class="sticky top-28">

      <!-- Category -->
      <div>
        <h2 class="text-xs uppercase tracking-[0.12em] text-neutral-500">
          Категория
        </h2>

        <div class="mt-5 space-y-3">
          <button
              type="button"
              :class="filterClass(null, 'category')"
              @click="$emit('update:category', null)">
            Все товары
          </button>

          <button
              v-for="category in categories"
              :key="category.value"
              type="button"
              :class="filterClass(category.value, 'category')"
              @click="$emit('update:category', category.value)">
            {{ category.label }}
          </button>
        </div>
      </div>

      <!-- Gender -->
      <div class="mt-10 border-t border-neutral-200 pt-8">
        <h2 class="text-xs uppercase tracking-[0.12em] text-neutral-500">
          Для кого
        </h2>

        <div class="mt-5 space-y-3">
          <button
              type="button"
              :class="filterClass(null, 'gender')"
              @click="$emit('update:gender', null)">
            Все
          </button>

          <button
              type="button"
              :class="filterClass('women', 'gender')"
              @click="$emit('update:gender', 'women')">
            Женщинам
          </button>

          <button
              type="button"
              :class="filterClass('men', 'gender')"
              @click="$emit('update:gender', 'men')">
            Мужчинам
          </button>

          <button
              type="button"
              :class="filterClass('unisex', 'gender')"
              @click="$emit('update:gender', 'unisex')">
            Unisex
          </button>
        </div>
      </div>

      <!-- Collection -->
      <div class="mt-10 border-t border-neutral-200 pt-8">
        <h2 class="text-xs uppercase tracking-[0.12em] text-neutral-500">
          Коллекция
        </h2>

        <div class="mt-5 space-y-3">
          <button
              type="button"
              :class="filterClass(null, 'collection')"
              @click="$emit('update:collection', null)">
            Все коллекции
          </button>

          <button
              type="button"
              :class="filterClass('spring-summer', 'collection')"
              @click="$emit('update:collection', 'spring-summer')">
            Весна / Лето
          </button>
        </div>
      </div>

      <!-- Special -->
      <div class="mt-10 border-t border-neutral-200 pt-8">
        <h2 class="text-xs uppercase tracking-[0.12em] text-neutral-500">
          Особое
        </h2>

        <div class="mt-5 space-y-3">
          <button
              type="button"
              :class="toggleClass(filters.isNew)"
              @click="$emit('toggle:new')">
            Новинки
          </button>

          <button
              type="button"
              :class="toggleClass(filters.isSale)"
              @click="$emit('toggle:sale')">
            Распродажа
          </button>
        </div>
      </div>

      <!-- Reset -->
      <button
          v-if="hasActiveFilters"
          type="button"
          class="mt-10 text-sm underline underline-offset-4"
          @click="$emit('reset')">
        Сбросить фильтры
      </button>
    </div>
  </aside>
</template>

<script setup>
defineProps({
  filters: {
    type: Object,
    required: true,
  },

  hasActiveFilters: {
    type: Boolean,
    default: false,
  },
})

defineEmits([
  'update:category',
  'update:gender',
  'update:collection',
  'toggle:new',
  'toggle:sale',
  'reset',
])

const categories = [
  {
    value: 't-shirts',
    label: 'Футболки',
  },
  {
    value: 'shirts',
    label: 'Рубашки',
  },
  {
    value: 'jackets',
    label: 'Жакеты и куртки',
  },
  {
    value: 'pants',
    label: 'Брюки',
  },
  {
    value: 'dresses',
    label: 'Платья',
  },
  {
    value: 'shoes',
    label: 'Обувь',
  },
  {
    value: 'accessories',
    label: 'Аксессуары',
  },
]

const filterClass = (value, name) => {
  return [
    'block text-sm transition',
    'text-neutral-500 hover:text-neutral-950',
  ]
}

const toggleClass = (active) => {
  return [
    'block text-sm transition',
    active
        ? 'font-medium text-neutral-950'
        : 'text-neutral-500 hover:text-neutral-950',
  ]
}
</script>