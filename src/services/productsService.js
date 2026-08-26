import { supabase } from '../lib/supabase'

export async function getProducts(filters = {}) {
    let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)

    if (filters.gender) {
        query = query.eq('gender', filters.gender)
    }

    if (filters.category) {
        query = query.eq('category', filters.category)
    }

    if (filters.collection) {
        query = query.eq('collection', filters.collection)
    }

    if (filters.isNew) {
        query = query.eq('is_new', true)
    }

    if (filters.isSale) {
        query = query.eq('is_sale', true)
    }

    if (filters.search) {
        query = query.or(
            `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        )
    }

    switch (filters.sort) {
        case 'price-asc':
            query = query.order('price', { ascending: true })
            break

        case 'price-desc':
            query = query.order('price', { ascending: false })
            break

        case 'name-asc':
            query = query.order('name', { ascending: true })
            break

        case 'newest':
        default:
            query = query.order('created_at', { ascending: false })
            break
    }

    const { data, error } = await query

    if (error) {
        throw error
    }

    return data ?? []
}