
<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  getAdminOrders,
  updateOrderStatus,
} from '../../services/adminOrders'

const orders = ref([])
const loading = ref(false)
const errorMessage = ref('')
const selectedStatus = ref('all')
const expandedOrderId = ref(null)
const updatingOrderId = ref(null)
const statusError = ref('')

const statuses = [
  { value: 'pending', label: 'Новый' },
  { value: 'confirmed', label: 'Оплачен' },
  { value: 'processing', label: 'В обработке' },
  { value: 'shipped', label: 'Отправлен' },
  { value: 'delivered', label: 'Доставлен' },
  { value: 'cancelled', label: 'Отменён' },
]

const statusLabels = Object.fromEntries(
    statuses.map((status) => [status.value, status.label]),
)

const statusClasses = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-violet-100 text-violet-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const filteredOrders = computed(() => {
  if (selectedStatus.value === 'all') {
    return orders.value
  }

  return orders.value.filter(
      (order) => order.status === selectedStatus.value,
  )
})

const orderCounts = computed(() => {
  const counts = { all: orders.value.length }

  for (const status of statuses) {
    counts[status.value] = orders.value.filter(
        (order) => order.status === status.value,
    ).length
  }

  return counts
})

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
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

const loadOrders = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    orders.value = await getAdminOrders('all')
  } catch (error) {
    console.error('Ошибка загрузки заказов:', error)
    errorMessage.value = 'Не удалось загрузить заказы. Попробуйте ещё раз.'
  } finally {
    loading.value = false
  }
}

const changeFilter = async (status) => {
  selectedStatus.value = status
}

const toggleOrder = (orderId) => {
  expandedOrderId.value =
      expandedOrderId.value === orderId ? null : orderId
}

const changeOrderStatus = async (order, newStatus) => {
  if (order.status === newStatus) return

  updatingOrderId.value = order.id
  statusError.value = ''

  try {
    const updatedOrder = await updateOrderStatus(order.id, newStatus)

    // Обновляем заказ на странице без повторной загрузки списка.
    order.status = updatedOrder.status
  } catch (error) {
    console.error('Ошибка изменения статуса:', error)
    statusError.value =
        `Не удалось изменить статус заказа №${order.id.slice(0, 8)}.`
  } finally {
    updatingOrderId.value = null
  }
}

onMounted(loadOrders)
</script>


