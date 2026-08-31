import { supabase } from '../lib/supabase'

// Получить избранные товары пользователя
export async function getFavorites() {
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from('favorites')
        .select(`
        id,
        product_id,
        products (*)
      `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        throw error
    }

    return data ?? []
}

// Проверить, находится ли товар в избранном
export async function isFavorite(productId) {
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return false
    }

    const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle()

    if (error) {
        throw error
    }

    return !!data
}

// Добавить товар в избранное
export async function addFavorite(productId) {
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Необходимо войти в аккаунт')
    }

    const { data, error } = await supabase
        .from('favorites')
        .insert({
            user_id: user.id,
            product_id: productId,
        })
        .select()
        .single()

    if (error) {
        throw error
    }

    return data
}

// Удалить товар из избранного
export async function removeFavorite(productId) {
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Необходимо войти в аккаунт')
    }

    const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)

    if (error) {
        throw error
    }
}