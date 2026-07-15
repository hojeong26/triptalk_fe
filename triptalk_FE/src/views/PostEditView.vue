<template>
  <section class="post-edit-page">
    <header class="page-header">
      <h1 class="font-800">게시글 수정</h1>
      <p class="subtitle font-300">기존 내용을 수정해 주세요.</p>
    </header>

    <form class="form-card font-500" @submit.prevent="handleSubmit">
      <div v-if="isLoading" class="status">게시글 정보를 불러오는 중입니다...</div>
      <div v-else-if="errorMessage" class="status error">{{ errorMessage }}</div>

      <label class="field title-field">
        <div class="field-label">제목</div>
        <input v-model="title" maxlength="100" placeholder="제목을 입력해주세요." class="font-300" />
        <div class="char-count">{{ title.length }} / 100</div>
      </label>

      <label class="field body-field">
        <div class="field-label">본문</div>
        <textarea class="font-300" v-model="body" rows="10" maxlength="3000" placeholder="수정할 내용을 입력해주세요."></textarea>
        <div class="char-count">{{ body.length }} / 3000</div>
      </label>

      <div class="actions">
        <button type="button" class="btn danger font-400" @click="handleDelete" :disabled="isSubmitting || isDeleting || isLoading">{{ isDeleting ? '삭제 중...' : '삭제하기' }}</button>
        <div class="right-actions">
          <button type="button" class="btn cancel font-400" @click="onCancel" :disabled="isSubmitting || isDeleting">취소</button>
          <button type="submit" class="btn primary font-400" :disabled="isSubmitting || isDeleting || isLoading">{{ isSubmitting ? '수정 중...' : '수정하기' }}</button>
        </div>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiClient } from '../services/apiClient'

const route = useRoute()
const router = useRouter()

const title = ref('')
const body = ref('')
const contentTypeId = ref(undefined)
const isLoading = ref(false)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const errorMessage = ref('')

function normalizePostDetail(data) {
  return {
    postId: Number(data?.postId || 0),
    contentTypeId: Number(data?.contentTypeId || 0),
    title: data?.title || '',
    content: data?.content || ''
  }
}

async function fetchPostDetail() {
  const postId = Number(route.params.id)
  if (Number.isNaN(postId)) {
    errorMessage.value = '잘못된 게시글 ID입니다.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  try {
    const { data } = await apiClient.get(`/posts/${postId}`)
    const normalized = normalizePostDetail(data)
    title.value = normalized.title
    body.value = normalized.content
    contentTypeId.value = normalized.contentTypeId || undefined
  } catch (err) {
    console.error(err)
    errorMessage.value = '게시글 정보를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchPostDetail()
})

function onCancel() {
  router.push({ name: 'PostDetail', params: { id: route.params.id } })
}

async function handleDelete() {
  const shouldDelete = confirm('정말 삭제하시겠습니까?')
  if (!shouldDelete) return

  isDeleting.value = true
  try {
    const postId = Number(route.params.id)
    const { data } = await apiClient.delete(`/posts/${postId}`)
    alert(data?.message || '게시글 삭제 성공')
    router.push({ name: 'Community', query: { contentTypeId: contentTypeId.value } })
  } catch (err) {
    console.error(err)
    alert('게시글 삭제에 실패했습니다.')
  } finally {
    isDeleting.value = false
  }
}

async function handleSubmit() {
  if (!title.value.trim()) {
    alert('제목을 입력해 주세요.')
    return
  }
  if (!body.value.trim()) {
    alert('본문을 입력해 주세요.')
    return
  }

  isSubmitting.value = true
  try {
    const postId = Number(route.params.id)
    const { data } = await apiClient.put(`/posts/${postId}`, {
      title: title.value.trim(),
      content: body.value.trim()
    })

    alert(data?.message || '게시글 수정 성공')
    router.push({ name: 'PostDetail', params: { id: route.params.id }, query: { contentTypeId: contentTypeId.value } })
  } catch (err) {
    console.error(err)
    alert('게시글 수정에 실패했습니다.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.post-edit-page {
  width: 100%;
  margin: 0 auto;
  padding: 40px 16px;
}

.page-header {
  text-align: center;
  margin: 40px 0 24px;
}

.page-header h1 {
  font-size: 28px;
  margin: 0;
  color: #072b57;
}

.page-header .subtitle {
  margin-top: 8px;
  color: #64748b;
}

.form-card {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: block;
  position: relative;
}

.field-label {
  margin-bottom: 8px;
  color: #475569;
}

.field input,
.field textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e6eef6;
  border-radius: 8px;
  font-size: 14px;
  resize: none;
}

.body-field {
  display: flex;
  flex-direction: column;
}

.body-field textarea {
  min-height: 220px;
}

.char-count {
  position: absolute;
  right: 12px;
  bottom: 8px;
  font-size: 12px;
  color: #94a3b8;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.right-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.btn.cancel {
  background: transparent;
  border: 1px solid #e6eef6;
}

.btn.primary {
  background: #2563eb;
  color: white;
}

.btn.danger {
  background: #ef4444;
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status {
  padding: 12px;
  border-radius: 10px;
  background: #f8fafc;
  color: #475569;
}

.status.error {
  color: #dc2626;
  background: #fef2f2;
}

@media (max-width: 768px) {
  .post-edit-page {
    padding: 24px 12px;
  }

  .form-card {
    padding: 20px;
  }

  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .right-actions {
    display: flex;
    gap: 12px;
  }
}
</style>
