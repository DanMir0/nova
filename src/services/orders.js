import {supabase} from '../lib/supabase'

export const createOrder = async ({
                                      cartItems,
                                      address,
                                      deliveryMethod = 'courier',
                                      deliveryPrice = 0,
                                      promoCode = null,
                                  }) => {
    const items = cartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        size: item.size || null,
        color: item.color || null,
    }))

    const {data, error} = await supabase.rpc(
        'create_order_with_promo',
        {
            p_items: items,
            p_address: {
                city: address.city,
                address: address.address,
                recipient: address.recipient,
                phone: address.phone,
            },
            p_delivery_method: deliveryMethod,
            p_delivery_price: deliveryPrice,
            p_promo_code: promoCode,
        }
    )

    if (error) {
        throw error
    }

    return data
}

export const getUserOrders = async (userId) => {
    const {data, error} = await supabase
        .from('orders')
        .select(`
            id,
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
        .eq('user_id', userId)
        .order('created_at', {
            ascending: false,
        })

    if (error) {
        throw error
    }

    return data || []
}