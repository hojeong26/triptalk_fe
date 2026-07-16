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
            <template v-for="(block, index) in parseMessage(message.text)" :key="index">
              <div v-if="block.type === 'paragraph'" class="assistant-paragraph">{{ block.text }}</div>

              <div v-else-if="block.type === 'list'" class="assistant-list">
                <div v-for="item in block.items" :key="item.number" class="assistant-list-item">
                  <div class="assistant-list-item-text">
                    <div class="assistant-list-item-title">{{ item.number }}. {{ item.name }}</div>
                    <div class="assistant-list-item-address">{{ item.address }}</div>
                  </div>
                  <img v-if="item.imageUrl" :src="item.imageUrl" alt="이미지" class="assistant-list-item-image" />
                </div>
              </div>
            </template>
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
    text: '안녕하세요! 여행지 추천이나 일정 관련해서 무엇이든 물어보세요.'
  }
])

function parseMessage(rawText) {
  const lines = rawText.split(/\r?\n/)
  const blocks = []
  let currentList = null

  const listItemRegex = /^\s(\d+).\s(.+?)\s-\s(.+?)\s(?:![이미지]((https?:\/\/[^)]+)))?\s$/
  const imageOnlyRegex = /^![이미지]((https?:\/\/[^)]+))$/

  for (const line of lines) {
    if (!line.trim()) {
      if (currentList) {
        blocks.push(currentList)
        currentList = null
      }
      continue
    }

    const listMatch = line.match(listItemRegex)
    if (listMatch) {
      const number = listMatch[1]
      const name = listMatch[2].trim()
      const address = listMatch[3].trim()
      const imageUrl = listMatch[4] ? listMatch[4].trim() : ''

      if (!currentList) {
        currentList = {
          type: 'list',
          items: []
        }
      }

      currentList.items.push({ number, name, address, imageUrl })
      continue
    }

    const imageMatch = line.match(imageOnlyRegex)
    if (imageMatch && currentList?.items?.length) {
      currentList.items[currentList.items.length - 1].imageUrl = imageMatch[1].trim()
      continue
    }

    if (currentList) {
      blocks.push(currentList)
      currentList = null
    }

    blocks.push({ type: 'paragraph', text: line.trim() })
  }

  if (currentList) {
    blocks.push(currentList)
  }

  return blocks
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

async function sendMessage() {
  const text = draft.value.trim()
  if (!text || isSending.value) return

  messages.value.push({
    id: Date.now(),
    role: 'user',
    text
  })

  draft.value = ''
  isSending.value = true

  try {
    const { data } = await apiClient.post('/api/chat', { question: text })
    console.log('[ChatPanel] chat response', data)

    const reply = extractChatReply(data)
      || '서버 응답을 받지 못했습니다.'

    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      text: reply
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
      text: `챗봇 응답을 가져오는 중 오류가 발생했습니다.${serverDetail ? ' (' + serverDetail + ')' : ''}`
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
}

.assistant-paragraph {
  margin-bottom: 12px;
}

.assistant-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.assistant-list-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f8fafc;
}

.assistant-list-item-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.assistant-list-item-title {
  font-weight: 700;
  color: #0f172a;
}

.assistant-list-item-address {
  color: #475569;
  font-size: 0.9rem;
}

.assistant-list-item-image {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 12px;
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