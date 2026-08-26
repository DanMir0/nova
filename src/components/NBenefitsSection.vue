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
  <section class="mx-auto max-w-[1440px] px-6 pb-8 pt-4 lg:px-10">
    <div
        class="grid gap-8 rounded-xl bg-neutral-50 px-8 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-12">
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

