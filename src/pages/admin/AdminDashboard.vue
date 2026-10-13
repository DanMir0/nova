<script setup>
import { useAuthStore } from '../../stores/auth.js'

const authStore = useAuthStore()
</script>

<template>
  <main class="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
    <div class="mx-auto max-w-7xl">
      <div class="mb-8">
        <p class="mb-2 text-sm text-gray-500">
          Nova / Администрирование
        </p>

        <h1 class="text-3xl font-semibold text-gray-900">
          Панель управления
        </h1>

        <p class="mt-2 text-gray-600">
          Управление магазином Nova
        </p>
      </div>

      <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <RouterLink
            to="/admin/products"
            class="rounded-xl border border-gray-200 bg-white p-6 transition hover:border-gray-400">
          <h2 class="text-lg font-medium text-gray-900">
            Товары
          </h2>

          <p class="mt-2 text-sm text-gray-500">
            Просмотр, добавление и редактирование товаров
          </p>

          <span class="mt-5 inline-block text-sm font-medium text-gray-900">
                        Открыть →
                    </span>
        </RouterLink>
      </section>

      <p class="mt-8 text-sm text-gray-500">
        Вы вошли как:
        {{ authStore.user?.email }}
      </p>

      <RouterLink
          to="/"
          class="mt-4 inline-block text-sm underline underline-offset-4">
        Вернуться в магазин
      </RouterLink>
    </div>
  </main>
</template>