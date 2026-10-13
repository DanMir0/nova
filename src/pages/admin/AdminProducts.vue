<script setup>
import { ref, onMounted } from 'vue'
import {
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/adminProducts.js'
import { uploadProductImage } from '../../services/productImages.js'

const products = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const success = ref('')

const showForm = ref(false)
const editingId = ref(null)

const selectedImage = ref(null)
const imagePreview = ref('')
const uploadingImage = ref(false)

const handleImageChange = (event) => {
  const file = event.target.files?.[0] ?? null

  selectedImage.value = file
  imagePreview.value = file ? URL.createObjectURL(file) : ''
}

const emptyForm = () => ({
  name: '',
  slug: '',
  description: '',
  price: '',
  old_price: '',
  category: 'clothing',
  gender: 'women',
  collection: '',
  sizes: 'S, M, L',
  colors: 'black, white',
  image_url: '',
  is_new: false,
  is_sale: false,
  is_active: true,
})

const form = ref(emptyForm())

const fetchProducts = async () => {
  loading.value = true
  error.value = ''

  try {
    products.value = await getAdminProducts()
  } catch (err) {
    console.error(err)
    error.value = 'Не удалось загрузить товары. Проверь права доступа в Supabase.'
  } finally {
    loading.value = false
  }
}

const openCreateForm = () => {
  selectedImage.value = null
  imagePreview.value = ''
  editingId.value = null
  form.value = emptyForm()
  showForm.value = true
  error.value = ''
  success.value = ''
}

const openEditForm = (product) => {
  selectedImage.value = null
  imagePreview.value = ''
  editingId.value = product.id

  form.value = {
    name: product.name ?? '',
    slug: product.slug ?? '',
    description: product.description ?? '',
    price: product.price ?? '',
    old_price: product.old_price ?? '',
    category: product.category ?? 'clothing',
    gender: product.gender ?? 'women',
    collection: product.collection ?? '',
    sizes: Array.isArray(product.sizes)
        ? product.sizes.join(', ')
        : '',
    colors: Array.isArray(product.colors)
        ? product.colors.join(', ')
        : '',
    image_url: product.image_url ?? '',
    is_new: Boolean(product.is_new),
    is_sale: Boolean(product.is_sale),
    is_active: Boolean(product.is_active),
  }

  showForm.value = true
  error.value = ''
  success.value = ''
}

const makeSlug = (value) => {
  return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-zа-яё0-9-]/gi, '')
      .replace(/-+/g, '-')
}

const splitList = (value) => {
  return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
}

const saveProduct = async () => {
  error.value = ''
  success.value = ''

  if (!form.value.name.trim()) {
    error.value = 'Укажи название товара.'
    return
  }

  if (
      form.value.price === '' ||
      !Number.isFinite(Number(form.value.price)) ||
      Number(form.value.price) < 0
  ) {
    error.value = 'Укажи корректную цену.'
    return
  }

  const slug = form.value.slug.trim() || makeSlug(form.value.name)

  if (!slug) {
    error.value = 'Не удалось сформировать slug. Укажи его вручную.'
    return
  }

  if (selectedImage.value) {
    try {
      uploadingImage.value = true

      form.value.image_url = await uploadProductImage(
          selectedImage.value
      )
    } catch (err) {
      console.error('Image upload error:', err)
      error.value = err.message || 'Не удалось загрузить фотографию.'
      return
    } finally {
      uploadingImage.value = false
    }
  }

  const payload = {
    name: form.value.name.trim(),
    slug,
    description: form.value.description.trim() || null,
    price: Number(form.value.price),
    old_price: form.value.old_price === ''
        ? null
        : Number(form.value.old_price),
    category: form.value.category.trim() || null,
    gender: form.value.gender,
    collection: form.value.collection.trim() || null,
    sizes: splitList(form.value.sizes),
    colors: splitList(form.value.colors),
    image_url: form.value.image_url.trim() || null,
    is_new: form.value.is_new,
    is_sale: form.value.is_sale,
    is_active: form.value.is_active,
  }

  if (
      payload.old_price !== null &&
      (!Number.isFinite(payload.old_price) || payload.old_price < 0)
  ) {
    error.value = 'Старая цена указана некорректно.'
    return
  }

  try {
    saving.value = true

    if (editingId.value) {
      await updateProduct(editingId.value, payload)
      success.value = 'Товар успешно обновлён.'
    } else {
      await createProduct(payload)
      success.value = 'Товар успешно добавлен.'
    }

    showForm.value = false
    await fetchProducts()
  } catch (err) {
    console.error('Product save error:', err)
    error.value = err.message || 'Не удалось сохранить товар.'
  } finally {
    saving.value = false
  }
}

