<template>
  <button class="floating-chat" @click="$emit('toggle')" aria-label="챗봇 열기">
    <FontAwesomeIcon :icon="byPrefixAndName.far['comment-dots']" />
  </button>
</template>

<script setup>
const byPrefixAndName = {
  far: {
    'comment-dots': ['far', 'comment-dots']
  }
}
</script>

<style scoped>
.floating-chat {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  border: none;
  box-shadow: 0 10px 24px rgba(122, 146, 246, 0.35);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2000;
}

.floating-chat :deep(svg) {
  width: 24px;
  height: 24px;
}
</style>
