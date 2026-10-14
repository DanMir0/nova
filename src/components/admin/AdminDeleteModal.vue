<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: 'Удалить товар?',
  },
  itemName: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <Teleport to="body">
    <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0">
      <div
          v-if="show"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          @click.self="!loading && emit('close')">
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
          <div class="flex items-start gap-4">
            <div
                class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="m19 6-1 14H6L5 6" />
                <path d="M10 11v5" />
                <path d="M14 11v5" />
              </svg>
            </div>

            <div class="min-w-0 flex-1">
              <h2
                  id="delete-modal-title"
                  class="text-lg font-semibold text-gray-900">
                {{ title }}
              </h2>

              <p class="mt-2 text-sm leading-6 text-gray-500">
                Вы собираетесь удалить:
              </p>

              <p class="mt-2 break-words font-medium text-gray-900">
                {{ itemName }}
              </p>

              <p class="mt-3 text-sm leading-5 text-gray-500">
                Это действие может быть необратимым.
              </p>
            </div>
          </div>

          <div
              v-if="error"
              class="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert">
            {{ error }}
          </div>

          <div class="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
                type="button"
                @click="emit('close')"
                :disabled="loading"
                class="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700
                transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
              Отмена
            </button>

            <button
                type="button"
                @click="emit('confirm')"
                :disabled="loading"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60">
              <span
                  v-if="loading"
                  class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"/>

              {{ loading ? 'Удаление...' : 'Удалить' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
