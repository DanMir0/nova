import { supabase } from '../lib/supabase'

export const validatePromoCode = async (code, orderAmount) => {
    const { data, error } = await supabase.rpc(
        'validate_promo_code',
        {
            p_code: code.trim().toUpperCase(),
            p_order_amount: Number(orderAmount),
        }
    )

    if (error) {
        console.error('Validate promo code error:', error)
        throw new Error('Не удалось проверить промокод. Попробуйте ещё раз.')
    }

    if (!data?.valid) {
        throw new Error(data?.message || 'Промокод недействителен')
    }

    return {
        code: data.code,
        discount: Number(data.discount),
        minOrder: Number(data.min_order_amount),
    }
}