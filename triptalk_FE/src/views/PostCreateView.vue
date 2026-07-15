<template>
  <section class="post-create-page">
    <header class="page-header">
      <h1 class="font-800">글쓰기</h1>
      <p class="subtitle font-300">여러분의 경험을 공유해 주세요.</p>
    </header>

    <form class="form-card font-500" @submit.prevent="handleSubmit">
      <label class="field title-field">
        <div class="field-label">제목</div>
        <input v-model="title" maxlength="100" placeholder="제목을 입력해주세요." class="font-300"/>
        <div class="char-count">{{ title.length }} / 100</div>
      </label>

      <label class="field body-field">
        <div class="field-label">본문</div>
        <textarea class="font-300" v-model="body" rows="8" maxlength="3000" placeholder="내용을 입력해주세요. (사진은 등록할 수 없습니다.)"></textarea>
        <div class="char-count">{{ body.length }} / 3000</div>
      </label>

      <label class="field password-field">
        <div class="field-label">비밀번호</div>
        <input class="font-300" v-model="password" type="password" placeholder="게시글 수정/삭제 시 필요한 비밀번호를 입력해주세요." />
      </label>

      <div class="actions">
        <button type="button" class="btn cancel font-400" @click="onCancel" :disabled="isSubmitting">취소</button>
        <button type="submit" class="btn primary font-400" :disabled="isSubmitting">{{ isSubmitting ? '작성 중...' : '작성하기' }}</button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { apiClient } from '../services/apiClient'

const router = useRouter()
const route = useRoute()
const title = ref('')
const body = ref('')
const password = ref('')
const isSubmitting = ref(false)

function onCancel() {
  const contentTypeId = Number(route.query.contentTypeId || 39)
  router.push({ name: 'Community', query: { contentTypeId } })
}

async function handleSubmit() {
  // basic validation
  if (!title.value.trim()) {
    alert('제목을 입력해 주세요.')
    return
  }
  if (!body.value.trim()) {
    alert('본문을 입력해 주세요.')
    return
  }
  if (!password.value.trim()) {
    alert('비밀번호를 입력해 주세요.')
    return
  }

  const contentTypeId = Number(route.query.contentTypeId || 39)

  isSubmitting.value = true
  try {
    const { data } = await apiClient.post('/posts', {
      title: title.value.trim(),
      content: body.value.trim(),
      password: password.value,
      contentTypeId
    })

    const createdPostId = Number(data?.postId)
    if (Number.isNaN(createdPostId)) {
      throw new Error('게시글 생성 응답이 올바르지 않습니다.')
    }

    alert(data?.message || '게시글이 생성되었습니다.')
    router.push({ name: 'PostDetail', params: { id: createdPostId } })
  } catch (err) {
    console.error(err)
    alert('게시글 생성에 실패했습니다.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.post-create-page { width:100%; margin:0 auto; padding:40px 16px; }
.page-header { text-align:center; margin:60px 0 }
.page-header h1 { font-size:28px; margin:0; color:#072B57 }
.page-header .subtitle { margin-top:8px; color:#64748b }
.form-card { width:100%; max-width:2080px; margin:0 auto; background:white; border-radius:12px; padding:28px; box-shadow:0 12px 30px rgba(15,23,42,0.06); border:1px solid rgba(15,23,42,0.04); display:flex; flex-direction:column; height:60vh }
.field { display:block; margin-bottom:18px; position:relative }
.title-field { margin-bottom:12px }
.body-field { flex:1; display:flex; flex-direction:column; margin-bottom:12px }
.body-field textarea { flex:1; min-height:0; overflow:auto }
.password-field { margin-top:0 }
.field-label { margin-bottom:8px; color:#475569 }
.field input, .field textarea { width:100%; padding:12px 14px; border:1px solid #e6eef6; border-radius:8px; font-size:14px; resize:none; }
.char-count { position:absolute; right:14px; bottom:8px; font-size:12px; color:#94a3b8 }
.actions { display:flex; justify-content:flex-end; gap:12px; margin-top:12px }
.btn { padding:10px 18px; border-radius:8px; border:none; cursor:pointer }
.btn.cancel { background:transparent; border:1px solid #e6eef6 }
.btn.primary { background:#2563EB; color:white }
.btn:disabled { opacity: 0.6; cursor: not-allowed }

@media (max-width:768px) {
  .form-card { padding:20px; height:auto }
  .page-header { margin:0 0 }
}
</style>
