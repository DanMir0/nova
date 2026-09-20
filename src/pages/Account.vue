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
import {
    getCurrentUser,
    updateProfile,
    getProfile,
    signOut
} from "../services/authService.js";
import {AsYouType, parsePhoneNumberFromString,} from 'libphonenumber-js'
import router from "../router/index.js";
import FavoritesContent from "../components/account/FavoritesContent.vue"
import AddressContent from "../components/account/AddressContent.vue"

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

const countries = [
    { code: 'RU', dialCode: '+7', name: 'Россия' },
    { code: 'KZ', dialCode: '+7', name: 'Казахстан' },
    { code: 'BY', dialCode: '+375', name: 'Беларусь' },
    { code: 'DE', dialCode: '+49', name: 'Германия' },
    { code: 'FR', dialCode: '+33', name: 'Франция' },
    { code: 'IT', dialCode: '+39', name: 'Италия' },
    { code: 'GB', dialCode: '+44', name: 'Великобритания' },
    { code: 'US', dialCode: '+1', name: 'США' },
    { code: 'CH', dialCode: '+41', name: 'Швейцария' },
]

const selectedCountry = ref(countries[0])

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

        const profile = await getProfile(user.id)

        firstName.value = profile?.first_name || ''
        lastName.value = profile?.last_name || ''

        email.value = profile?.email || user.email || ''

        const savedCountry = countries.find((country) => country.code === profile?.phone_country)

        if (savedCountry) {
            selectedCountry.value = savedCountry
        }

        loadPhone(profile?.phone)
    } catch (error) {
        console.error('Ошибка загрузки профиля:', error)

        errorMessage.value =
            'Не удалось загрузить данные профиля'
    } finally {
        loading.value = false
    }
}

const saveProfile = async () => {
    try {
        saving.value = true
        errorMessage.value = ''
        successMessage.value = ''

        const user = await getCurrentUser()

        if (!user) {
            errorMessage.value = 'Пользователь не найден'
            return
        }

        const normalizedPhone = getNormalizedPhone()

        if (normalizedPhone === null) {
            errorMessage.value = 'Введите корректный номер телефона'
            return
        }

        await updateProfile({
            userId: user.id,
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            phone: normalizedPhone,
            phone_country: selectedCountry.value.code,
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

const handleSignOut = async () => {
    try {
        await signOut()
        router.push('/')
    } catch (e) {
        errorMessage.value = 'Возникла ошибка. Попробуйте позже.'
    }
}

const handleCountryChange = () => {
    phone.value = ''
}

const handlePhoneInput = (event) => {
    const formatter = new AsYouType(selectedCountry.value.code)

    phone.value = formatter.input(event.target.value)
}

const getNormalizedPhone = () => {
    if (!phone.value.trim()) {
        return ''
    }

    const phoneNumber = parsePhoneNumberFromString(
        phone.value,
        selectedCountry.value.code
    )

    if (!phoneNumber || !phoneNumber.isValid()) {
        return null
    }

    return phoneNumber.number
}

const loadPhone = (savedPhone) => {
    if (!savedPhone) {
        phone.value = ''
        return
    }

    const phoneNumber = parsePhoneNumberFromString(savedPhone)

    if (!phoneNumber) {
        phone.value = savedPhone
        return
    }

    const formatter = new AsYouType(selectedCountry.value.code)

    phone.value = formatter.input(
        phoneNumber.nationalNumber
    )
}

onMounted(() => {
    loadProfile()
})
</script>

<template>
    <main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <h1 class="text-xl font-normal tracking-tight sm:text-2xl">
            Личный кабинет
        </h1>

        <div class="mt-8 grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-[220px_1fr] lg:gap-10">

            <aside class="flex flex-col lg:min-h-[500px] lg:flex-col">
                <nav class="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
                    <button
                            v-for="item in menuItems"
                            :key="item.id"
                            type="button"
                            class="flex shrink-0 cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-sm
                            transition sm:px-4 lg:w-full"
                            :class="
                            activeSection === item.id
                                ? 'bg-neutral-100 text-black'
                                : 'text-neutral-500 hover:bg-neutral-50 hover:text-black'"
                            @click="setSection(item.id)">
                        <component
                                :is="item.icon"
                                :size="18"
                                :stroke-width="1.5"
                                class="shrink-0"/>

                        <span>{{ item.label }}</span>
                    </button>
                </nav>

                <button
                        type="button"
                        class="mt-3 flex w-fit cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-sm
                        text-neutral-500 transition hover:text-black lg:mt-auto lg:w-full lg:gap-3"
                        @click="handleSignOut">
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

                    <div class="mt-5 border border-neutral-200 p-4 sm:mt-6 sm:p-6">
                        <div class="grid gap-4 sm:gap-5 sm:grid-cols-2">

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

                                <div
                                    class="flex items-stretch gap-3 border-b border-neutral-300 transition focus-within:border-black">

                                    <!-- Country -->
                                    <div class="relative flex shrink-0 items-center">
                                        <select
                                            v-model="selectedCountry"
                                            class="h-full cursor-pointer appearance-none bg-transparent py-3 pr-6 text-sm outline-none"
                                            @change="handleCountryChange">
                                            <option
                                                v-for="country in countries"
                                                :key="country.code"
                                                :value="country">
                                                {{ country.code }} {{ country.dialCode }}
                                            </option>
                                        </select>

                                        <svg
                                            class="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <polyline points="6 9 12 15 18 9"/>
                                        </svg>
                                    </div>

                                    <!-- Divider -->
                                    <span class="my-3 w-px bg-neutral-300"></span>

                                    <!-- Input -->
                                    <input
                                        :value="phone"
                                        type="tel"
                                        inputmode="tel"
                                        autocomplete="tel"
                                        placeholder="Введите номер телефона"
                                        class="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                                        @input="handlePhoneInput"/>
                                </div>
                            </div>
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

                        <button
                                type="button"
                                class="mt-7 w-full cursor-pointer bg-black px-6 py-3.5 text-sm text-white transition
                                hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8 sm:py-3"
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

                    <div class="mt-5 border border-neutral-200 p-4 sm:mt-6 sm:p-6">
                        <OrderHistory/>
                    </div>
                </div>

                <!-- FAVORITES -->
                <div v-else-if="activeSection === 'favorites'">
                    <h2 class="text-xl font-normal">
                        Избранное
                    </h2>

                    <div class="mt-5 border border-neutral-200 p-4 sm:mt-6 sm:p-6">
                        <FavoritesContent />
                    </div>
                </div>

                <!-- ADDRESS -->
                <div v-else-if="activeSection === 'address'">
                    <h2 class="text-xl font-normal">
                        Адрес доставки
                    </h2>

                    <div class="mt-5 border border-neutral-200 p-4 sm:mt-6 sm:p-6">
                        <AddressContent/>
                    </div>
                </div>

            </section>
        </div>
    </main>
</template>