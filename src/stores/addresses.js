import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

const addressesKey = (owner) => `nova-addresses:${owner}`

const loadFromStorage = (key) => {
    try {
        const saved = localStorage.getItem(key)
        if (!saved) return { addresses: [], selectedAddressId: null }

        const parsed = JSON.parse(saved)

        return {
            addresses: Array.isArray(parsed.addresses) ? parsed.addresses : [],
            selectedAddressId: parsed.selectedAddressId || null,
        }
    } catch (error) {
        console.error('Ошибка загрузки адресов:', error)
        return { addresses: [], selectedAddressId: null }
    }
}

export const useAddressesStore = defineStore('addresses', () => {
    const ownerId = ref(null)
    const switchingOwner = ref(false)
    const addresses = ref([])
    const selectedAddressId = ref(null)

    const selectedAddress = computed(() =>
        addresses.value.find(
            (address) => address.id === selectedAddressId.value,
        ) || null,
    )

    const setOwner = (userId, { clearGuest = false } = {}) => {
        const currentOwner = ownerId.value || 'guest'

        // Сохраняем адреса и выбранный адрес текущего владельца
        try {
            localStorage.setItem(
                addressesKey(currentOwner),
                JSON.stringify({
                    addresses: addresses.value,
                    selectedAddressId: selectedAddressId.value,
                }),
            )
        } catch (error) {
            console.error('Ошибка сохранения адресов:', error)
        }

        switchingOwner.value = true

        if (clearGuest) {
            localStorage.removeItem(addressesKey('guest'))
        }

        ownerId.value = userId || null

        const nextOwner = ownerId.value || 'guest'
        const saved = loadFromStorage(addressesKey(nextOwner))

        addresses.value = saved.addresses
        selectedAddressId.value = saved.selectedAddressId

        // Если выбранного адреса больше нет, выбираем основной или первый
        if (!addresses.value.some((address) => address.id === selectedAddressId.value)) {
            selectedAddressId.value =
                addresses.value.find((address) => address.isDefault)?.id ||
                addresses.value[0]?.id ||
                null
        }

        switchingOwner.value = false
    }

    const selectAddress = (addressId) => {
        selectedAddressId.value = addressId
    }

    const addAddress = (address) => {
        const newAddress = {
            id: crypto.randomUUID(),
            title: address.title,
            city: address.city,
            address: address.address,
            recipient: address.recipient,
            phone: address.phone,
            isDefault: addresses.value.length === 0,
        }

        if (newAddress.isDefault) {
            addresses.value.forEach((item) => {
                item.isDefault = false
            })
        }

        addresses.value.push(newAddress)
        selectedAddressId.value = newAddress.id
    }

    const updateAddress = (addressId, data) => {
        const address = addresses.value.find((item) => item.id === addressId)
        if (!address) return

        Object.assign(address, data)
    }

    const removeAddress = (addressId) => {
        const index = addresses.value.findIndex(
            (address) => address.id === addressId,
        )

        if (index === -1) return

        addresses.value.splice(index, 1)

        if (selectedAddressId.value === addressId) {
            selectedAddressId.value =
                addresses.value.find((address) => address.isDefault)?.id ||
                addresses.value[0]?.id ||
                null
        }
    }

    const setDefaultAddress = (addressId) => {
        addresses.value.forEach((address) => {
            address.isDefault = address.id === addressId
        })

        selectedAddressId.value = addressId
    }

    watch(
        [addresses, selectedAddressId],
        () => {
            if (switchingOwner.value) return

            const owner = ownerId.value || 'guest'

            try {
                localStorage.setItem(
                    addressesKey(owner),
                    JSON.stringify({
                        addresses: addresses.value,
                        selectedAddressId: selectedAddressId.value,
                    }),
                )
            } catch (error) {
                console.error('Ошибка сохранения адресов:', error)
            }
        },
        { deep: true },
    )

    return {
        addresses,
        selectedAddressId,
        selectedAddress,
        setOwner,
        selectAddress,
        addAddress,
        updateAddress,
        removeAddress,
        setDefaultAddress,
    }
})