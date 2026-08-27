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
  'update:color',
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

const colors = [
  {
    value: 'beige',
    hex: '#d8d0c4',
    name: 'Бежевый',
  },
  {
    value: 'brown',
    hex: '#8b7967',
    name: 'Коричневый',
  },
  {
    value: 'black',
    hex: '#111111',
    name: 'Чёрный',
  },
  {
    value: 'white',
    hex: '#eeeeee',
    name: 'Белый',
  },
  {
    value: 'yellow',
    hex: '#FFFF00',
    name: 'Желтый',
  },
]
</script>

<template>
  <div class="text-sm">

    <section>
      <h2 class="mb-5 font-medium">
        Категория
      </h2>

      <div class="space-y-3">

        <button
            v-for="category in categories"
            :key="category.value"
            type="button"
            class="block text-left text-sm transition"
            :class="
            filters.category === category.value
              ? 'font-medium text-black'
              : 'text-neutral-500 hover:text-black'"
            @click="
            $emit(
              'update:category',
              filters.category === category.value
                ? null
                : category.value
            )">
          {{ category.label }}
        </button>

      </div>
    </section>

    <section class="mt-12">
      <h2 class="mb-5 font-medium">
        Цвет
      </h2>

      <div class="flex max-w-[140px] flex-wrap gap-3">

        <button
            v-for="color in colors"
            :key="color.value"
            type="button"
            :title="color.name"
            :aria-label="`Цвет ${color.name}`"
            class="h-5 w-5 rounded-full border border-neutral-200 transition"
            :style="{
            backgroundColor: color.hex,
          }"
            :class="{
            'ring-1 ring-black ring-offset-2':
              filters.color === color.value,
          }"
            @click="
            $emit(
              'update:color',
              filters.color === color.value
                ? null
                : color.value
            )"/>

      </div>
    </section>

    <section class="mt-12 space-y-3">

      <button
          type="button"
          class="block text-left text-sm transition"
          :class="
          filters.isNew
            ? 'font-medium text-black'
            : 'text-neutral-500 hover:text-black'"
          @click="$emit('toggle:new')">
        {{ filters.isNew ? '✓ ' : '' }}Новинки
      </button>


      <button
          type="button"
          class="block text-left text-sm transition"
          :class="
          filters.isSale
            ? 'font-medium text-black'
            : 'text-neutral-500 hover:text-black'"
          @click="$emit('toggle:sale')">
        {{ filters.isSale ? '✓ ' : '' }}Распродажа
      </button>

    </section>

    <button
        v-if="hasActiveFilters"
        type="button"
        class="mt-10 text-sm text-neutral-500 underline-offset-4 transition hover:text-black hover:underline"
        @click="$emit('reset')">
      Сбросить фильтры
    </button>

  </div>
</template>