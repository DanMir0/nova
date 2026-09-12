export const validateAddressTitle = (value) => {
    const text = value.trim()

    if (!text) {
        return 'Введите название адреса'
    }

    if (text.length < 2) {
        return 'Минимум 2 символа'
    }

    if (text.length > 30) {
        return 'Максимум 30 символов'
    }

    return ''
}


export const validateCity = (value) => {
    const text = value.trim()

    if (!text) {
        return 'Введите город'
    }

    if (text.length < 2) {
        return 'Введите корректное название города'
    }

    if (!/^[а-яёa-z\s-]+$/i.test(text)) {
        return 'Используйте только буквы, пробелы и дефис'
    }

    return ''
}


export const validateAddress = (value) => {
    const text = value.trim()

    if (!text) {
        return 'Введите адрес'
    }

    if (text.length < 5) {
        return 'Введите полный адрес'
    }

    if (text.length > 100) {
        return 'Максимум 100 символов'
    }

    if (!/[а-яёa-z]/i.test(text) || !/\d/.test(text)) {
        return 'Укажите улицу и номер дома'
    }

    return ''
}


export const validateRecipient = (value) => {
    const text = value.trim()

    if (!text) {
        return 'Введите имя получателя'
    }

    if (text.length < 3) {
        return 'Введите имя и фамилию'
    }

    if (!/^[а-яёa-z\s-]+$/i.test(text)) {
        return 'Имя может содержать только буквы'
    }

    const words = text.split(/\s+/)

    if (words.length < 2) {
        return 'Укажите имя и фамилию'
    }

    return ''
}


export const validatePhone = (value) => {
    const text = value.trim()

    if (!text) {
        return 'Введите номер телефона'
    }

    const digits = text.replace(/\D/g, '')

    if (digits.length !== 11) {
        return 'Введите корректный номер телефона'
    }

    if (!digits.startsWith('7') && !digits.startsWith('8')) {
        return 'Номер должен начинаться с +7 или 8'
    }

    return ''
}

