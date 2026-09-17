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

export const updateProfile = async ({firstName, lastName, email,}) => {
    const { data: currentData, error: currentError } =
        await supabase.auth.getUser()

    if (currentError) {
        throw currentError
    }

    const currentUser = currentData.user

    const updateData = {
        data: {
            first_name: firstName,
            last_name: lastName,
            display_name: `${firstName} ${lastName}`.trim(),
        },
    }

    if (email !== currentUser.email) {
        updateData.email = email
    }

    const { data, error } = await supabase.auth.updateUser(updateData)

    if (error) {
        throw error
    }

    return data.user
}

export const signOut = async () => {
    const {error} = await supabase.auth.signOut()

    if (error) {
        throw error
    }
}

export const refreshCurrentUser = async () => {
    const { data, error } = await supabase.auth.refreshSession()

    if (error) {
        throw error
    }

    return data.user
}

const normalizePhone = (phone) => {
    const digits = phone.replace(/\D/g, '')

    if (!digits) {
        return null
    }

    if (digits.startsWith('8')) {
        return `+7${digits.slice(1)}`
    }

    if (digits.startsWith('7')) {
        return `+${digits}`
    }

    return `+${digits}`
}