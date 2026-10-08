<script setup>
import {
  Truck,
  RefreshCw,
  ShieldCheck,
  BadgeCheck,
} from 'lucide-vue-next'

import NBenefitItem from './NBenefitItem.vue'
</script>
<template>
  <section class="mx-auto max-w-[1440px] px-4 pb-6 pt-3 sm:px-6 sm:pb-8 sm:pt-4 lg:px-10">
    <div
        class="grid gap-6 rounded-xl bg-neutral-50 px-5 py-7 sm:grid-cols-2 sm:gap-8 sm:px-8 sm:py-9 lg:grid-cols-4
        lg:px-12 lg:py-10">
      <NBenefitItem
          :icon="Truck"
          title="Быстрая доставка"
          description="Доставим ваш заказ от 1 до 3 дней"
      />

      <NBenefitItem
          :icon="RefreshCw"
          title="Лёгкий возврат"
          description="Возврат товара в течение 14 дней"
      />

      <NBenefitItem
          :icon="ShieldCheck"
          title="Безопасная оплата"
          description="Оплата заказов любым удобным способом"
      />

      <NBenefitItem
          :icon="BadgeCheck"
          title="Премиум качество"
          description="Мы работаем только с лучшими материалами"
      />
    </div>
  </section>
</template>