<template>
  <section class="min-h-screen space-y-7 bg-gray-50/70 p-4 sm:p-6 lg:p-8">
    <RouterLink
        to="/admin"
        class="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-900">
      <span aria-hidden="true">←</span>
      Панель управления
    </RouterLink>
    <!-- Header -->
    <header class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <div class="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <span>Админ-панель</span>
          <span>/</span>
          <span class="text-gray-900">Заказы</span>
        </div>

        <h1 class="text-3xl font-semibold tracking-tight text-gray-900">
          Заказы
        </h1>

        <p class="mt-2 text-sm text-gray-500">
          Управляйте заказами и отслеживайте их выполнение
        </p>
      </div>

      <button
          type="button"
          :disabled="loading"
          class="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3
          text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
          @click="loadOrders">
        <svg
            class="h-4 w-4"
            :class="{ 'animate-spin': loading }"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8">
          <path
              d="M20 11a8 8 0 0 0-14-5L4 8m0-5v5h5M4 13a8 8 0 0 0 14 5l2-2m0 5v-5h-5"
              stroke-linecap="round"
              stroke-linejoin="round"
          />
        </svg>
        {{ loading ? 'Обновляем...' : 'Обновить данные' }}
      </button>
    </header>

    <!-- Statistics -->
    <div class="grid grid-cols-2 gap-4 xl:grid-cols-4">
      <button
          v-for="item in [
          { value: 'all', label: 'Все заказы', icon: 'all' },
          { value: 'pending', label: 'Новые', icon: 'pending' },
          { value: 'processing', label: 'В обработке', icon: 'processing' },
          { value: 'delivered', label: 'Доставлены', icon: 'delivered' },
        ]"
          :key="item.value"
          type="button"
          class="group rounded-2xl border bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
          :class="
          selectedStatus === item.value ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200 hover:border-gray-300'"
          @click="changeFilter(item.value)">
        <div class="flex items-center justify-between gap-3">
          <span class="text-sm font-medium text-gray-500">
            {{ item.label }}
          </span>

          <span
              class="flex h-9 w-9 items-center justify-center rounded-xl"
              :class="{
              'bg-gray-100 text-gray-700': item.icon === 'all',
              'bg-amber-50 text-amber-700': item.icon === 'pending',
              'bg-violet-50 text-violet-700': item.icon === 'processing',
              'bg-emerald-50 text-emerald-700': item.icon === 'delivered',
            }">
            <svg
                v-if="item.icon === 'all'"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7">
              <rect x="4" y="4" width="6" height="6" rx="1" />
              <rect x="14" y="4" width="6" height="6" rx="1" />
              <rect x="4" y="14" width="6" height="6" rx="1" />
              <rect x="14" y="14" width="6" height="6" rx="1" />
            </svg>

            <svg
                v-else-if="item.icon === 'pending'"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7">
              <circle cx="12" cy="12" r="8" />
              <path d="M12 7v5l3 2" stroke-linecap="round" />
            </svg>

            <svg
                v-else-if="item.icon === 'processing'"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7">
              <path d="M12 3v3m0 12v3M3 12h3m12 0h3" stroke-linecap="round" />
              <circle cx="12" cy="12" r="6" />
            </svg>

            <svg
                v-else
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.7">
              <path d="m5 12 4 4L19 6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </div>

        <p class="mt-4 text-3xl font-semibold tracking-tight text-gray-900">
          {{ orderCounts[item.value] ?? 0 }}
        </p>

        <p class="mt-2 text-xs text-gray-400">
          {{item.value === 'all' ? 'Всего в системе' : 'Заказов с этим статусом'}}
        </p>
      </button>
    </div>

    <!-- Filter by all statuses -->
    <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        <h2 class="text-lg font-semibold text-gray-900">
          Список заказов
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Найдено: {{ filteredOrders.length }}
        </p>
      </div>

      <label class="flex items-center gap-3">
        <span class="whitespace-nowrap text-sm text-gray-500">
          Статус:
        </span>

        <select
            :value="selectedStatus"
            class="w-full min-w-40 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700
            outline-none transition focus:border-gray-500 sm:w-auto"
            @change="changeFilter($event.target.value)">
          <option value="all">Все заказы</option>
          <option
              v-for="status in statuses"
              :key="status.value"
              :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </label>
    </div>

    <!-- Errors -->
    <div
        v-if="errorMessage"
        class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      <p>{{ errorMessage }}</p>
      <button
          type="button"
          class="mt-2 font-semibold underline"
          @click="loadOrders">
        Попробовать снова
      </button>
    </div>

    <div
        v-if="statusError"
        class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ statusError }}
    </div>

    <!-- Loading -->
    <div
        v-if="loading"
        class="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
      <div class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
      <p class="mt-4 text-sm text-gray-500">
        Загружаем заказы...
      </p>
    </div>

    <!-- Orders -->
    <div v-else-if="filteredOrders.length" class="space-y-4">
      <article
          v-for="order in filteredOrders"
          :key="order.id"
          class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
        <div class="flex flex-col gap-5 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <!-- Order Information -->
          <button
              type="button"
              class="min-w-0 text-left"
              @click="toggleOrder(order.id)">
            <div class="flex flex-wrap items-center gap-3">
              <span class="text-base font-semibold text-gray-900">
                Заказ №{{ order.id.slice(0, 8) }}
              </span>

              <span
                  class="rounded-full px-3 py-1 text-xs font-semibold"
                  :class="statusClasses[order.status] || 'bg-gray-100 text-gray-700'">
                {{ statusLabels[order.status] || order.status }}
              </span>
            </div>

            <p class="mt-2 text-sm text-gray-500">
              {{ formatDate(order.created_at) }}
            </p>

            <div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span class="flex items-center gap-2 text-gray-700">
                <svg
                    class="h-4 w-4 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21a8 8 0 0 1 16 0" stroke-linecap="round" />
                </svg>
                {{ order.recipient }}
              </span>

              <span class="flex items-center gap-2 text-gray-500">
                <svg
                    class="h-4 w-4 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.7">
                  <path
                      d="M7 3h3l2 5-2 1.5a14 14 0 0 0 4.5 4.5L16 12l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 5 5a2 2 0 0 1 2-2Z"
                      stroke-linejoin="round"
                  />
                </svg>
                {{ order.phone }}
              </span>
            </div>
          </button>

          <!-- Sum & actions -->
          <div class="flex flex-wrap items-center gap-3 xl:justify-end">
            <div class="mr-2 min-w-28 xl:text-right">
              <p class="text-xs text-gray-400">
                Сумма заказа
              </p>
              <p class="mt-1 text-xl font-semibold tracking-tight text-gray-900">
                {{ formatPrice(order.total) }}
              </p>
            </div>

            <select
                :value="order.status"
                :disabled="updatingOrderId === order.id"
                class="min-w-36 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700
                outline-none transition focus:border-gray-500 disabled:opacity-50"
                aria-label="Изменить статус заказа"
                @change="changeOrderStatus(order, $event.target.value)">
              <option
                  v-for="status in statuses"
                  :key="status.value"
                  :value="status.value">
                {{ status.label }}
              </option>
            </select>

            <button type="button"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm
                 font-medium text-white transition hover:bg-gray-700"
                @click="toggleOrder(order.id)">
              {{ expandedOrderId === order.id ? 'Свернуть' : 'Подробнее' }}

              <svg
                  class="h-4 w-4 transition-transform"
                  :class="{ 'rotate-180': expandedOrderId === order.id }"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8">
                <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Description -->
        <div
            v-if="expandedOrderId === order.id"
            class="space-y-6 border-t border-gray-200 bg-gray-50/80 p-4 sm:p-6">
          <div class="grid gap-6 lg:grid-cols-2">
            <!-- Delivery -->
            <section class="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 class="font-semibold text-gray-900">
                Данные доставки
              </h3>

              <dl class="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Получатель
                  </dt>
                  <dd class="mt-1.5 text-sm text-gray-800">
                    {{ order.recipient || '—' }}
                  </dd>
                </div>

                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Телефон
                  </dt>
                  <dd class="mt-1.5 text-sm text-gray-800">
                    {{ order.phone || '—' }}
                  </dd>
                </div>

                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Город
                  </dt>
                  <dd class="mt-1.5 text-sm text-gray-800">
                    {{ order.city || '—' }}
                  </dd>
                </div>

                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Адрес
                  </dt>
                  <dd class="mt-1.5 text-sm text-gray-800">
                    {{ order.address || '—' }}
                  </dd>
                </div>

                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Способ доставки
                  </dt>
                  <dd class="mt-1.5 text-sm text-gray-800">
                    {{order.delivery_method === 'courier' ? 'Курьер' : order.delivery_method === 'pickup' ? 'Самовывоз' : '—'}}
                  </dd>
                </div>

                <div>
                  <dt class="text-xs font-medium uppercase tracking-wide text-gray-400">
                    Стоимость доставки
                  </dt>
                  <dd class="mt-1.5 text-sm text-gray-800">
                    {{ formatPrice(order.delivery_price) }}
                  </dd>
                </div>
              </dl>
            </section>

            <!-- Sum cart -->
            <section class="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 class="font-semibold text-gray-900">
                Оплата и итог
              </h3>

              <div class="mt-5 space-y-3 text-sm">
                <div class="flex justify-between gap-4">
                  <span class="text-gray-500">Сумма заказа</span>
                  <span class="font-medium text-gray-900">
                    {{ formatPrice(order.total) }}
                  </span>
                </div>

                <div
                    v-if="Number(order.discount) > 0"
                    class="flex justify-between gap-4">
                  <span class="text-gray-500">
                    Скидка
                    <span v-if="order.promo_code">
                      ({{ order.promo_code }})
                    </span>
                  </span>
                  <span class="font-medium text-emerald-700">
                    −{{ formatPrice(order.discount) }}
                  </span>
                </div>

                <div class="flex justify-between gap-4 border-t border-gray-100 pt-4 text-base">
                  <span class="font-semibold text-gray-900">Итого</span>
                  <span class="font-semibold text-gray-900">
                    {{ formatPrice(order.total) }}
                  </span>
                </div>
              </div>

              <p class="mt-5 break-all border-t border-gray-100 pt-4 text-xs text-gray-400">
                ID покупателя: {{ order.user_id }}
              </p>
            </section>
          </div>

          <!-- Products -->
          <section class="rounded-2xl border border-gray-200 bg-white p-5">
            <div class="flex items-center justify-between gap-3">
              <h3 class="font-semibold text-gray-900">
                Состав заказа
              </h3>

              <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                {{ order.order_items?.length || 0 }}
                {{(order.order_items?.length || 0) === 1 ? 'товар' : 'товаров'}}
              </span>
            </div>

            <p
                v-if="!order.order_items?.length"
                class="mt-4 text-sm text-gray-500">
              В заказе нет доступных позиций.
            </p>

            <div v-else class="mt-4 divide-y divide-gray-100">
              <div
                  v-for="item in order.order_items"
                  :key="item.id"
                  class="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
                <img
                    v-if="item.product_image"
                    :src="item.product_image"
                    :alt="item.product_name"
                    class="h-24 w-20 shrink-0 rounded-xl bg-gray-100 object-cover"/>

                <div class="min-w-0 flex-1">
                  <p class="font-medium text-gray-900">
                    {{ item.product_name }}
                  </p>
                  <p class="mt-1 text-sm text-gray-500">
                    Размер: {{ item.size || '—' }}
                    <span class="mx-1">·</span>
                    Цвет: {{ item.color || '—' }}
                  </p>
                  <p class="mt-2 text-sm text-gray-500">
                    {{ item.quantity }} шт. × {{ formatPrice(item.price) }}
                  </p>
                </div>

                <p class="font-semibold text-gray-900 sm:text-right">
                  {{ formatPrice(Number(item.price) * Number(item.quantity)) }}
                </p>
              </div>
            </div>
          </section>
        </div>
      </article>
    </div>

    <!-- Empty list -->
    <div
        v-else-if="!errorMessage"
        class="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
      <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
        <svg
            class="h-7 w-7 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6">
          <path d="M6 3h12l3 5v13H3V8l3-5Z" stroke-linejoin="round" />
          <path d="M3 8h18M9 12h6" stroke-linecap="round" />
        </svg>
      </div>

      <h3 class="mt-4 font-semibold text-gray-900">
        Заказов не найдено
      </h3>

      <p class="mt-2 text-sm text-gray-500">
        Попробуйте выбрать другой статус или обновить список.
      </p>

      <button
          type="button"
          class="mt-5 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
          @click="changeFilter('all')">
        Показать все заказы
      </button>
    </div>
  </section>
</template>

