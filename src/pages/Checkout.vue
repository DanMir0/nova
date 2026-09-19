<script setup>
import AddressContent from '../components/account/AddressContent.vue'
</script>

<template>
    <main class="min-h-screen bg-white">
        <div
            class="mx-auto max-w-[1440px] px-5 pb-20 pt-8 sm:px-8 lg:px-10"
        >
            <h1 class="text-2xl font-normal tracking-tight sm:text-3xl">
                Адреса доставки
            </h1>

            <div class="mt-8">
                <AddressContent />
            </div>
        </div>
    </main>
</template>