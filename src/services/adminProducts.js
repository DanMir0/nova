import { supabase } from '../lib/supabase.js'

export const getAdminProducts = async () => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error

    return data ?? []
}

export const createProduct = async (product) => {
    const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single()

    if (error) throw error

    return data
}

export const updateProduct = async (id, product) => {
    const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error

    return data
}

export const deleteProduct = async (id) => {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

    if (error) throw error
}