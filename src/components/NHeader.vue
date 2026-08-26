<script setup>
import {Search, UserRound, Heart, ShoppingBag, Menu,} from 'lucide-vue-next'
</script>

<template>
    <header class="absolute left-0 top-0 z-20 w-full">
        <div
            class="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 lg:px-10">
            <!-- Logo -->
            <router-link
                to="/"
                class="text-2xl font-medium tracking-tight">
                Nova
            </router-link>

            <!-- Desktop navigation -->
            <nav class="hidden items-center gap-10 lg:flex">
                <router-link
                    :to="{path: '/shop', query: {gender: 'women'}}"
                    class="text-sm transition-opacity hover:opacity-50">
                    Женщинам
                </router-link>

                <router-link
                    :to="{path: '/shop', query: {gender: 'men'}}"
                    class="text-sm transition-opacity hover:opacity-50">
                    Мужчинам
                </router-link>

                <router-link
                    :to="{path: '/shop', query: {new: 'true'}}"
                    class="text-sm transition-opacity hover:opacity-50">
                    Новинки
                </router-link>

                <router-link
                    to="/collections"
                    class="text-sm transition-opacity hover:opacity-50">
                    Коллекции
                </router-link>

                <router-link
                    :to="{path: '/shop', query: {sale: 'true'}}"
                    class="text-sm transition-opacity hover:opacity-50">
                    Распродажа
                </router-link>
            </nav>

            <!-- Actions -->
            <div class="flex items-center gap-5">
                <button
                    type="button"
                    aria-label="Поиск"
                    class="transition-opacity hover:opacity-50">
                    <Search :size="20" :stroke-width="1.5"/>
                </button>

                <router-link
                    to="/account"
                    aria-label="Аккаунт"
                    class="hidden transition-opacity hover:opacity-50 sm:block">
                    <UserRound :size="20" :stroke-width="1.5"/>
                </router-link>

                <button
                    type="button"
                    aria-label="Избранное"
                    class="hidden transition-opacity hover:opacity-50 sm:block">
                    <Heart :size="20" :stroke-width="1.5"/>
                </button>

                <router-link
                    to="/cart"
                    aria-label="Корзина"
                    class="relative transition-opacity hover:opacity-50">
                    <ShoppingBag :size="20" :stroke-width="1.5"/>

                    <span
                        class="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-950 px-1 text-[9px] text-white">
                        2
                    </span>
                </router-link>

                <!-- Mobile menu -->
                <button
                    type="button"
                    aria-label="Открыть меню"
                    class="lg:hidden">
                    <Menu :size="21" :stroke-width="1.5"/>
                </button>
            </div>
        </div>
    </header>
</template>

<style scoped>

</style>