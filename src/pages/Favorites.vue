<script setup>
import FavoritesContent from '../components/account/FavoritesContent.vue'
</script>

<template>
    <main class="min-h-screen bg-white">
        <div
                class="mx-auto w-full max-w-[1440px] px-5 pb-20 pt-8 sm:px-8 lg:px-10 xl:px-12">
            <!-- Breadcrumbs -->
            <nav
                    class="mb-5 flex items-center gap-2 text-xs text-neutral-400">
                <RouterLink
                        to="/"
                        class="transition hover:text-black">
                    Главная
                </RouterLink>

                <span>/</span>

                <span class="text-neutral-500">
                    Избранное
                </span>
            </nav>

            <!-- Header -->
            <header class="mb-8">
                <h1 class="text-3xl font-normal tracking-tight sm:text-4xl">
                    Избранное
                </h1>
            </header>

            <FavoritesContent />
        </div>
    </main>
</template>