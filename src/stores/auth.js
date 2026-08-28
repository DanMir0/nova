import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const session = ref(null)

    const loading = ref(false)
    const initialized = ref(false)
    const error = ref(null)

    const initialize = async () => {
        if (initialized.value) {
            return
        }

        try {
            loading.value = true
            error.value = null

            const {
                data: { session: currentSession },
            } = await supabase.auth.getSession()

            session.value = currentSession
            user.value = currentSession?.user ?? null

            // Следим за изменениями авторизации
            supabase.auth.onAuthStateChange((_event, newSession) => {
                session.value = newSession
                user.value = newSession?.user ?? null
            })

            initialized.value = true
        } catch (err) {
            console.error('Auth initialization error:', err)

            error.value = 'Не удалось проверить авторизацию'
        } finally {
            loading.value = false
        }
    }

    const signUp = async (email, password) => {
        try {
            loading.value = true
            error.value = null

            const { data, error: signUpError } =
                await supabase.auth.signUp({
                    email,
                    password,
                })

            if (signUpError) {
                throw signUpError
            }

            session.value = data.session
            user.value = data.user

            return {
                success: true,
                user: data.user,
                session: data.session,
            }
        } catch (err) {
            console.error('Sign up error:', err)

            error.value = err.message || 'Не удалось зарегистрироваться'

            return {
                success: false,
                error: error.value,
            }
        } finally {
            loading.value = false
        }
    }

    const signIn = async (email, password) => {
        try {
            loading.value = true
            error.value = null

            const { data, error: signInError } =
                await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

            if (signInError) {
                throw signInError
            }

            session.value = data.session
            user.value = data.user

            return {
                success: true,
                user: data.user,
                session: data.session,
            }
        } catch (err) {
            console.error('Sign in error:', err)

            error.value = err.message || 'Неверный e-mail или пароль'

            return {
                success: false,
                error: error.value,
            }
        } finally {
            loading.value = false
        }
    }

    const signOut = async () => {
        try {
            loading.value = true
            error.value = null

            const { error: signOutError } =
                await supabase.auth.signOut()

            if (signOutError) {
                throw signOutError
            }

            user.value = null
            session.value = null
        } catch (err) {
            console.error('Sign out error:', err)

            error.value = 'Не удалось выйти из аккаунта'
        } finally {
            loading.value = false
        }
    }

    return {
        user,
        session,
        loading,
        initialized,
        error,

        initialize,
        signUp,
        signIn,
        signOut,
    }
})