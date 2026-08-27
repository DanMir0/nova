<script setup>
import NHeader from "../components/NHeader.vue";
</script>

<template>
    <div class="min-h-screen bg-white text-neutral-950">
        <NHeader />

        <main class="mt-20">
            <slot />
        </main>
    </div>
</template>

<style scoped>

</style>