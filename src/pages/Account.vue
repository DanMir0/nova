<script setup>
import {useAuthStore} from '../stores/auth'
import router from "../router/index.js";
import OrderHistory from "../components/account/OrderHistory.vue";

const authStore = useAuthStore()

const handleLogout = async () => {
    await authStore.signOut()

    router.push('/')
}
</script>

<template>
    <main class="min-h-screen bg-white">
        <div class="mx-auto max-w-[1440px] px-5 pb-20 pt-28 sm:px-8 lg:px-10">

            <div class="flex items-center justify-between">
                <h1 class="text-3xl font-normal tracking-tight">
                    Мой аккаунт
                </h1>

                <button
                        type="button"
                        class="cursor-pointer border border-neutral-200 px-6 py-3 text-sm transition hover:border-black"
                        :disabled="authStore.loading"
                        @click="handleLogout">
                    {{ authStore.loading ? 'Выходим...' : 'Выйти' }}
                </button>
            </div>

            <div class="mt-10">
                <p class="text-sm text-neutral-500">
                    {{ authStore.user?.email }}
                </p>
            </div>

            <OrderHistory/>
        </div>
    </main>
</template>