<script setup>
import {onMounted, ref} from 'vue'
import {
    User,
    Package,
    Heart,
    MapPin,
    LogOut,
} from 'lucide-vue-next'
import OrderHistory from '../components/account/OrderHistory.vue'
import {getCurrentUser, updateProfile, signOut} from "../services/authService.js";

const activeSection = ref('profile')

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')

const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const menuItems = [
    {
        id: 'profile',
        label: 'Профиль',
        icon: User,
    },
    {
        id: 'orders',
        label: 'Мои заказы',
        icon: Package,
    },
    {
        id: 'favorites',
        label: 'Избранное',
        icon: Heart,
    },
    {
        id: 'address',
        label: 'Адрес доставки',
        icon: MapPin,
    },
]

const setSection = (section) => {
    activeSection.value = section
}

const loadProfile = async () => {
    try {
        loading.value = true
        errorMessage.value = ''

        const user = await getCurrentUser()

        if (!user) {
            errorMessage.value = 'Пользователь не найден'
            return
        }

        firstName.value = user.user_metadata?.first_name || ''
        lastName.value = user.user_metadata?.last_name || ''

        email.value = user.email || ''
        phone.value = user.phone || ''
    } catch (error) {
        console.error('Ошибка загрузки профиля:', error)
        errorMessage.value = 'Не удалось загрузить данные профиля'
    } finally {
        loading.value = false
    }
}

const saveProfile = async () => {
    try {
        saving.value = true
        errorMessage.value = ''
        successMessage.value = ''

        await updateProfile({
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            phone: phone.value,
        })

        successMessage.value = 'Изменения сохранены'
    } catch (error) {
        console.error('Ошибка сохранения профиля:', error)
        errorMessage.value =
            error.message || 'Не удалось сохранить изменения'
    } finally {
        saving.value = false
    }
}

onMounted(() => {
    loadProfile()
})
</script>

<template>
    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-normal tracking-tight">
            Личный кабинет
        </h1>

        <div class="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">

            <aside class="flex min-h-[500px] flex-col">
                <nav class="space-y-1">
                    <button
                        v-for="item in menuItems"
                        :key="item.id"
                        type="button"
                        class="flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left text-sm transition"
                        :class="
                            activeSection === item.id
                                ? 'bg-neutral-100 text-black'
                                : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'"
                        @click="setSection(item.id)">
                        <component
                            :is="item.icon"
                            :size="18"
                            :stroke-width="1.5"/>

                        <span>{{ item.label }}</span>
                    </button>
                </nav>

                <button
                    type="button"
                    class="mt-auto flex cursor-pointer items-center gap-3 px-3 py-2.5 text-left text-sm text-neutral-500 transition hover:text-black">
                    <LogOut
                        :size="18"
                        :stroke-width="1.5"/>

                    <span>Выйти</span>
                </button>
            </aside>

            <section class="min-w-0">

                <div v-if="activeSection === 'profile'">
                    <h2 class="text-xl font-normal">
                        Профиль
                    </h2>

                    <div class="mt-6 border border-neutral-200 p-6">
                        <div class="grid gap-5 sm:grid-cols-2">

                            <div>
                                <label class="mb-2 block text-sm text-neutral-700">
                                    Имя
                                </label>

                                <input
                                    v-model="firstName"
                                    type="text"
                                    class="w-full border-b border-neutral-300 bg-transparent py-3 text-sm outline-none transition focus:border-black"
                                    placeholder="Введите имя"/>
                            </div>

                            <div>
                                <label class="mb-2 block text-sm text-neutral-700">
                                    Фамилия
                                </label>

                                <input
                                    v-model="lastName"
                                    type="text"
                                    class="w-full border-b border-neutral-300 bg-transparent py-3 text-sm outline-none transition focus:border-black"
                                    placeholder="Введите фамилию"/>
                            </div>

                            <div>
                                <label class="mb-2 block text-sm text-neutral-700">
                                    Email
                                </label>

                                <input
                                    v-model="email"
                                    type="email"
                                    class="w-full border-b border-neutral-300 bg-transparent py-3 text-sm outline-none transition focus:border-black"
                                    placeholder="Введите email"/>
                            </div>

                            <div>
                                <label class="mb-2 block text-sm text-neutral-700">
                                    Телефон
                                </label>

                                <input
                                    v-model="phone"
                                    type="tel"
                                    class="w-full border-b border-neutral-300 bg-transparent py-3 text-sm outline-none transition focus:border-black"
                                    placeholder="Введите телефон"/>
                            </div>

                            <p
                                v-if="successMessage"
                                class="mt-4 text-sm text-green-600">
                                {{ successMessage }}
                            </p>

                            <p
                                v-if="errorMessage"
                                class="mt-4 text-sm text-red-600">
                                {{ errorMessage }}
                            </p>
                        </div>

                        <button
                            type="button"
                            class="mt-8 cursor-pointer bg-black px-8 py-3 text-sm text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
                            :disabled="saving"
                            @click="saveProfile">
                            {{ saving ? 'Сохранение...' : 'Сохранить изменения' }}
                        </button>
                    </div>
                </div>

                <!-- ORDERS -->
                <div v-else-if="activeSection === 'orders'">
                    <h2 class="text-xl font-normal">
                        Мои заказы
                    </h2>

                    <div class="mt-6 border border-neutral-200 p-6">
                        <OrderHistory />
                    </div>
                </div>

                <!-- FAVORITES -->
                <div v-else-if="activeSection === 'favorites'">
                    <h2 class="text-xl font-normal">
                        Избранное
                    </h2>

                    <div class="mt-6 border border-neutral-200 p-6">
                        <p class="text-sm text-neutral-500">
                            Здесь будут отображаться избранные товары.
                        </p>
                    </div>
                </div>

                <!-- ADDRESS -->
                <div v-else-if="activeSection === 'address'">
                    <h2 class="text-xl font-normal">
                        Адрес доставки
                    </h2>

                    <div class="mt-6 border border-neutral-200 p-6">
                        <p class="text-sm text-neutral-500">
                            Здесь будет адрес доставки.
                        </p>
                    </div>
                </div>

            </section>
        </div>
    </main>
</template>