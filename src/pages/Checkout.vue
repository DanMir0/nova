<script setup>
import {computed, ref} from 'vue'
import {
    MapPin,
    Plus,
    X,
} from 'lucide-vue-next'

import {useAddressesStore} from '../stores/addresses'

const addressesStore = useAddressesStore()

const showForm = ref(false)
const editingAddressId = ref(null)

const form = ref({
    title: '',
    city: '',
    address: '',
    recipient: '',
    phone: '',
})

const resetForm = () => {
    form.value = {
        title: '',
        city: '',
        address: '',
        recipient: '',
        phone: '',
    }

    editingAddressId.value = null
}


const openAddForm = () => {
    resetForm()
    showForm.value = true
}


const openEditForm = (address) => {

    form.value = {
        title: address.title,
        city: address.city,
        address: address.address,
        recipient: address.recipient,
        phone: address.phone,
    }

    editingAddressId.value = address.id
    showForm.value = true
}


const closeForm = () => {
    showForm.value = false
    resetForm()
}


const saveAddress = () => {

    if (
        !form.value.title.trim() ||
        !form.value.city.trim() ||
        !form.value.address.trim() ||
        !form.value.recipient.trim() ||
        !form.value.phone.trim()
    ) {
        return
    }


    if (editingAddressId.value) {

        addressesStore.updateAddress(
            editingAddressId.value, {...form.value,})

    } else {

        addressesStore.addAddress({...form.value,})
    }


    closeForm()
}


const deleteAddress = (addressId) => {

    addressesStore.removeAddress(addressId)
}


const selectAddress = (addressId) => {

    addressesStore.selectAddress(addressId)
}


const makeDefault = (addressId) => {

    addressesStore.setDefaultAddress(addressId)
}
</script>


