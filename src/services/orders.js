import { supabase } from '../lib/supabase'

export const createOrder = async ({
                                      userId,
                                      cartItems,
                                      address,
                                      deliveryMethod,
                                      deliveryPrice,
                                      total,
                                  }) => {

    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: userId,
            status: 'pending',
            total,
            delivery_method: deliveryMethod,
            delivery_price: deliveryPrice,
            city: address.city,
            address: address.address,
            recipient: address.recipient,
            phone: address.phone,
        })
        .select()
        .single()

    if (orderError) {
        throw orderError
    }

    const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image:
            item.product.images?.[0] ||
            item.product.image_url ||
            null,
        price: Number(item.product.price),
        quantity: item.quantity,
        size: item.size || null,
        color: item.color || null,
    }))

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

    if (itemsError) {
        throw itemsError
    }

    return order
}