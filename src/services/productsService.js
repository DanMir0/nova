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

    if (filters.color) {
        query = query.contains('colors', [filters.color])
    }

    if (filters.size) {
        query = query.contains('sizes', [filters.size])
    }

    if (filters.isNew) {
        query = query.eq('is_new', true)
    }

    if (filters.isSale) {
        query = query.eq('is_sale', true)
    }

    if (filters.minPrice !== null && filters.minPrice !== '') {
        query = query.gte('price', filters.minPrice)
    }

    if (filters.maxPrice !== null && filters.maxPrice !== '') {
        query = query.lte('price', filters.maxPrice)
    }

    if (filters.search) {
        const search = filters.search.trim()

        if (search.length > 0) {
            query = query.or(
                `name.ilike.%${search}%,description.ilike.%${search}%`
            )
        }
    }

    switch (filters.sort) {
        case 'price-asc':
            query = query.order('price', {
                ascending: true,
            })
            break

        case 'price-desc':
            query = query.order('price', {
                ascending: false,
            })
            break

        case 'name-asc':
            query = query.order('name', {
                ascending: true,
            })
            break

        case 'newest':
        default:
            query = query.order('created_at', {
                ascending: false,
            })
            break
    }

    const { data, error } = await query

    if (error) {
        console.error('getProducts error:', error)
        throw error
    }

    return data ?? []
}

export async function getProductById(id) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        throw error
    }

    return data
}

export async function getProductVariants(product) {
    if (!product?.variant_group_id) {
        return []
    }

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('variant_group_id', product.variant_group_id)
        .eq('is_active', true)

    if (error) {
        throw error
    }

    return data ?? []
}