<template>
    <main class="min-h-screen bg-white">

        <div
                class="mx-auto max-w-[1440px] px-5 pb-20 pt-8 sm:px-8 lg:px-10">

            <div class="flex items-center gap-4">

                <h1 class="text-2xl font-normal tracking-tight sm:text-3xl">
                    Адреса доставки
                </h1>

            </div>

            <div class="mt-8 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[350px_minmax(0,1fr)]">

                <section>

                    <div class="space-y-3">
                        <div v-if="!addressesStore.addresses.length" class="border border-neutral-200 p-5">
                            <p class="text-sm">У вас пока нет адресов</p>
                            <p class="mt-2 text-xs leading-5 text-neutral-400">Добавьте адрес доставки, чтобы продолжить
                                оформление заказа</p>
                        </div>
                        <button
                                v-for="address in addressesStore.addresses"
                                :key="address.id"
                                type="button"
                                class="block w-full cursor-pointer border p-5 text-left transition"
                                :class="addressesStore.selectedAddressId === address.id ? 'border-neutral-900'
                                    : 'border-neutral-200 hover:border-neutral-400'"
                                @click="selectAddress(address.id)">

                            <div class="flex gap-3">

                                <span
                                        class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
                                        :class="addressesStore.selectedAddressId === address.id  ? 'border-black'
                                    : 'border-neutral-300'">

                                  <span v-if="addressesStore.selectedAddressId === address.id"
                                        class="h-2 w-2 rounded-full bg-black">
                                  </span>

                                </span>

                                <div class="min-w-0">

                                    <h2 class="text-sm font-medium">
                                        {{ address.title }}
                                    </h2>

                                    <p class="mt-2 text-xs leading-5 text-neutral-400">
                                        {{ address.city }},
                                        {{ address.address }}
                                    </p>
                                    <p class="mt-1 text-xs text-neutral-400">
                                        {{ address.recipient }}
                                    </p>

                                    <p class="mt-1 text-xs text-neutral-400">
                                        {{ address.phone }}
                                    </p>

                                </div>

                            </div>

                        </button>

                    </div>

                    <button
                            type="button"
                            class="mt-5 flex h-11 cursor-pointer items-center justify-center gap-2 border border-neutral-200 px-6 text-xs transition hover:border-black"
                            @click="openAddForm">

                        <Plus :size="15"/>

                        Добавить адрес

                    </button>

                    <RouterLink
                        to="/delivery"
                        class="mt-8 flex h-11 w-fit cursor-pointer items-center justify-center bg-black px-8 text-xs text-white transition hover:bg-neutral-800">

                        Продолжить

                    </RouterLink>

                </section>

                <section
                        class="border border-neutral-200 p-6 sm:p-8">

                    <template v-if=" addressesStore.selectedAddress && !showForm">

                        <div
                                class="flex items-center gap-2">

                            <MapPin
                                    :size="18"
                                    :stroke-width="1.5"/>

                            <h2 class="text-lg font-medium">
                                {{ addressesStore.selectedAddress.title }}
                            </h2>

                        </div>

                        <div
                                class="mt-7 grid gap-5 sm:grid-cols-2">

                            <div>

                                <label
                                        class="mb-2 block text-xs text-neutral-400">
                                    Город
                                </label>

                                <div
                                        class="border border-neutral-200 px-4 py-3 text-sm">

                                    {{ addressesStore.selectedAddress.city }}

                                </div>

                            </div>

                            <div>

                                <label
                                        class="mb-2 block text-xs text-neutral-400">
                                    Улица, дом, квартира
                                </label>

                                <div
                                        class="border border-neutral-200 px-4 py-3 text-sm">

                                    {{ addressesStore.selectedAddress.address }}

                                </div>

                            </div>

                            <div>

                                <label
                                        class="mb-2 block text-xs text-neutral-400">
                                    Получатель
                                </label>

                                <div
                                        class="border border-neutral-200 px-4 py-3 text-sm">

                                    {{ addressesStore.selectedAddress.recipient }}

                                </div>

                            </div>

                            <div>

                                <label
                                        class="mb-2 block text-xs text-neutral-400">
                                    Телефон
                                </label>

                                <div
                                        class="border border-neutral-200 px-4 py-3 text-sm">

                                    {{ addressesStore.selectedAddress.phone }}

                                </div>

                            </div>

                        </div>

                        <label
                                class="mt-6 flex cursor-pointer items-center gap-3 text-xs text-neutral-500">

                            <input
                                    type="checkbox"
                                    :checked="addressesStore.selectedAddress.isDefault"
                                    class="h-4 w-4 cursor-pointer accent-black"
                                    @change="makeDefault(addressesStore.selectedAddress.id)"/>

                            Сделать основным адресом

                        </label>

                        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                            <button
                                    type="button"
                                    class="h-11 cursor-pointer border border-neutral-200 px-8 text-xs transition hover:border-black"
                                    @click="openEditForm(addressesStore.selectedAddress)">

                                Редактировать

                            </button>

                            <button
                                    type="button"
                                    class="h-11 cursor-pointer bg-black px-8 text-xs text-white transition hover:bg-neutral-800"
                                    @click=" deleteAddress( addressesStore.selectedAddress.id)">

                                Удалить

                            </button>

                        </div>

                    </template>

                    <template v-else>

                        <div class="flex items-center justify-between">

                            <h2 class="text-lg font-medium">

                                {{ editingAddressId ? 'Редактировать адрес' : 'Новый адрес' }}

                            </h2>

                            <button
                                    type="button"
                                    aria-label="Закрыть"
                                    class="flex h-8 w-8 cursor-pointer items-center justify-center text-neutral-400 transition hover:text-black"
                                    @click="closeForm">

                                <X :size="17"/>

                            </button>

                        </div>

                        <div class="mt-7 grid gap-5 sm:grid-cols-2">

                            <div>

                                <label class="mb-2 block text-xs text-neutral-500">
                                    Название
                                </label>

                                <input
                                        v-model="form.title"
                                        type="text"
                                        placeholder="Дом"
                                        class="h-11 w-full border border-neutral-200 px-4 text-sm outline-none
                                        transition placeholder:text-neutral-400 focus:border-black"/>

                            </div>

                            <div>

                                <label class="mb-2 block text-xs text-neutral-500">
                                    Город
                                </label>

                                <input
                                        v-model="form.city"
                                        type="text"
                                        placeholder="Москва"
                                        class="h-11 w-full border border-neutral-200 px-4 text-sm outline-none
                                        transition placeholder:text-neutral-400 focus:border-black"/>

                            </div>

                            <div class="sm:col-span-2">

                                <label
                                        class="mb-2 block text-xs text-neutral-500">
                                    Улица, дом, квартира
                                </label>

                                <input
                                        v-model="form.address"
                                        type="text"
                                        placeholder="ул. Петровка, 17, кв. 5"
                                        class="h-11 w-full border border-neutral-200 px-4 text-sm outline-none
                                        transition placeholder:text-neutral-400 focus:border-black"/>

                            </div>

                            <div>

                                <label class="mb-2 block text-xs text-neutral-500">
                                    Получатель
                                </label>

                                <input
                                        v-model="form.recipient"
                                        type="text"
                                        placeholder="Имя и фамилия"
                                        class="h-11 w-full border border-neutral-200 px-4 text-sm outline-none
                                        transition placeholder:text-neutral-400 focus:border-black"/>

                            </div>

                            <div>

                                <label class="mb-2 block text-xs text-neutral-500">
                                    Телефон
                                </label>
                                <input
                                        v-model="form.phone"
                                        type="tel"
                                        placeholder="+7 999 123-45-67"
                                        class="h-11 w-full border border-neutral-200 px-4 text-sm outline-none
                                        transition placeholder:text-neutral-400 focus:border-black"/>

                            </div>

                        </div>

                        <div
                                class="mt-8 flex flex-col gap-3 sm:flex-row">

                            <button
                                    type="button"
                                    class="h-11 cursor-pointer bg-black px-8 text-xs text-white transition hover:bg-neutral-800"
                                    @click="saveAddress">

                                Сохранить

                            </button>

                            <button
                                    type="button"
                                    class="h-11 cursor-pointer border border-neutral-200 px-8 text-xs transition hover:border-black"
                                    @click="closeForm">

                                Отмена

                            </button>

                        </div>

                    </template>

                </section>

            </div>

        </div>

    </main>
</template>