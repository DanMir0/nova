import { createRouter, createWebHistory } from 'vue-router'
import {useAuthStore} from "../stores/auth.js";
import Home from '../pages/Home.vue'
import Shop from '../pages/Shop.vue'
import Collections from '../pages/Collections.vue'
import Cart from '../pages/Cart.vue'
import Account from '../pages/Account.vue'
import Product from "../pages/Product.vue";
import AuthCallback from "../pages/AuthCallback.vue";
import ResetPassword from "../pages/ResetPassword.vue";
import Favorites from "../pages/Favorites.vue";
import Checkout from "../pages/Checkout.vue";
import Delivery from "../pages/Delivery.vue";

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/shop',
        name: 'shop',
        component: Shop,
    },
    {
        path: '/collections',
        name: 'collections',
        component: Collections,
    },
    {
        path: '/cart',
        name: 'cart',
        component: Cart,
    },
    {
        path: '/account',
        name: 'account',
        component: Account,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/shop/:id',
        name: 'product',
        component: Product,
    },
    {
        path: '/auth/reset-password',
        name: 'reset-password',
        component: ResetPassword,
    },
    {
        path: '/auth/callback',
        name: 'auth-callback',
        component: AuthCallback,
    },
    {
        path: '/favorites',
        name: 'favorites',
        component: Favorites,
    },
    {
        path: '/checkout',
        name: 'checkout',
        component: Checkout,
    },
    {
        path: '/delivery',
        name: 'delivery',
        component: Delivery,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})


router.beforeEach(async (to) => {
    const authStore = useAuthStore()

    await authStore.initialize()

    if (to.meta.requiresAuth && !authStore.user) {
        return '/'
    }
})

export default router