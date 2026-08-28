<script setup>
import MainLayout from "./layouts/MainLayout.vue";
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initialize()
})
</script>

<template>
  <MainLayout>
    <RouterView/>
  </MainLayout>
</template>
