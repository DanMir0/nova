<script setup>
import {Search, UserRound, Heart, ShoppingBag, Menu,} from 'lucide-vue-next'
import {ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useAuthStore} from '../stores/auth'
import LoginModal from '../components/auth/LoginModal.vue'
import RegisterModal from '../components/auth/RegisterModal.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const showLoginModal = ref(false)
const showRegisterModal = ref(false)

const searchInput = ref(
    route.query.search || ''
)

let searchTimeout = null

watch(searchInput, (value) => {
  clearTimeout(searchTimeout)

  searchTimeout = setTimeout(() => {
    const query = {
      ...route.query,
    }

    if (value.trim()) {
      query.search = value.trim()
    } else {
      delete query.search
    }

    router.push({
      path: '/shop',
      query,
    })
  }, 300)
})

function openLogin() {
  showRegisterModal.value = false
  showLoginModal.value = true
}

function openRegister() {
  showLoginModal.value = false
  showRegisterModal.value = true
}

function closeAuthModals() {
  showLoginModal.value = false
  showRegisterModal.value = false
}

function handleRegisterSuccess() {
  showRegisterModal.value = false
  showLoginModal.value = false
}
</script>

<template>
  <header class="absolute left-0 top-0 z-20 w-full">
    <div
        class="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 lg:px-10">
      <!-- Logo -->
      <router-link
          to="/"
          class="text-2xl font-medium tracking-tight">
        Nova
      </router-link>

      <!-- Desktop navigation -->
      <nav class="hidden items-center gap-10 lg:flex">
        <router-link
            :to="{path: '/shop', query: {gender: 'women'}}"
            class="text-sm transition-opacity hover:opacity-50">
          Женщинам
        </router-link>

        <router-link
            :to="{path: '/shop', query: {gender: 'men'}}"
            class="text-sm transition-opacity hover:opacity-50">
          Мужчинам
        </router-link>

        <router-link
            :to="{path: '/shop', query: {new: 'true'}}"
            class="text-sm transition-opacity hover:opacity-50">
          Новинки
        </router-link>

        <router-link
            to="/collections"
            class="text-sm transition-opacity hover:opacity-50">
          Коллекции
        </router-link>

        <router-link
            :to="{path: '/shop', query: {sale: 'true'}}"
            class="text-sm transition-opacity hover:opacity-50">
          Распродажа
        </router-link>
      </nav>

      <!-- Actions -->
      <div class="flex items-center gap-5">
        <div class="relative">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              class="absolute left-3 top-1/2 -translate-y-1/2">
            <circle
                cx="11"
                cy="11"
                r="7"/>

            <path d="m20 20-3.5-3.5"/>
          </svg>

          <input
              v-model="searchInput"
              type="search"
              placeholder="Поиск"
              class="w-48 border-b border-neutral-200 bg-transparent py-2 pl-10 pr-2 text-sm outline-none transition focus:border-black"/>
        </div>

        <button
            v-if="!authStore.user"
            type="button"
            aria-label="Войти"
            class="hidden cursor-pointer transition-opacity hover:opacity-50 sm:block"
            @click="openLogin">
          <UserRound :size="20" :stroke-width="1.5"/>
        </button>

        <router-link
            v-else
            to="/account"
            aria-label="Аккаунт"
            class="hidden transition-opacity hover:opacity-50 sm:block">
          <UserRound :size="20" :stroke-width="1.5"/>
        </router-link>

        <button
            type="button"
            aria-label="Избранное"
            class="hidden transition-opacity hover:opacity-50 sm:block">
          <Heart :size="20" :stroke-width="1.5"/>
        </button>

        <router-link
            to="/cart"
            aria-label="Корзина"
            class="relative transition-opacity hover:opacity-50">
          <ShoppingBag :size="20" :stroke-width="1.5"/>

          <span
              class="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-950 px-1 text-[9px] text-white">
                        2
                    </span>
        </router-link>

        <!-- Mobile menu -->
        <button
            type="button"
            aria-label="Открыть меню"
            class="lg:hidden">
          <Menu :size="21" :stroke-width="1.5"/>
        </button>
      </div>
    </div>
  </header>
  <LoginModal
      v-if="showLoginModal"
      @close="closeAuthModals"
      @register="openRegister"/>

  <RegisterModal
      v-if="showRegisterModal"
      @close="closeAuthModals"
      @login="openLogin"
      @success="handleRegisterSuccess"/>
</template>

<style scoped>

</style>