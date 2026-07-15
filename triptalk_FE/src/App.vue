<script setup>
import Header from './components/common/Header.vue'
import Footer from './components/common/Footer.vue'
import FloatingChatButton from './components/common/FloatingChatButton.vue'
</script>

<template>
  <Header />
  <router-view />
  <Footer />
  <FloatingChatButton />
</template>

<style>
/* global app-level styles can go here */
body { font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial }
</style>
