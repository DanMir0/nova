<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const emit = defineEmits([
  'close',
  'back-to-login',
])

const authStore = useAuthStore()

const email = ref('')
const loading = ref(false)
const errorMessage = ref(null)
const success = ref(false)

const handleSubmit = async () => {
  errorMessage.value = null

  if (!email.value.trim()) {
    errorMessage.value = 'Введите e-mail'
    return
  }

  loading.value = true

  const result = await authStore.resetPassword(
      email.value.trim()
  )

  loading.value = false

  if (!result.success) {
    errorMessage.value = result.error
    return
  }

  success.value = true
}
</script>

<template>
  <div class="w-full max-w-md bg-white p-8 sm:p-10">

    <!-- Success -->

    <div
        v-if="success"
        class="flex flex-col items-center text-center"
    >

      <div
          class="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-black"
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
        >
          <path d="m5 12 4 4L19 6" />
        </svg>
      </div>

      <h2 class="text-2xl font-normal tracking-tight">
        Проверьте почту
      </h2>

      <p class="mt-4 text-sm leading-6 text-neutral-500">
        Мы отправили ссылку для восстановления
        пароля на
        <span class="text-black">
                    {{ email }}
                </span>
      </p>

      <button
          type="button"
          class="mt-8 w-full bg-black px-6 py-4 text-sm text-white transition hover:bg-neutral-800"
          @click="$emit('close')"
      >
        Понятно
      </button>

    </div>


    <!-- Form -->

    <div v-else>

      <h2 class="text-2xl font-normal tracking-tight">
        Восстановление пароля
      </h2>

      <p class="mt-3 text-sm leading-6 text-neutral-500">
        Введите e-mail, который использовали
        при регистрации. Мы отправим ссылку
        для восстановления пароля.
      </p>


      <form
          class="mt-8 space-y-5"
          @submit.prevent="handleSubmit"
      >

        <div>
          <label
              class="mb-2 block text-xs text-neutral-500"
          >
            E-mail
          </label>

          <input
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              class="w-full border-b border-neutral-300 bg-transparent px-0 py-3 text-sm outline-none transition focus:border-black"
          />
        </div>


        <p
            v-if="errorMessage"
            class="text-sm text-red-500"
        >
          {{ errorMessage }}
        </p>


        <button
            type="submit"
            :disabled="loading"
            class="w-full bg-black px-6 py-4 text-sm text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {{ loading ? 'Отправляем...' : 'Отправить ссылку' }}
        </button>

      </form>


      <button
          type="button"
          class="mt-6 w-full text-center text-sm text-neutral-500 transition hover:text-black"
          @click="$emit('back-to-login')"
      >
        ← Вернуться ко входу
      </button>

    </div>

  </div>
</template>