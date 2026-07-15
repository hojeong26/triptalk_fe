<template>
  <section class="post-edit-page">
    <header class="page-header">
      <h1 class="font-800">게시글 수정</h1>
      <p class="subtitle font-300">기존 내용을 수정해 주세요.</p>
    </header>

    <form class="form-card font-500" @submit.prevent="handleSubmit">
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

      <label class="field password-field">
        <div class="field-label">비밀번호</div>
        <input class="font-300" v-model="password" type="password" placeholder="수정 권한 확인용 비밀번호를 입력해주세요." />
      </label>

      <div class="actions">
        <button type="button" class="btn danger font-400" @click="handleDelete">삭제하기</button>
        <div class="right-actions">
          <button type="button" class="btn cancel font-400" @click="onCancel">취소</button>
          <button type="submit" class="btn primary font-400">수정하기</button>
        </div>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const title = ref('')
const body = ref('')
const password = ref('')

onMounted(() => {
  const postId = Number(route.params.id)
  const mockPosts = [
    {
      id: 1,
      title: '현지인이 추천하는 진짜 국밥집',
      fullContent: '국밥은 따뜻한 국물에 밥을 말아먹는 음식입니다. 이곳의 국밥은 정말 특별한데, 국물이 깊은 맛이 나고 돼지고기도 부드러워요. 강력 추천합니다!',
      password: '1234'
    },
    {
      id: 2,
      title: '분위기 좋은 강남 카페 추천',
      fullContent: '이 카페는 강남역 근처에 있으며, 모던한 인테리어가 특징입니다. 커피는 싱글 오리진을 사용하며, 바리스타의 실력도 뛰어나요. 조용한 분위기에서 업무나 공부를 하기 좋습니다.',
      password: '1234'
    },
    {
      id: 3,
      title: '가성비 좋은 양식 레스토랑',
      fullContent: '양식 레스토랑인데 가격대는 합리적이고 음식 퀄리티는 정말 좋습니다. 파스타, 스테이크, 해산물 등 다양한 메뉴가 있으며, 와인 페어링도 가능합니다. 데이트 추천!',
      password: '1234'
    }
  ]

  const found = mockPosts.find((post) => post.id === postId)
  if (found) {
    title.value = found.title
    body.value = found.fullContent
    password.value = found.password ?? ''
  }
})

function onCancel() {
  router.push({ name: 'PostDetail', params: { id: route.params.id } })
}

function handleDelete() {
  if (confirm('정말 삭제하시겠습니까?')) {
    console.log('delete post', route.params.id)
    router.push({ name: 'Community' })
  }
}

function handleSubmit() {
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

  console.log({
    id: route.params.id,
    title: title.value,
    body: body.value,
    password: password.value
  })

  router.push({ name: 'PostDetail', params: { id: route.params.id } })
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
    justify-content: flex-end;
  }
}
</style>
