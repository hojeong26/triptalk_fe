<template>
  <div class="chat-overlay">
    <div class="chat-panel">
      <div class="chat-header">
        <div class="chat-title-wrap">
          <div class="chat-avatar">🤖</div>
          <div>
            <strong>TripTalk 챗봇</strong>
            <p>여행을 도와드릴게요</p>
          </div>
        </div>
        <button class="close-button" @click="$emit('close')" aria-label="닫기">✕</button>
      </div>

      <div class="chat-body">
        <div v-for="message in messages" :key="message.id" :class="['bubble', message.role]">
          {{ message.text }}
        </div>
      </div>

      <form class="chat-footer" @submit.prevent="sendMessage">
        <input v-model="draft" type="text" placeholder="메시지를 입력하세요" />
        <button type="submit">전송</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close'])
const draft = ref('')
const messages = ref([
  {
    id: 1,
    role: 'assistant',
    text: '안녕하세요! 여행지 추천이나 일정 관련해서 무엇이든 물어보세요.'
  }
])

function sendMessage() {
  const text = draft.value.trim()
  if (!text) return

  messages.value.push({
    id: Date.now(),
    role: 'user',
    text
  })

  draft.value = ''

  setTimeout(() => {
    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      text: '좋아요! 잠시 후 더 자연스럽게 연결해드릴게요.'
    })
  }, 400)
}
</script>

<style scoped>
.chat-overlay {
  position: fixed;
  right: 24px;
  bottom: 96px;
  z-index: 2001;
}

.chat-panel {
  width: min(360px, calc(100vw - 32px));
  height: min(520px, calc(100vh - 120px));
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 18px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #2563eb, #7a92f6);
  color: white;
}

.chat-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chat-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.2);
  font-size: 1.1rem;
}

.chat-title-wrap strong {
  display: block;
  font-size: 0.98rem;
}

.chat-title-wrap p {
  margin: 2px 0 0;
  font-size: 0.8rem;
  opacity: 0.9;
}

.close-button {
  border: none;
  background: transparent;
  color: white;
  font-size: 1rem;
  cursor: pointer;
}

.chat-body {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  background: #f8fafc;
}

.bubble {
  max-width: 85%;
  padding: 10px 12px;
  border-radius: 16px;
  font-size: 0.92rem;
  line-height: 1.5;
  word-break: keep-all;
}

.bubble.assistant {
  align-self: flex-start;
  background: white;
  color: #0f172a;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
}

.bubble.user {
  align-self: flex-end;
  background: #2563eb;
  color: white;
}

.chat-footer {
  display: flex;
  gap: 8px;
  padding: 12px 14px;
  border-top: 1px solid #e2e8f0;
  background: white;
}

.chat-footer input {
  flex: 1;
  border: 1px solid #dbeafe;
  border-radius: 999px;
  padding: 10px 12px;
  outline: none;
}

.chat-footer button {
  border: none;
  border-radius: 999px;
  padding: 10px 14px;
  background: #2563eb;
  color: white;
  cursor: pointer;
}
</style>
