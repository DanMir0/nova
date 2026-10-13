import { supabase } from '../lib/supabase.js'

const BUCKET = 'product-images'

export const uploadProductImage = async (file) => {
    if (!file) {
        throw new Error('Выбери фотографию.')
    }

    if (!file.type.startsWith('image/')) {
        throw new Error('Можно загружать только изображения.')
    }

    if (file.size > 5 * 1024 * 1024) {
        throw new Error('Размер фотографии не должен превышать 5 МБ.')
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'

    const filePath = `${crypto.randomUUID()}.${extension}`

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
        })

    if (error) {
        throw error
    }

    const { data } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath)

    return data.publicUrl
}