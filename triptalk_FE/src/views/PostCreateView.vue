<template>
  <div>
    <h2>글쓰기</h2>
    <PostForm @submit="onSubmit" />
  </div>
</template>

<script setup>
import PostForm from '../features/community/PostForm.vue'
const onSubmit = () => { alert('submit') }
</script>
