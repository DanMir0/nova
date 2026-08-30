<script setup>
import {ref} from 'vue'
import {X, Eye, EyeOff, Check} from 'lucide-vue-next'
import {supabase} from '../../lib/supabase'
import {useRouter} from 'vue-router'

const emit = defineEmits([
  'close',
  'success',
])

const router = useRouter()

const password = ref('')
const repeatPassword = ref('')

const showPassword = ref(false)
const showRepeatPassword = ref(false)

const loading = ref(false)
const errorMessage = ref('')
const success = ref(false)

const submit = async () => {
  errorMessage.value = ''

  if (!password.value) {
    errorMessage.value = 'Введите новый пароль'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value =
        'Пароль должен содержать минимум 6 символов'
    return
  }

  if (password.value !== repeatPassword.value) {
    errorMessage.value =
        'Пароли не совпадают'
    return
  }

  try {
    loading.value = true

    const {error} =
        await supabase.auth.updateUser({
          password: password.value,
        })

    if (error) {
      throw error
    }

    success.value = true

  } catch (error) {
    console.error('Update password error:', error)

    errorMessage.value =
        'Не удалось изменить пароль'

  } finally {
    loading.value = false
  }
}

const finish = async () => {
  success.value = false

  await supabase.auth.signOut()

  emit('success')

  router.push('/')
}
</script>

<template>
  <div
      v-if="success"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

    <div
        class="relative w-full max-w-[420px] bg-white px-8 py-10 text-center shadow-xl">

      <div
          class="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-black">
        <Check
            :size="28"
            :stroke-width="1.5"/>
      </div>

      <h2 class="mt-6 text-2xl font-normal tracking-tight">
        Пароль изменён
      </h2>

      <p class="mt-4 text-sm leading-6 text-neutral-500">
        Новый пароль успешно установлен.
        Теперь вы можете войти в свой аккаунт.
      </p>

      <button
          type="button"
          class="mt-8 w-full cursor-pointer bg-black px-6 py-4 text-sm text-white transition hover:bg-neutral-800"
          @click="finish">
        Войти
      </button>

    </div>

  </div>

  <div
      v-else
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

    <div
        class="relative w-full max-w-[400px] bg-white p-8 shadow-xl">

      <button
          type="button"
          aria-label="Закрыть"
          class="absolute right-5 top-5 cursor-pointer text-neutral-400 transition hover:text-black"
          @click="emit('close')">
        <X
            :size="20"
            :stroke-width="1.5"/>
      </button>

      <h2 class="text-xl font-medium">
        Новый пароль
      </h2>

      <p class="mt-3 text-sm leading-6 text-neutral-500">
        Придумайте новый пароль для вашего аккаунта.
      </p>

      <form
          class="mt-7 space-y-5"
          @submit.prevent="submit">

        <!-- Password -->
        <div>

          <label class="mb-2 block text-xs font-medium">
            Новый пароль
          </label>

          <div class="relative">

            <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Введите новый пароль"
                class="w-full border border-neutral-200 px-4 py-3 pr-11 text-sm outline-none transition focus:border-black"/>

            <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400 hover:text-black"
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

        <!-- Repeat -->
        <div>

          <label class="mb-2 block text-xs font-medium">
            Повторите пароль
          </label>

          <div class="relative">

            <input
                v-model="repeatPassword"
                :type="showRepeatPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Повторите новый пароль"
                class="w-full border border-neutral-200 px-4 py-3 pr-11 text-sm outline-none transition focus:border-black"/>

            <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400 hover:text-black"
                @click="showRepeatPassword = !showRepeatPassword">

              <EyeOff
                  v-if="showRepeatPassword"
                  :size="17"
                  :stroke-width="1.5"/>

              <Eye
                  v-else
                  :size="17"
                  :stroke-width="1.5"/>

            </button>

          </div>

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
          {{ loading ? 'Сохраняем...' : 'Изменить пароль' }}
        </button>

      </form>

    </div>

  </div>

</template>