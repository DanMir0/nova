<script setup>
import {Search, UserRound, Heart, ShoppingBag, Menu, X} from 'lucide-vue-next'
import {ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useAuthStore} from '../stores/auth'
import LoginModal from '../components/auth/LoginModal.vue'
import RegisterModal from '../components/auth/RegisterModal.vue'
import ForgotPasswordModal from "./auth/ForgotPasswordModal.vue";
import {useFavoritesStore} from '../stores/favorites'
import {useCartStore} from "../stores/cart.js";

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()
const cartStore = useCartStore()

const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const showForgotModal = ref(false)
const isMobileMenuOpen = ref(false)

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
  showForgotModal.value = false
  showLoginModal.value = true
}

function openRegister() {
  showLoginModal.value = false
  showForgotModal.value = false
  showRegisterModal.value = true
}

function openForgot() {
  showLoginModal.value = false
  showRegisterModal.value = false
  showForgotModal.value = true
}

function closeAuthModals() {
  showLoginModal.value = false
  showRegisterModal.value = false
  showForgotModal.value = false
}

function handleRegisterSuccess() {
  showRegisterModal.value = false
  showLoginModal.value = false
}

const handleLoginSuccess = () => {
  closeAuthModals()
}

const openMobileMenu = () => {
    isMobileMenuOpen.value = true
}

const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
}

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleMobileNavigation = () => {
    closeMobileMenu()
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

        <RouterLink
            to="/favorites"
            aria-label="Избранное"
            class="hidden cursor-pointer transition-opacity hover:opacity-50 sm:block">
          <Heart
              :size="20"
              :stroke-width="1.5"/>
        </RouterLink>

        <router-link
            to="/cart"
            aria-label="Корзина"
            class="relative transition-opacity hover:opacity-50">
          <ShoppingBag :size="20" :stroke-width="1.5"/>

          <span
              class="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-neutral-950
              px-1 text-[9px] text-white">
            {{ cartStore.totalItems }}
          </span>
        </router-link>

        <!-- Mobile menu -->
          <button
                  type="button"
                  :aria-label="isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'"
                  class="cursor-pointer lg:hidden"
                  @click="toggleMobileMenu">
              <X
                      v-if="isMobileMenuOpen"
                      :size="21"
                      :stroke-width="1.5"/>

              <Menu
                      v-else
                      :size="21"
                      :stroke-width="1.5"/>
          </button>
      </div>
    </div>
      <!-- Mobile menu -->
      <!-- Mobile / tablet menu -->
      <div
              v-if="isMobileMenuOpen"
              class="fixed inset-0 z-30 lg:hidden">

          <!-- Backdrop -->
          <div
                  class="absolute inset-0 bg-black/40 backdrop-blur-sm"
                  @click="closeMobileMenu"></div>

          <!-- Panel -->
          <aside
                  class="absolute left-0 top-0 flex h-full w-full max-w-full flex-col border-r border-neutral-200 bg-white
               sm:max-w-sm">

              <!-- Panel header -->
              <div
                      class="flex h-20 shrink-0 items-center justify-between border-b border-neutral-100 px-6">
                  <router-link
                          to="/"
                          class="text-2xl font-medium tracking-tight"
                          @click="handleMobileNavigation">
                      Nova
                  </router-link>

                  <button
                          type="button"
                          aria-label="Закрыть меню"
                          class="cursor-pointer transition-opacity hover:opacity-50"
                          @click="closeMobileMenu">
                      <X :size="21" :stroke-width="1.5"/>
                  </button>
              </div>

              <!-- Scrollable content -->
              <div class="flex-1 overflow-y-auto px-6 py-6">
                  <nav class="flex flex-col">
                      <RouterLink
                              :to="{ path: '/shop', query: { gender: 'women' } }"
                              class="border-b border-neutral-100 py-4 text-base"
                              @click="handleMobileNavigation">
                          Женщинам
                      </RouterLink>

                      <RouterLink
                              :to="{ path: '/shop', query: { gender: 'men' } }"
                              class="border-b border-neutral-100 py-4 text-base"
                              @click="handleMobileNavigation">
                          Мужчинам
                      </RouterLink>

                      <RouterLink
                              :to="{ path: '/shop', query: { new: 'true' } }"
                              class="border-b border-neutral-100 py-4 text-base"
                              @click="handleMobileNavigation">
                          Новинки
                      </RouterLink>

                      <RouterLink
                              to="/collections"
                              class="border-b border-neutral-100 py-4 text-base"
                              @click="handleMobileNavigation">
                          Коллекции
                      </RouterLink>

                      <RouterLink
                              :to="{ path: '/shop', query: { sale: 'true' } }"
                              class="border-b border-neutral-100 py-4 text-base"
                              @click="handleMobileNavigation">
                          Распродажа
                      </RouterLink>
                  </nav>

                  <!-- Mobile actions -->
                  <div class="mt-6 flex flex-col gap-4">
                      <!-- Account -->
                      <button
                              v-if="!authStore.user"
                              type="button"
                              class="flex cursor-pointer items-center gap-3 text-sm"
                              @click="openLogin(); closeMobileMenu()">
                          <UserRound :size="19" :stroke-width="1.5"/>
                          Войти
                      </button>

                      <RouterLink
                              v-else
                              to="/account"
                              class="flex items-center gap-3 text-sm"
                              @click="handleMobileNavigation">
                          <UserRound :size="19" :stroke-width="1.5"/>
                          Личный кабинет
                      </RouterLink>

                      <!-- Favorites -->
                      <RouterLink
                              to="/favorites"
                              class="flex items-center gap-3 text-sm"
                              @click="handleMobileNavigation">
                          <Heart :size="19" :stroke-width="1.5"/>
                          Избранное
                      </RouterLink>

                      <!-- Cart -->
                      <RouterLink
                              to="/cart"
                              class="flex items-center gap-3 text-sm"
                              @click="handleMobileNavigation">
                          <ShoppingBag :size="19" :stroke-width="1.5"/>
                          <span>
                        Корзина
                        <span class="text-neutral-400">
                            ({{ cartStore.totalItems }})
                        </span>
                    </span>
                      </RouterLink>
                  </div>
              </div>
          </aside>
      </div>

  </header>
  <LoginModal
      v-if="showLoginModal"
      @close="closeAuthModals"
      @register="openRegister"
      @forgot-password="openForgot"
      @succes="handleLoginSuccess"/>

  <RegisterModal
      v-if="showRegisterModal"
      @close="closeAuthModals"
      @login="openLogin"
      @success="handleRegisterSuccess"/>

  <ForgotPasswordModal
      v-if="showForgotModal"
      @close="closeAuthModals"
      @login="openLogin"/>
</template>

<style scoped>

</style>