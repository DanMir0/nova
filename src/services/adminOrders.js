
import { supabase } from '../lib/supabase'

// Допустимые статусы заказов
const allowedStatuses = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
]

// Получение всех заказов для админ-панели
export const getAdminOrders = async (status = 'all') => {
    let query = supabase
        .from('orders')
        .select(`
      id,
      user_id,
      status,
      total,
      promo_code,
      discount,
      delivery_method,
      delivery_price,
      city,
      address,
      recipient,
      phone,
      created_at,
      order_items (
        id,
        product_id,
        product_name,
        product_image,
        price,
        quantity,
        size,
        color
      )
    `)
        .order('created_at', { ascending: false })

    // Если выбран конкретный статус, фильтруем заказы
    if (status !== 'all') {
        query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
        console.error('Ошибка загрузки заказов:', error)
        throw error
    }

    return data || []
}

// Изменение статуса заказа
export const updateOrderStatus = async (orderId, status) => {
    if (!allowedStatuses.includes(status)) {
        throw new Error('Недопустимый статус заказа')
    }

    const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select('id, status')
        .single()

    if (error) {
        console.error('Ошибка изменения статуса заказа:', error)
        throw error
    }

    return data
}
