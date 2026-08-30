<script setup>
import ResetPasswordModal from '../components/auth/ResetPasswordModal.vue'
import router from "../router/index.js";
</script>

<template>
  <main class="min-h-screen bg-white">
    <ResetPasswordModal
        @close="router.push('/')"
        @success="router.push('/')"/>
  </main>
</template>