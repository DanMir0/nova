export const formatPhone = (value) => {
    let digits = value.replace(/\D/g, '')

    if (digits.startsWith('8')) {
        digits = '7' + digits.slice(1)
    }

    if (!digits.startsWith('7')) {
        return ''
    }

    digits = digits.slice(0, 11)

    let formatted = '+7'

    if (digits.length > 1) {
        formatted += ` (${digits.slice(1, 4)}`
    }

    if (digits.length >= 4) {
        formatted += ')'
    }

    if (digits.length > 4) {
        formatted += ` ${digits.slice(4, 7)}`
    }

    if (digits.length > 7) {
        formatted += `-${digits.slice(7, 9)}`
    }

    if (digits.length > 9) {
        formatted += `-${digits.slice(9, 11)}`
    }

    return formatted
}

export const normalizePhone = (value) => {
    const digits = value.replace(/\D/g, '')

    if (!digits) {
        return ''
    }

    if (digits.startsWith('8')) {
        return `+7${digits.slice(1)}`
    }

    if (digits.startsWith('7')) {
        return `+${digits}`
    }

    return `+${digits}`
}