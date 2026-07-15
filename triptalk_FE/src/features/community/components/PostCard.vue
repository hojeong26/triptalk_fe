<template>
  <article class="post-card">
    <h3>{{ title }}</h3>
    <p class="meta">{{ author }} · {{ date }}</p>
    <p class="excerpt">{{ excerpt }}</p>
  </article>
</template>

<script setup>
const props = defineProps({
  title: String,
  author: String,
  date: String,
  excerpt: String
})
</script>

<style scoped>
.post-card { padding: 16px; border-radius: var(--radius); background: var(--surface); }
.meta { color: var(--muted); font-size: 13px }
</style>
