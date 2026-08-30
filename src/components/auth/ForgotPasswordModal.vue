<script setup>
import {ref} from 'vue'
import {X, Mail, Check} from 'lucide-vue-next'
import {supabase} from '../../lib/supabase'

const emit = defineEmits([
  'close',
  'login',
])

const email = ref('')

const loading = ref(false)
const errorMessage = ref('')
const success = ref(false)

const submit = async () => {
  errorMessage.value = ''

  if (!email.value.trim()) {
    errorMessage.value = 'Введите e-mail'
    return
  }

  try {
    loading.value = true

    const redirectTo =
        `${window.location.origin}/auth/reset-password`

    const {error} =
        await supabase.auth.resetPasswordForEmail(
            email.value.trim(),
            {
              redirectTo,
            }
        )

    if (error) {
      throw error
    }

    success.value = true

  } catch (error) {
    console.error('Reset password error:', error)

    if (
        error.message?.includes('rate limit')
    ) {
      errorMessage.value =
          'Слишком много запросов. Попробуйте позже.'
    } else {
      errorMessage.value =
          'Не удалось отправить письмо'
    }

  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
      v-if="success"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

    <div
        class="relative w-full max-w-[420px] bg-white px-8 py-10 text-center shadow-xl">

      <button
          type="button"
          aria-label="Закрыть"
          class="absolute right-5 top-5 cursor-pointer text-neutral-400 transition hover:text-black"
          @click="emit('close')">
        <X
            :size="20"
            :stroke-width="1.5"/>
      </button>

      <div
          class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-black">
        <Check
            :size="28"
            :stroke-width="1.5"/>
      </div>

      <h2 class="mt-6 text-2xl font-normal tracking-tight">
        Проверьте почту
      </h2>

      <p class="mx-auto mt-4 max-w-sm text-sm leading-6 text-neutral-500">
        Мы отправили ссылку для восстановления
        пароля на
        <span class="font-medium text-black">
          {{ email }}
        </span>
      </p>

      <p class="mx-auto mt-3 max-w-sm text-xs leading-5 text-neutral-400">
        Перейдите по ссылке в письме,
        чтобы создать новый пароль.
      </p>

      <button
          type="button"
          class="mt-8 w-full cursor-pointer bg-black px-6 py-4 text-sm text-white transition hover:bg-neutral-800"
          @click="emit('close')">
        Понятно
      </button>

    </div>

  </div>

  <div
      v-else
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
      @click.self="emit('close')">

    <div
        class="relative w-full max-w-[400px] bg-white p-8 shadow-xl">

      <!-- Close -->
      <button
          type="button"
          aria-label="Закрыть"
          class="absolute right-5 top-5 cursor-pointer text-neutral-400 transition hover:text-black"
          @click="emit('close')">
        <X
            :size="20"
            :stroke-width="1.5"/>
      </button>

      <!-- Icon -->
      <div
          class="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200">
        <Mail
            :size="20"
            :stroke-width="1.5"
        />
      </div>

      <!-- Title -->
      <h2 class="text-xl font-medium">
        Забыли пароль?
      </h2>

      <p class="mt-3 text-sm leading-6 text-neutral-500">
        Введите e-mail, который вы использовали
        при регистрации. Мы отправим вам ссылку
        для восстановления пароля.
      </p>

      <!-- Form -->
      <form
          class="mt-7 space-y-5"
          @submit.prevent="submit">

        <div>

          <label class="mb-2 block text-xs font-medium">
            E-mail
          </label>

          <input
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="Введите e-mail"
              class="w-full border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-black"/>
        </div>

        <!-- Error -->
        <p
            v-if="errorMessage"
            class="text-xs text-red-600">
          {{ errorMessage }}
        </p>

        <!-- Submit -->
        <button
            type="submit"
            :disabled="loading"
            class="w-full cursor-pointer bg-black px-6 py-3.5 text-sm text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50">
          {{ loading ? 'Отправляем...' : 'Отправить ссылку' }}
        </button>

      </form>

      <!-- Back -->
      <div class="mt-6 text-center text-xs text-neutral-500">

        Вспомнили пароль?
        <button
            type="button"
            class="ml-1 cursor-pointer underline underline-offset-4 transition hover:text-black"
            @click="emit('login')">
          Войти
        </button>

      </div>

    </div>

  </div>

</template>