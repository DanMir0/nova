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
import OrderConfirmation from "../pages/OrderConfirmation.vue";
import OrderSuccess from "../pages/OrderSuccess.vue";
import Collection from "../pages/Collection.vue";
import AdminDashboard from '../pages/admin/AdminDashboard.vue'
import AdminProducts from '../pages/admin/AdminProducts.vue'
import AdminOrders from '../pages/admin/AdminOrders.vue'

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
        path: '/collections/:collection',
        name: 'collection',
        component: Collection,
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
    {
        path: '/order-confirmation',
        name: 'order-confirmation',
        component: OrderConfirmation,
    },
    {
        path: '/order-success',
        name: 'order-success',
        component: OrderSuccess,
    },
    {
        path: '/admin',
        name: 'admin',
        component: AdminDashboard,
        meta: {
            requiresAuth: true,
            requiresAdmin: true,
        },
    },
    {
        path: '/admin/products',
        name: 'admin-products',
        component: AdminProducts,
        meta: {
            requiresAuth: true,
            requiresAdmin: true,
        },
    },
    {
        path: '/admin/orders',
        name: 'admin-orders',
        component: AdminOrders,
        meta: {
            requiresAuth: true,
            requiresAdmin: true,
        },
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

    if (to.meta.requiresAdmin) {
        await authStore.fetchProfile()

        if (!authStore.isAdmin()) {
            return '/'
        }
    }
})

export default router