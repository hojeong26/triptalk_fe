<template>
  <form @submit.prevent="$emit('submit')">
    <label>제목</label>
    <input v-model="title" />
    <label>본문</label>
    <textarea v-model="body" />
    <button type="submit">작성하기</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
const title = ref('')
const body = ref('')
</script>

<style scoped>
input, textarea { width: 100%; padding: 8px; margin-bottom: 8px }
</style>
