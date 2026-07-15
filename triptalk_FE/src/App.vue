<script setup>
import { ref } from 'vue'
import Header from './components/common/Header.vue'
import Footer from './components/common/Footer.vue'
import FloatingChatButton from './components/common/FloatingChatButton.vue'
import ChatPanel from './features/chat/ChatPanel.vue'

const isChatOpen = ref(false)

function toggleChat() {
  isChatOpen.value = !isChatOpen.value
}
</script>

<template>
  <Header />
  <router-view />
  <Footer />
  <FloatingChatButton @toggle="toggleChat" />
  <ChatPanel v-if="isChatOpen" @close="isChatOpen = false" />
</template>

<style>
/* global app-level styles can go here */
body { font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial }
</style>
