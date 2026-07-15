<template>
  <button class="floating-chat" @click="$emit('toggle')">💬</button>
</template>

<script setup>
</script>

<style scoped>
.floating-chat {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  border: none;
  box-shadow: 0 6px 18px rgba(59,130,246,0.18);
}
</style>
