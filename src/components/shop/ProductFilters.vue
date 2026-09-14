<script setup>
import { ChevronUp } from 'lucide-vue-next'

defineProps({
    filters: {
        type: Object,
        required: true,
    },

    hasActiveFilters: {
        type: Boolean,
        default: false,
    },

    showGender: {
        type: Boolean,
        default: true,
    },

    showCollection: {
        type: Boolean,
        default: true,
    },
})

defineEmits([
    'update:category',
    'update:gender',
    'update:collection',
    'update:color',
    'update:size',
    'update:minPrice',
    'update:maxPrice',
    'apply:price',
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
        value: 'skirts',
        label: 'Юбки',
    },
    {
        value: 'shorts',
        label: 'Шорты',
    },
    {
        value: 'suits',
        label: 'Костюмы',
    },
    {
        value: 'outerwear',
        label: 'Верхняя одежда',
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

const genders = [
    {
        value: 'women',
        label: 'Женщинам',
    },
    {
        value: 'men',
        label: 'Мужчинам',
    },
]

const collections = [
    {
        value: 'spring-summer',
        label: 'Весна / Лето',
    },
    {
        value: 'autumn-winter',
        label: 'Осень / Зима',
    },
]

const sizes = [
    'XS',
    'S',
    'M',
    'L',
    'XL',
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
        name: 'Жёлтый',
    },
    {
        value: 'grey',
        hex: '#9b9b9b',
        name: 'Серый',
    },
    {
        value: 'blue',
        hex: '#4f6d8a',
        name: 'Синий',
    },
    {
        value: 'green',
        hex: '#8da37b',
        name: 'Зелёный',
    },
]
</script>

<template>
    <aside class="text-sm">

        <!-- GENDER -->
        <section
            v-if="showGender"
            class="border-b border-neutral-200 pb-5">
            <div class="mb-4 flex items-center justify-between">
                <h2 class="font-medium">
                    Для кого
                </h2>

                <ChevronUp :size="15" />
            </div>

            <div class="space-y-2">
                <button
                    v-for="gender in genders"
                    :key="gender.value"
                    type="button"
                    class="block w-full cursor-pointer text-left text-xs transition"
                    :class="
                        filters.gender === gender.value ? 'font-medium text-black' : 'text-neutral-500 hover:text-black'"
                    @click="
                        $emit('update:gender',filters.gender === gender.value ? null : gender.value)">
                    {{ gender.label }}
                </button>
            </div>
        </section>

        <!-- COLLECTION -->
        <section
            v-if="showCollection"
            class="border-b border-neutral-200 py-5">
            <div class="mb-4 flex items-center justify-between">
                <h2 class="font-medium">
                    Коллекция
                </h2>

                <ChevronUp :size="15" />
            </div>

            <div class="space-y-2">
                <button
                    v-for="item in collections"
                    :key="item.value"
                    type="button"
                    class="block w-full cursor-pointer text-left text-xs transition"
                    :class="
                        filters.collection === item.value ? 'font-medium text-black' : 'text-neutral-500 hover:text-black'"
                    @click="
                        $emit('update:collection', filters.collection === item.value ? null : item.value)">
                    {{ item.label }}
                </button>
            </div>
        </section>

        <!-- CATEGORY -->
        <section class="border-b border-neutral-200 py-5">
            <div class="mb-4 flex items-center justify-between">
                <h2 class="font-medium">
                    Категории
                </h2>

                <ChevronUp :size="15" />
            </div>

            <div class="space-y-2">
                <button
                    v-for="category in categories"
                    :key="category.value"
                    type="button"
                    class="block w-full cursor-pointer text-left text-xs transition"
                    :class="
                        filters.category === category.value  ? 'font-medium text-black' : 'text-neutral-500 hover:text-black'"
                    @click="
                        $emit(
                            'update:category', filters.category === category.value ? null
                                : category.value)">
                    {{ category.label }}
                </button>
            </div>
        </section>

        <!-- SIZE -->
        <section class="border-b border-neutral-200 py-5">
            <div class="mb-4 flex items-center justify-between">
                <h2 class="font-medium">
                    Размер
                </h2>

                <ChevronUp :size="15" />
            </div>

            <div class="flex flex-wrap gap-2">
                <button
                    v-for="size in sizes"
                    :key="size"
                    type="button"
                    class="h-8 min-w-9 cursor-pointer border px-2 text-xs transition"
                    :class="
                        filters.size === size ? 'border-black bg-black text-white' : 'border-neutral-200 hover:border-black'"
                    @click="$emit('update:size', filters.size === size ? null : size)">
                    {{ size }}
                </button>
            </div>
        </section>

        <!-- COLOR -->
        <section class="border-b border-neutral-200 py-5">
            <div class="mb-4 flex items-center justify-between">
                <h2 class="font-medium">
                    Цвет
                </h2>

                <ChevronUp :size="15" />
            </div>

            <div class="flex max-w-[160px] flex-wrap gap-3">
                <button
                    v-for="color in colors"
                    :key="color.value"
                    type="button"
                    :title="color.name"
                    :aria-label="`Цвет ${color.name}`"
                    class="h-5 w-5 cursor-pointer rounded-full border border-neutral-200 transition hover:scale-110"
                    :style="{backgroundColor: color.hex,}"
                    :class="{'ring-1 ring-black ring-offset-2': filters.color === color.value,}"
                    @click="$emit('update:color',filters.color === color.value? null: color.value)"/>
            </div>
        </section>

        <!-- PRICE -->
        <section class="border-b border-neutral-200 py-5">
            <div class="mb-4 flex items-center justify-between">
                <h2 class="font-medium">
                    Цена
                </h2>

                <ChevronUp :size="15" />
            </div>

            <div class="flex items-center gap-2">
                <input
                    :value="filters.minPrice ?? ''"
                    type="number"
                    min="0"
                    placeholder="от"
                    class="h-9 w-full border border-neutral-200 px-3 text-xs outline-none transition focus:border-black"
                    @input="
                        $emit('update:minPrice', $event.target.value ? Number($event.target.value) : null)"/>
                <span class="text-neutral-400">
                    —
                </span>

                <input
                    :value="filters.maxPrice ?? ''"
                    type="number"
                    min="0"
                    placeholder="до"
                    class="h-9 w-full border border-neutral-200 px-3 text-xs outline-none transition focus:border-black"
                    @input="$emit('update:maxPrice', $event.target.value ? Number($event.target.value) : null) "/>
            </div>

            <button
                type="button"
                class="mt-3 cursor-pointer text-xs underline underline-offset-4 transition hover:text-black"
                @click="$emit('apply:price')">
                Применить
            </button>
        </section>

        <!-- NEW / SALE -->
        <section class="border-b border-neutral-200 py-5">
            <div class="space-y-3">
                <button
                    type="button"
                    class="block cursor-pointer text-left text-xs transition"
                    :class="filters.isNew ? 'font-medium text-black' : 'text-neutral-500 hover:text-black'"
                    @click="$emit('toggle:new')">
                    {{ filters.isNew ? '✓ ' : '' }}
                    Новинки
                </button>

                <button
                    type="button"
                    class="block cursor-pointer text-left text-xs transition"
                    :class="filters.isSale ? 'font-medium text-black' : 'text-neutral-500 hover:text-black'"
                    @click="$emit('toggle:sale')">
                    {{ filters.isSale ? '✓ ' : '' }}
                    Распродажа
                </button>
            </div>
        </section>


        <button
            v-if="hasActiveFilters"
            type="button"
            class="mt-5 cursor-pointer text-xs text-neutral-500 underline-offset-4 transition hover:text-black hover:underline"
            @click="$emit('reset')">
            Сбросить фильтры
        </button>

    </aside>
</template>