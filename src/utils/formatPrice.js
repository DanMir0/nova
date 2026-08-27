export function formatPrice(price) {
    if (price === null || price === undefined) {
        return ''
    }

    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽'
}