import { supabase } from "../lib/supabase.js"

export const getCurrentUser = async () => {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()

    if (error) {
        throw error
    }

    return user
}

export const updateProfile = async ({
                                        firstName,
                                        lastName,
                                        email,
                                        phone,
                                    }) => {
    const { data, error } = await supabase.auth.updateUser({
        email,
        phone,
        data: {
            first_name: firstName,
            last_name: lastName,
            display_name: `${firstName} ${lastName}`.trim(),
        },
    })

    if (error) {
        throw error
    }

    return data.user
}

export const signOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
        throw error
    }
}