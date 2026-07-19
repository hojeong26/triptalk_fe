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
          <template v-if="message.role === 'assistant'">
            <div v-if="message.text && !message.places?.length" class="assistant-paragraph">{{ message.text }}</div>

            <div v-if="message.places?.length" class="assistant-card-list">
              <article
                v-for="(place, index) in message.places"
                :key="place.contentId || index"
                class="assistant-card"
              >
                <img
                  v-if="place.imageUrl"
                  :src="place.imageUrl"
                  :alt="place.title"
                  class="assistant-card-image"
                />
                <div v-else class="assistant-card-image placeholder">No Image</div>

                <div class="assistant-card-content">
                  <div class="assistant-card-title">{{ index + 1 }}. {{ place.title }}</div>
                  <div class="assistant-card-address">{{ place.address || '주소 정보 없음' }}</div>
                  <div v-if="place.tel" class="assistant-card-tel">{{ place.tel }}</div>
                </div>
              </article>
            </div>
          </template>
          <template v-else>
            {{ message.text }}
          </template>
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
import { apiClient } from '../../services/apiClient'

const emit = defineEmits(['close'])
const draft = ref('')
const isSending = ref(false)
const messages = ref([
  {
    id: 1,
    role: 'assistant',
    text: '안녕하세요! 여행지 추천이나 일정 관련해서 무엇이든 물어보세요.',
    places: []
  }
])

function normalizePlaces(rawPlaces) {
  if (!Array.isArray(rawPlaces)) return []

  return rawPlaces.map((place) => {
    const imageUrl = place?.firstimage || place?.firstimage2 || place?.image || ''
    const addr1 = place?.addr1 || ''
    const addr2 = place?.addr2 || ''

    return {
      contentId: place?.contentId || place?.contentid || '',
      title: place?.title || place?.name || '이름 없음',
      address: `${addr1} ${addr2}`.trim(),
      tel: place?.tel || '',
      imageUrl
    }
  })
}

function safeStringify(value) {
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

function extractChatReply(data) {
  if (typeof data === 'string') return data
  if (!data) return ''
  if (typeof data.answer === 'string' && data.answer.trim()) return data.answer
  if (typeof data.message === 'string' && data.message.trim()) return data.message
  if (typeof data.result === 'string' && data.result.trim()) return data.result
  if (typeof data.response === 'string' && data.response.trim()) return data.response
  if (typeof data.data === 'string' && data.data.trim()) return data.data
  const stringFields = ['answer', 'message', 'result', 'response', 'data']
    .map((key) => ({ key, value: data[key] }))
    .filter((entry) => typeof entry.value === 'string' && entry.value.trim())
  if (stringFields.length) return stringFields[0].value
  return safeStringify(data)
}

function extractChatPlaces(data) {
  if (!data || typeof data !== 'object') return []
  return normalizePlaces(data.places)
}

async function sendMessage() {
  const text = draft.value.trim()
  if (!text || isSending.value) return

  messages.value.push({
    id: Date.now(),
    role: 'user',
      text,
      places: []
  })

  draft.value = ''
  isSending.value = true

  try {
    const { data } = await apiClient.post('/api/chat', { question: text })
    console.log('[ChatPanel] chat response', data)

    const reply = extractChatReply(data)
      || '서버 응답을 받지 못했습니다.'
    const places = extractChatPlaces(data)

    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      text: reply,
      places
    })
  } catch (error) {
    console.error('[ChatPanel] chat error', error)
    const serverDetail =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.response?.statusText ||
      error?.message ||
      ''

    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      text: `챗봇 응답을 가져오는 중 오류가 발생했습니다.${serverDetail ? ' (' + serverDetail + ')' : ''}`,
      places: []
    })
  } finally {
    isSending.value = false
  }
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
  height: min(620px, calc(100vh - 120px));
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
  max-width: 94%;
}

.assistant-paragraph {
  margin-bottom: 12px;
}

.assistant-card-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.assistant-card {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: 12px;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #f8fafc;
}

.assistant-card-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.assistant-card-title {
  font-weight: 700;
  color: #0f172a;
  line-height: 1.35;
}

.assistant-card-address {
  color: #475569;
  font-size: 0.86rem;
  line-height: 1.35;
  word-break: keep-all;
}

.assistant-card-tel {
  color: #2563eb;
  font-size: 0.83rem;
  font-weight: 600;
}

.assistant-card-image {
  width: 92px;
  height: 92px;
  object-fit: cover;
  border-radius: 10px;
  background: #e2e8f0;
}

.assistant-card-image.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 0.8rem;
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