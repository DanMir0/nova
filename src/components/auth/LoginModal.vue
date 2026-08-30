<script setup>
import {ref} from 'vue'
import {X, Eye, EyeOff} from 'lucide-vue-next'
import {useAuthStore} from '../../stores/auth'

const emit = defineEmits([
  'close',
  'register',
  'forgot-password',
  'success',
])

const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const showPassword = ref(false)
const localError = ref('')

const submit = async () => {
  localError.value = ''

  if (!email.value.trim()) {
    localError.value = 'Введите e-mail'
    return
  }

  if (!password.value) {
    localError.value = 'Введите пароль'
    return
  }

  const result = await authStore.signIn(
      email.value.trim(),
      password.value,
  )

  if (!result.success) {
    localError.value = getErrorMessage(result.error)
    return
  }

  emit('close')
}

const getErrorMessage = (message) => {
  if (!message) {
    return 'Не удалось выполнить вход'
  }

  if (message.includes('Invalid login credentials')) {
    return 'Неверный e-mail или пароль'
  }

  if (message.includes('Email not confirmed')) {
    return 'Подтвердите e-mail перед входом'
  }

  return message
}
</script>

<template>
  <div
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
      @click.self="emit('close')">
    <div
        class="relative w-full max-w-[380px] bg-white p-8 shadow-xl">

      <!-- Close -->
      <button
          type="button"
          class="absolute right-5 top-5 cursor-pointer text-neutral-500 transition hover:text-black"
          aria-label="Закрыть"
          @click="emit('close')">
        <X :size="20" :stroke-width="1.5"/>
      </button>

      <!-- Title -->
      <h2 class="text-xl font-medium">
        Вход
      </h2>

      <!-- Form -->
      <form
          class="mt-7 space-y-5"
          @submit.prevent="submit">

        <!-- Email -->
        <div>
          <label class="mb-2 block text-xs font-medium">
            E-mail
          </label>

          <input
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="Введите e-mail"
              class="w-full border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="mb-2 block text-xs font-medium">
            Пароль
          </label>

          <div class="relative">
            <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Введите пароль"
                class="w-full border border-neutral-200 px-4 py-3 pr-11 text-sm outline-none transition focus:border-black"/>

            <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400 transition hover:text-black"
                @click="showPassword = !showPassword">
              <EyeOff
                  v-if="showPassword"
                  :size="17"
                  :stroke-width="1.5"/>

              <Eye
                  v-else
                  :size="17"
                  :stroke-width="1.5"/>
            </button>
          </div>
        </div>

        <!-- Forgot password -->
        <button
            type="button"
            class="cursor-pointer text-xs text-neutral-500 underline underline-offset-4 transition hover:text-black"
            @click="emit('forgot-password')">
          Забыли пароль?
        </button>

        <!-- Error -->
        <p
            v-if="localError"
            class="text-xs text-red-600">
          {{ localError }}
        </p>

        <!-- Submit -->
        <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full cursor-pointer bg-black px-6 py-3.5 text-sm text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50">
          {{ authStore.loading ? 'Входим...' : 'Войти' }}
        </button>
      </form>

      <!-- Register -->
      <div class="mt-6 text-center text-xs text-neutral-500">
        Нет аккаунта?

        <button
            type="button"
            class="ml-1 cursor-pointer underline underline-offset-4 transition hover:text-black"
            @click="emit('register')">
          Зарегистрироваться
        </button>
      </div>
    </div>
  </div>
</template>