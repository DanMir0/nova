<!-- components/product/SizeChart.vue -->
<script setup>
import { ref, computed } from 'vue'

// Пропсы для управления видимостью
const props = defineProps({
  gender: {
    type: String,
    default: 'women', // 'women' или 'men'
  },
})

// Модель для управления открытием/закрытием
const isOpen = defineModel({ default: false })

// Данные таблицы размеров для женщин
const womenSizes = [
  { label: 'XS', chest: '80-84', waist: '60-64', hips: '86-90' },
  { label: 'S', chest: '84-88', waist: '64-68', hips: '90-94' },
  { label: 'M', chest: '88-92', waist: '68-72', hips: '94-98' },
  { label: 'L', chest: '92-96', waist: '72-76', hips: '98-102' },
  { label: 'XL', chest: '96-100', waist: '76-80', hips: '102-106' },
  { label: 'XXL', chest: '100-104', waist: '80-84', hips: '106-110' },
]

// Данные таблицы размеров для мужчин
const menSizes = [
  { label: 'XS', chest: '86-90', waist: '72-76', hips: '88-92' },
  { label: 'S', chest: '90-94', waist: '76-80', hips: '92-96' },
  { label: 'M', chest: '94-98', waist: '80-84', hips: '96-100' },
  { label: 'L', chest: '98-102', waist: '84-88', hips: '100-104' },
  { label: 'XL', chest: '102-106', waist: '88-92', hips: '104-108' },
  { label: 'XXL', chest: '106-110', waist: '92-96', hips: '108-112' },
]

// Выбираем таблицу в зависимости от пола
const sizes = computed(() => {
  return props.gender === 'men' ? menSizes : womenSizes
})

// Закрыть модальное окно
const close = () => {
  isOpen.value = false
}
</script>


<template>
  <!-- Затемнение -->
  <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      @click.self="close">
    <!-- Модальное окно -->
    <div class="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
      <!-- Заголовок -->
      <div class="flex items-center justify-between border-b border-neutral-200 pb-4">
        <h2 class="text-xl font-medium">Таблица размеров</h2>
        <button
            @click="close"
            class="cursor-pointer text-2xl text-neutral-400 transition hover:text-black"
            aria-label="Закрыть">
          ✕
        </button>
      </div>

      <!-- Таблица -->
      <div class="mt-4 overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
          <tr class="border-b border-neutral-200 bg-neutral-50">
            <th class="px-4 py-3 text-left font-medium">Размер</th>
            <th class="px-4 py-3 text-left font-medium">Обхват груди (см)</th>
            <th class="px-4 py-3 text-left font-medium">Обхват талии (см)</th>
            <th class="px-4 py-3 text-left font-medium">Обхват бёдер (см)</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="size in sizes"
              :key="size.label"
              class="border-b border-neutral-100 transition hover:bg-neutral-50">
            <td class="px-4 py-3 font-medium">{{ size.label }}</td>
            <td class="px-4 py-3">{{ size.chest }}</td>
            <td class="px-4 py-3">{{ size.waist }}</td>
            <td class="px-4 py-3">{{ size.hips }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Подсказка -->
      <p class="mt-4 text-xs text-neutral-400">
        * Измерения указаны в сантиметрах. Для выбора размера измерьте обхват груди, талии и бёдер.
      </p>

      <!-- Кнопка закрыть -->
      <div class="mt-6 flex justify-end border-t border-neutral-200 pt-4">
        <button
            @click="close"
            class="cursor-pointer rounded border border-neutral-200 px-6 py-2 text-sm transition hover:border-black">
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<style>
/* Анимация появления */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.95);
}
</style>