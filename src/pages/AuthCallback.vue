<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()

onMounted(async () => {
  const { error } = await supabase.auth.getSession()

  if (error) {
    console.error('Auth callback error:', error)

    router.replace('/')
    return
  }

  router.replace('/')
})
</script>

<template>
  <main class="flex min-h-screen items-center justify-center">
    <div class="text-center">

      <div
          class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-black">
      </div>

      <p class="mt-5 text-sm text-neutral-500">
        Подтверждаем e-mail...
      </p>

    </div>
  </main>
</template>