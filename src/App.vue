<script setup>
import MainLayout from "./layouts/MainLayout.vue";
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import {useFavoritesStore} from "./stores/favorites.js";

const authStore = useAuthStore()

const favoritesStore = useFavoritesStore()

onMounted(async () => {
  await authStore.initialize()
  await favoritesStore.initialize()
})
</script>

<template>
  <MainLayout>
    <RouterView/>
  </MainLayout>
</template>
