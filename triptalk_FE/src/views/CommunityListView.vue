<template>
  <div>
    <h2>게시판</h2>
    <div class="list">
      <PostCard v-for="n in 5" :key="n" :title="`샘플 글 ${n}`" author="익명" date="오늘" excerpt="간단한 내용..." />
    </div>
  </div>
</template>

<script setup>
import PostCard from '../features/community/components/PostCard.vue'
</script>
