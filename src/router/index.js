import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import Shop from '../pages/Shop.vue'
import Collections from '../pages/Collections.vue'
import Cart from '../pages/Cart.vue'
import Account from '../pages/Account.vue'

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
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router