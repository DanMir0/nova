import {supabase} from "../lib/supabase.js"

export const getCurrentUser = async () => {
    const {
        data: {user},
        error,
    } = await supabase.auth.getUser()

    if (error) {
        throw error
    }

    return user
}

export const signOut = async () => {
    const {error} = await supabase.auth.signOut()

    if (error) {
        throw error
    }
}

export const getProfile = async (userId) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

    if (error) {
        throw error
    }

    return data
}

export const updateProfile = async ({userId, firstName, lastName, email, phone,}) => {
    const { data, error } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            updated_at: new Date().toISOString(),
        })
        .select()
        .single()

    if (error) {
        throw error
    }

    return data
}