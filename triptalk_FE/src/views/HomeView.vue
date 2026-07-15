<template>
  <div>
    <h2>어디로 떠나볼까요?</h2>
    <div class="categories">
      <div class="category" v-for="c in categories" :key="c.id">{{ c.title }}</div>
    </div>
  </div>
</template>

<script setup>
const categories = [
  { id: 'food', title: '맛집' },
  { id: 'sight', title: '관광지' },
  { id: 'cafe', title: '카페' },
  { id: 'stay', title: '숙소' }
]
</script>

<style scoped>
.categories { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px }
.category { padding: 24px; background: var(--surface); border-radius: var(--radius); text-align: center }
</style>
