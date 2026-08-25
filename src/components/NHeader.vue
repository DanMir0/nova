<script setup>

</script>

<template>
    <header class="border-b border-gray-200">
        <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

            <!-- Logo -->
            <a
                href="/"
                class="text-2xl font-bold tracking-[0.2em]">
                NOVA
            </a>

            <!-- Navigation -->
            <nav class="hidden items-center gap-8 md:flex">
                <a
                    href="/"
                    class="text-sm transition hover:opacity-60">
                    Home
                </a>

                <a
                    href="/shop"
                    class="text-sm transition hover:opacity-60">
                    Shop
                </a>

                <a
                    href="/collections"
                    class="text-sm transition hover:opacity-60">
                    Collections
                </a>
            </nav>

            <!-- Actions -->
            <div class="flex items-center gap-4">
                <button
                    class="text-sm transition hover:opacity-60">
                    Search
                </button>

                <button
                    class="text-sm transition hover:opacity-60">
                    Cart
                </button>

                <button
                    class="text-sm transition hover:opacity-60">
                    Account
                </button>
            </div>

        </div>
    </header>
</template>

<style scoped>

</style>