const removeProduct = async (product) => {
  const confirmed = window.confirm(
      `Удалить товар «${product.name}»? Это действие нельзя отменить.`
  )

  if (!confirmed) return

  error.value = ''
  success.value = ''

  try {
    await deleteProduct(product.id)
    products.value = products.value.filter(
        (item) => item.id !== product.id
    )
    success.value = 'Товар удалён.'
  } catch (err) {
    console.error('Product delete error:', err)
    error.value = err.message || 'Не удалось удалить товар.'
  }
}

onMounted(fetchProducts)
</script>

<template>
  <main class="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
    <div class="mx-auto max-w-7xl">
      <RouterLink to="/admin" class="text-sm text-gray-500 hover:text-gray-900">
        ← Панель управления
      </RouterLink>

      <div class="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-semibold text-gray-900">
            Товары
          </h1>
          <p class="mt-2 text-sm text-gray-500">
            Всего: {{ products.length }}
          </p>
        </div>

        <button
            type="button"
            @click="openCreateForm"
            class="rounded-lg bg-gray-900 px-5 py-3 text-sm text-white hover:bg-gray-700">
          + Добавить товар
        </button>
      </div>

      <p v-if="error" class="mt-5 text-sm text-red-600">
        {{ error }}
      </p>

      <p v-if="success" class="mt-3 text-sm text-green-700">
        {{ success }}
      </p>

      <p v-if="loading" class="py-10 text-gray-500">
        Загружаем товары…
      </p>

      <div
          v-else
          class="mt-8 overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table class="w-full min-w-[800px] text-left text-sm">
          <thead class="border-b bg-gray-50 text-gray-500">
          <tr>
            <th class="px-5 py-4 font-medium">Товар</th>
            <th class="px-5 py-4 font-medium">Категория</th>
            <th class="px-5 py-4 font-medium">Цена</th>
            <th class="px-5 py-4 font-medium">Статус</th>
            <th class="px-5 py-4 font-medium">Действия</th>
          </tr>
          </thead>

          <tbody>
          <tr
              v-for="product in products"
              :key="product.id"
              class="border-b last:border-b-0">
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <img
                    v-if="product.image_url"
                    :src="product.image_url"
                    :alt="product.name"
                    class="h-14 w-12 rounded object-cover"/>
                <div>
                  <p class="font-medium text-gray-900">
                    {{ product.name }}
                  </p>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ product.slug }}
                  </p>
                </div>
              </div>
            </td>

            <td class="px-5 py-4 text-gray-600">
              {{ product.category || '—' }}
            </td>

            <td class="whitespace-nowrap px-5 py-4">
              {{ Number(product.price).toLocaleString('ru-RU') }} ₽
            </td>

            <td class="px-5 py-4">
              {{ product.is_active ? 'Активен' : 'Скрыт' }}
            </td>

            <td class="px-5 py-4">
              <div class="flex gap-3">
                <button
                    type="button"
                    @click="openEditForm(product)"
                    class="underline underline-offset-4">
                  Изменить
                </button>

                <button
                    type="button"
                    @click="removeProduct(product)"
                    class="text-red-600 underline underline-offset-4">
                  Удалить
                </button>
              </div>
            </td>
          </tr>

          <tr v-if="products.length === 0">
            <td colspan="5" class="px-5 py-10 text-center text-gray-500">
              Товары не найдены.
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div
          v-if="showForm"
          class="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4"
          @click.self="showForm = false">
        <section class="mx-auto my-6 max-w-2xl rounded-xl bg-white p-6 sm:p-8">
          <div class="mb-6 flex items-center justify-between gap-4">
            <h2 class="text-xl font-semibold">
              {{ editingId ? 'Редактировать товар' : 'Новый товар' }}
            </h2>

            <button
                type="button"
                @click="showForm = false"
                class="text-2xl text-gray-500"
                aria-label="Закрыть">
              ×
            </button>
          </div>

          <form class="space-y-5" @submit.prevent="saveProduct">
            <div>
              <label class="mb-1 block text-sm">Название *</label>
              <input
                  v-model="form.name"
                  required
                  class="w-full rounded-lg border p-3"
                  placeholder="Например, Футболка хлопковая"/>
            </div>

            <div>
              <label class="mb-1 block text-sm">Slug</label>
              <input
                  v-model="form.slug"
                  class="w-full rounded-lg border p-3"
                  placeholder="futbolka-hlopkovaya"/>
              <p class="mt-1 text-xs text-gray-500">
                Используется в адресе товара. Лучше латиницей.
              </p>
            </div>

            <div>
              <label class="mb-1 block text-sm">Описание</label>
              <textarea
                  v-model="form.description"
                  rows="3"
                  class="w-full rounded-lg border p-3"/>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1 block text-sm">Цена, ₽ *</label>
                <input
                    v-model="form.price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    class="w-full rounded-lg border p-3"/>
              </div>

              <div>
                <label class="mb-1 block text-sm">Старая цена, ₽</label>
                <input
                    v-model="form.old_price"
                    type="number"
                    min="0"
                    step="0.01"
                    class="w-full rounded-lg border p-3"/>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="mb-1 block text-sm">Категория</label>
                <input
                    v-model="form.category"
                    class="w-full rounded-lg border p-3"
                    placeholder="pants, shirts..."/>
              </div>

              <div>
                <label class="mb-1 block text-sm">Пол</label>
                <select
                    v-model="form.gender"
                    class="w-full rounded-lg border p-3">
                  <option value="women">Женский</option>
                  <option value="men">Мужской</option>
                  <option value="unisex">Унисекс</option>
                </select>
              </div>
            </div>

            <div>
              <label class="mb-1 block text-sm">Коллекция</label>
              <input
                  v-model="form.collection"
                  class="w-full rounded-lg border p-3"
                  placeholder="Название коллекции"/>
            </div>

            <div>
              <label class="mb-1 block text-sm">Размеры через запятую</label>
              <input
                  v-model="form.sizes"
                  class="w-full rounded-lg border p-3"
                  placeholder="S, M, L, XL"/>
            </div>

            <div>
              <label class="mb-1 block text-sm">Цвета через запятую</label>
              <input
                  v-model="form.colors"
                  class="w-full rounded-lg border p-3"
                  placeholder="black, white, brown"/>
            </div>

            <div>
              <label class="mb-2 block text-sm">
                Главная фотография товара
              </label>

              <input
                  type="file"
                  accept="image/*"
                  @change="handleImageChange"
                  class="w-full rounded-lg border p-3"/>

              <img
                  v-if="imagePreview || form.image_url"
                  :src="imagePreview || form.image_url"
                  alt="Предпросмотр товара"
                  class="mt-4 h-40 w-32 rounded-lg border object-cover"/>

              <p class="mt-2 text-xs text-gray-500">
                Форматы изображений, до 5 МБ.
              </p>
            </div>

            <div class="space-y-3">
              <label class="flex items-center gap-3 text-sm">
                <input v-model="form.is_new" type="checkbox" />
                Новинка
              </label>

              <label class="flex items-center gap-3 text-sm">
                <input v-model="form.is_sale" type="checkbox" />
                Распродажа
              </label>

              <label class="flex items-center gap-3 text-sm">
                <input v-model="form.is_active" type="checkbox" />
                Показывать в магазине
              </label>
            </div>

            <p v-if="error" class="text-sm text-red-600">
              {{ error }}
            </p>

            <div class="flex flex-wrap justify-end gap-3 pt-3">
              <button
                  type="button"
                  @click="showForm = false"
                  class="rounded-lg border px-5 py-3">
                Отмена
              </button>

              <button
                  type="submit"
                  :disabled="saving || uploadingImage"
                  class="rounded-lg bg-gray-900 px-5 py-3 text-white disabled:opacity-50">
                {{ uploadingImage ? 'Загружаем фото…' : saving ? 'Сохраняем…' : 'Сохранить товар' }}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  </main>
</template>
