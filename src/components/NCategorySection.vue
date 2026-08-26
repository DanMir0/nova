<script setup>
import NCategoryCard from './NCategoryCard.vue'
import ManImg from '/images/categorySection/man.png'
import WomenImg from '/images/categorySection/women.png'
</script>

<template>
  <section class="mx-auto max-w-[1440px] px-6 py-3 lg:px-10">
    <div class="grid gap-4 md:grid-cols-2">
      <NCategoryCard
          title="Женщинам"
          link="/shop?gender=women"
          image-class="from-[#d8d0c9] via-[#eee9e4] to-[#c9c0b8]"
          :image="WomenImg"/>

      <NCategoryCard
          title="Мужчинам"
          link="/shop?gender=men"
          image-class="from-[#b9b7b4] via-[#d0ceca] to-[#aaa7a3]"
          :image="ManImg"/>
    </div>
  </section>
</template>
