
import { supabase } from '../lib/supabase'

export const getAdminDashboardData = async () => {
    const [
        productsResult,
        ordersResult,
        newOrdersResult,
        latestOrdersResult,
    ] = await Promise.all([
        // Количество активных товаров
        supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true),

        // Заказы для расчёта общей суммы продаж
        supabase
            .from('orders')
            .select('id, total, status'),

        // Количество новых заказов
        supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending'),

        // Последние 5 заказов
        supabase
            .from('orders')
            .select(`
        id,
        status,
        total,
        recipient,
        created_at
      `)
            .order('created_at', { ascending: false })
            .limit(5),
    ])

    const results = [
        productsResult,
        ordersResult,
        newOrdersResult,
        latestOrdersResult,
    ]

    const errorResult = results.find((result) => result.error)

    if (errorResult) {
        console.error(
            'Ошибка загрузки статистики админ-панели:',
            errorResult.error,
        )

        throw errorResult.error
    }

    const orders = ordersResult.data || []

    // Не считаем отменённые заказы продажами
    const sales = orders
        .filter((order) => order.status !== 'cancelled')
        .reduce((sum, order) => sum + Number(order.total || 0), 0)

    return {
        productsCount: productsResult.count || 0,
        ordersCount: orders.length,
        newOrdersCount: newOrdersResult.count || 0,
        sales,
        latestOrders: latestOrdersResult.data || [],
    }
}
