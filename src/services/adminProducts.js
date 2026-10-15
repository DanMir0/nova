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


export async function deleteProduct(id) {
    const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('id, image_url, images')
        .eq('id', id)
        .single()

    if (fetchError) throw fetchError

    const productImages = [
        ...(Array.isArray(product.images) ? product.images : []),
        product.image_url,
    ].filter(url => typeof url === 'string' && url.trim())

    const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

    if (deleteError) throw deleteError

    const { data: remainingProducts, error: remainingError } = await supabase
        .from('products')
        .select('image_url, images')

    if (remainingError) {
        return {
            deleted: true,
            cleanupError: 'Товар удалён, но не удалось проверить использование фотографий. Файлы оставлены в хранилище.',
        }
    }

    const usedUrls = new Set()

    for (const item of remainingProducts ?? []) {
        if (item.image_url) usedUrls.add(item.image_url)

        if (Array.isArray(item.images)) {
            item.images.forEach(url => {
                if (url) usedUrls.add(url)
            })
        }
    }

    const unusedUrls = [...new Set(productImages)]
        .filter(url => !usedUrls.has(url))

    const bucketMarker = '/storage/v1/object/public/product-images/'

    const paths = unusedUrls
        .map((url) => {
            if (typeof url !== 'string') return null

            // Поддерживаем как полный URL, так и путь без домена.
            const markerIndex = url.indexOf(bucketMarker)

            if (markerIndex !== -1) {
                return decodeURIComponent(
                    url.slice(markerIndex + bucketMarker.length).split('?')[0]
                )
            }

            const cleanPath = url.split('?')[0].replace(/^\/+/, '')

            if (
                cleanPath.startsWith('http://') ||
                cleanPath.startsWith('https://')
            ) {
                return null
            }

            return cleanPath || null
        })
        .filter(Boolean)


    if (paths.length > 0) {
        const { data, error: storageError } = await supabase.storage
            .from('product-images')
            .remove(paths)

        console.log('Удалённые файлы:', data)

        if (storageError) {
            console.error('Ошибка очистки фотографий:', storageError)

            return {
                deleted: true,
                cleanupError: storageError.message,
            }
        }
    }

    return {
        deleted: true,
        cleanupError: null,
    }
}
