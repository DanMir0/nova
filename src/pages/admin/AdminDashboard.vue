<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth.js'
import { getAdminDashboardData } from '../../services/adminDashboard'

const authStore = useAuthStore()

const loading = ref(true)
const errorMessage = ref('')
const dashboard = ref({
  productsCount: 0,
  ordersCount: 0,
  newOrdersCount: 0,
  sales: 0,
  latestOrders: [],
})

const statusLabels = {
  pending: 'Новый',
  confirmed: 'Оплачен',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
}

const statusClasses = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-blue-50 text-blue-700',
  processing: 'bg-violet-50 text-violet-700',
  shipped: 'bg-indigo-50 text-indigo-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700',
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 2,
  }).format(Number(price) || 0)
}

const formatDate = (date) => {
  if (!date) return '—'

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

const loadDashboard = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    dashboard.value = await getAdminDashboardData()
  } catch (error) {
    console.error('Ошибка загрузки панели управления:', error)
    errorMessage.value = 'Не удалось загрузить статистику магазина.'
  } finally {
    loading.value = false
  }
}

onMounted(loadDashboard)
</script>

<template>
  <main class="min-h-screen bg-gray-50/70 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <!-- Заголовок -->
      <header class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p class="mb-2 text-sm text-gray-500">
            Nova / Администрирование
          </p>

          <h1 class="text-3xl font-semibold tracking-tight text-gray-900">
            Панель управления
          </h1>

          <p class="mt-2 text-sm text-gray-500">
            Обзор магазина и управление заказами
          </p>
        </div>

        <button
            type="button"
            :disabled="loading"
            class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
            @click="loadDashboard"
        >
          <svg
              class="h-4 w-4"
              :class="{ 'animate-spin': loading }"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
          >
            <path
                d="M20 11a8 8 0 0 0-14-5L4 8m0-5v5h5M4 13a8 8 0 0 0 14 5l2-2m0 5v-5h-5"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
          </svg>

          {{ loading ? 'Обновляем...' : 'Обновить данные' }}
        </button>
      </header>

      <!-- Ошибка -->
      <div
          v-if="errorMessage"
          class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
      >
        <p>{{ errorMessage }}</p>

        <button
            type="button"
            class="mt-2 font-medium underline"
            @click="loadDashboard"
        >
          Попробовать снова
        </button>
      </div>

      <!-- Статистика -->
      <section>
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-900">
            Статистика магазина
          </h2>

          <span class="text-xs text-gray-400">
            Данные из Supabase
          </span>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <!-- Товары -->
          <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500">
                Активные товары
              </p>

              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <svg
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7"
                >
                  <path
                      d="m12 3 9 5-9 5-9-5 9-5Z"
                      stroke-linejoin="round"
                  />
                  <path
                      d="m3 8 9 5 9-5M3 13l9 5 9-5M3 8v8l9 5 9-5V8"
                      stroke-linejoin="round"
                  />
                </svg>
              </span>
            </div>

            <p class="mt-5 text-3xl font-semibold text-gray-900">
              {{ loading ? '—' : dashboard.productsCount }}
            </p>

            <RouterLink
                to="/admin/products"
                class="mt-3 inline-block text-sm font-medium text-gray-500 transition hover:text-gray-900"
            >
              Перейти к товарам →
            </RouterLink>
          </div>

          <!-- Заказы -->
          <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500">
                Всего заказов
              </p>

              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <svg
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7"
                >
                  <path
                      d="M6 3h12l3 5v13H3V8l3-5Z"
                      stroke-linejoin="round"
                  />
                  <path d="M3 8h18M9 12h6" stroke-linecap="round" />
                </svg>
              </span>
            </div>

            <p class="mt-5 text-3xl font-semibold text-gray-900">
              {{ loading ? '—' : dashboard.ordersCount }}
            </p>

            <RouterLink
                to="/admin/orders"
                class="mt-3 inline-block text-sm font-medium text-gray-500 transition hover:text-gray-900"
            >
              Перейти к заказам →
            </RouterLink>
          </div>

          <!-- Новые заказы -->
          <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500">
                Новые заказы
              </p>

              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <svg
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7"
                >
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 7v5l3 2" stroke-linecap="round" />
                </svg>
              </span>
            </div>

            <p class="mt-5 text-3xl font-semibold text-gray-900">
              {{ loading ? '—' : dashboard.newOrdersCount }}
            </p>

            <RouterLink
                to="/admin/orders"
                class="mt-3 inline-block text-sm font-medium text-gray-500 transition hover:text-gray-900"
            >
              Обработать заказы →
            </RouterLink>
          </div>

          <!-- Продажи -->
          <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium text-gray-500">
                Сумма продаж
              </p>

              <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <svg
                    class="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7"
                >
                  <path
                      d="M12 3v18m5-14H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H6"
                      stroke-linecap="round"
                  />
                </svg>
              </span>
            </div>

            <p class="mt-5 text-2xl font-semibold text-gray-900">
              {{ loading ? '—' : formatPrice(dashboard.sales) }}
            </p>

            <p class="mt-3 text-sm text-gray-400">
              Без отменённых заказов
            </p>
          </div>
        </div>
      </section>

      <!-- Последние заказы -->
      <section class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div class="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">
              Последние заказы
            </h2>

            <p class="mt-1 text-sm text-gray-500">
              Недавно оформленные заказы покупателей
            </p>
          </div>

          <RouterLink
              to="/admin/orders"
              class="inline-flex items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-gray-900"
          >
            Все заказы
            <span aria-hidden="true">→</span>
          </RouterLink>
        </div>

        <!-- Загрузка -->
        <div
            v-if="loading"
            class="p-10 text-center text-sm text-gray-500"
        >
          Загружаем заказы...
        </div>

        <!-- Пустой список -->
        <div
            v-else-if="!dashboard.latestOrders.length"
            class="p-10 text-center"
        >
          <p class="font-medium text-gray-900">
            Заказов пока нет
          </p>

          <p class="mt-2 text-sm text-gray-500">
            Здесь появятся последние заказы покупателей.
          </p>
        </div>

        <!-- Таблица -->
        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[650px] text-left">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                Заказ
              </th>

              <th class="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                Покупатель
              </th>

              <th class="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                Дата
              </th>

              <th class="px-5 py-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                Статус
              </th>

              <th class="px-5 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-400">
                Сумма
              </th>
            </tr>
            </thead>

            <tbody class="divide-y divide-gray-100">
            <tr
                v-for="order in dashboard.latestOrders"
                :key="order.id"
                class="transition hover:bg-gray-50/80"
            >
              <td class="px-5 py-4">
                <RouterLink
                    to="/admin/orders"
                    class="font-medium text-gray-900 transition hover:underline"
                >
                  №{{ order.id.slice(0, 8) }}
                </RouterLink>
              </td>

              <td class="px-5 py-4 text-sm text-gray-700">
                {{ order.recipient || '—' }}
              </td>

              <td class="px-5 py-4 text-sm text-gray-500">
                {{ formatDate(order.created_at) }}
              </td>

              <td class="px-5 py-4">
                  <span
                      class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                      :class="statusClasses[order.status] || 'bg-gray-100 text-gray-700'"
                  >
                    {{ statusLabels[order.status] || order.status }}
                  </span>
              </td>

              <td class="px-5 py-4 text-right text-sm font-semibold text-gray-900">
                {{ formatPrice(order.total) }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Аккаунт администратора -->
      <footer class="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center">
        <div>
          <p class="text-sm font-medium text-gray-900">
            Вы вошли в админ-панель
          </p>

          <p class="mt-1 text-sm text-gray-500">
            {{ authStore.user?.email || 'Email не указан' }}
          </p>
        </div>

        <RouterLink
            to="/"
            class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <span aria-hidden="true">←</span>
          Вернуться в магазин
        </RouterLink>
      </footer>
    </div>
  </main>
</template>
