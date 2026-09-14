<script setup>
import { collections } from '../data/collections'
</script>

<template>
    <main class="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">

        <!-- Breadcrumbs -->
        <nav class="mb-6 flex items-center gap-2 text-xs text-neutral-400">
            <RouterLink
                to="/"
                class="transition hover:text-black">
                Главная
            </RouterLink>

            <span>/</span>

            <span class="text-neutral-600">
                Коллекции
            </span>
        </nav>

        <!-- Header -->
        <header class="mb-10">
            <h1 class="text-3xl font-normal tracking-tight sm:text-4xl">
                Коллекции
            </h1>

            <p class="mt-3 max-w-xl text-sm leading-6 text-neutral-500">
                Выберите сезонную коллекцию Nova и откройте каталог товаров.
            </p>
        </header>

        <!-- Collections -->
        <section class="grid gap-6 md:grid-cols-2">

            <RouterLink
                v-for="collection in collections"
                :key="collection.slug"
                :to="`/collections/${collection.slug}`"
                class="group block">

                <article class="relative overflow-hidden bg-neutral-100">

                    <!-- Image -->
                    <div class="aspect-[4/3] overflow-hidden">

                        <img
                            :src="collection.image"
                            :alt="collection.name"
                            class="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"/>

                    </div>

                    <!-- Overlay -->
                    <div class="absolute inset-0 bg-black/10 transition duration-300 group-hover:bg-black/20"/>

                    <!-- Content -->
                    <div class="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">

                        <h2 class="text-2xl font-normal sm:text-3xl">
                            {{ collection.name }}
                        </h2>

                        <p class="mt-2 max-w-md text-sm leading-6 text-white/90">
                            {{ collection.description }}
                        </p>

                        <div class="mt-5 text-sm">
                            Смотреть коллекцию
                            <span class="ml-1 transition-transform duration-300 group-hover:translate-x-1 inline-block">
                                →
                            </span>
                        </div>

                    </div>

                </article>

            </RouterLink>

        </section>

    </main>
</template>