<template>
  <button class="btn" :class="variant"><slot /></button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' }
})
</script>

<style scoped>
.btn { padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer }
.btn.primary { background: var(--primary); color: white }
.btn.ghost { background: transparent; border: 1px solid #e6eef6 }
</style>
