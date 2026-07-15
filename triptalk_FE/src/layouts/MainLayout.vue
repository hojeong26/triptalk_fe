<template>
  <div>
    <slot name="header" />
    <main class="container">
      <slot />
    </main>
    <slot name="footer" />
  </div>
</template>

<script setup>
</script>

<style scoped>
.container {
  padding-top: 24px;
  padding-bottom: 48px;
}
</style>
