import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'nova-addresses'

const defaultAddresses = [
    {
        id: crypto.randomUUID(),
        title: 'Дом',
        city: 'Москва',
        address: 'ул. Петровка, 17, кв. 5',
        recipient: 'Анастасия',
        phone: '+7 999 123-45-67',
        isDefault: true,
    },
]

const loadAddresses = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)

        if (!saved) {
            return defaultAddresses
        }

        const parsed = JSON.parse(saved)

        return Array.isArray(parsed)
            ? parsed
            : defaultAddresses

    } catch (error) {
        console.error(
            'Load addresses error:',
            error
        )

        return defaultAddresses
    }
}

export const useAddressesStore = defineStore('addresses', () => {

    const addresses = ref(loadAddresses())

    const selectedAddressId = ref(
        addresses.value.find(
            address => address.isDefault
        )?.id || addresses.value[0]?.id || null
    )


    const selectedAddress = computed(() => {
        return addresses.value.find(
            address => address.id === selectedAddressId.value
        ) || null
    })


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
            addresses.value.forEach(address => {
                address.isDefault = false
            })
        }

        addresses.value.push(newAddress)

        selectedAddressId.value = newAddress.id
    }


    const updateAddress = (addressId, data) => {

        const address = addresses.value.find(
            item => item.id === addressId
        )

        if (!address) {
            return
        }

        Object.assign(address, data)
    }


    const removeAddress = (addressId) => {

        const index = addresses.value.findIndex(
            address => address.id === addressId
        )

        if (index === -1) {
            return
        }

        addresses.value.splice(index, 1)

        if (selectedAddressId.value === addressId) {
            selectedAddressId.value =
                addresses.value[0]?.id || null
        }
    }


    const setDefaultAddress = (addressId) => {

        addresses.value.forEach(address => {
            address.isDefault = address.id === addressId
        })

        selectedAddressId.value = addressId
    }


    watch(
        addresses,
        (newAddresses) => {

            try {
                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(newAddresses)
                )
            } catch (error) {
                console.error(
                    'Save addresses error:',
                    error
                )
            }
        },
        {
            deep: true,
        }
    )


    return {
        addresses,
        selectedAddressId,
        selectedAddress,

        selectAddress,
        addAddress,
        updateAddress,
        removeAddress,
        setDefaultAddress,
    }
})