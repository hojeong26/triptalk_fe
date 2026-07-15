<template>
  <div class="post-detail-page">
    <div class="post-detail-container">
      <!-- 게시글 상세 -->
      <article class="post-detail">
        <!-- 상단: 제목과 통계 -->
        <div class="post-detail-top">
          <h1 class="font-800 post-title">{{ post.title }}</h1>
          <div class="post-stats">
            <span class="stat font-300">
              <FontAwesomeIcon :icon="['far', 'heart']" />
              {{ post.likes }}
            </span>
            <span class="stat font-300">
              <FontAwesomeIcon :icon="['fas', 'eye']" />
              {{ post.views }}
            </span>
          </div>
        </div>

        <!-- 날짜 -->
        <div class="post-date font-300">{{ formatDate(post.date) }}</div>

        <!-- 본문 -->
        <div class="post-content font-400">
          <p>{{ post.excerpt }}</p>
          <p>{{ post.fullContent }}</p>
        </div>

        <!-- 하단: 버튼 -->
        <div class="post-footer">
          <button class="list-button font-400" @click="goBack">목록으로</button>
          <div class="action-buttons">
            <button class="edit-button font-400" @click="openPasswordModal">수정하기</button>
            <button :class="['like-button', { liked: isLiked }]" @click="toggleLike" aria-label="좋아요">
              <FontAwesomeIcon :icon="isLiked ? ['fas', 'heart'] : ['far', 'heart']" />
              <span class="font-400">좋아요</span>
            </button>
          </div>
        </div>
      </article>
    </div>

    <!-- 비밀번호 확인 모달 -->
    <div v-if="showPasswordModal" class="modal-overlay" @click.self="closePasswordModal">
      <div class="modal-content">
        <div class="modal-header">
          <FontAwesomeIcon :icon="['fas', 'lock']" class="lock-icon" />
        </div>
        <h2 class="modal-title font-800">비밀번호 확인</h2>
        <p class="modal-description font-300">게시글 작성 시 설정한 비밀번호를 입력해주세요.</p>
        
        <div class="password-input-group">
          <input 
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="비밀번호를 입력해주세요"
            class="password-input font-400"
            @keyup.enter="verifyPassword"
          />
          <button class="toggle-password" @click="showPassword = !showPassword" aria-label="비밀번호 보기">
            <FontAwesomeIcon :icon="showPassword ? ['fas', 'eye-slash'] : ['fas', 'eye']" />
          </button>
        </div>

        <div class="modal-actions">
          <button class="cancel-button font-400" @click="closePasswordModal">취소</button>
          <button class="confirm-button font-400" @click="verifyPassword">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const router = useRouter()
const route = useRoute()

const post = ref({
  id: 0,
  title: '',
  excerpt: '',
  fullContent: '',
  date: '',
  views: 0,
  likes: 0,
  password: '1234' // 실제로는 백엔드에서 해시 비교
})

const isLiked = ref(false)
const showPasswordModal = ref(false)
const password = ref('')
const showPassword = ref(false)

// 게시글 데이터 로드
onMounted(() => {
  const postId = parseInt(route.params.id)
  // 실제로는 API에서 데이터를 가져옵니다
  // 지금은 목 데이터를 사용합니다
  const mockPosts = [
    {
      id: 1,
      title: '현지인이 추천하는 진짜 국밥집',
      excerpt: '여기 국밥 진짜 맛있어요! 현지인들도 줄 서서 먹는 맛집입니다.',
      fullContent: '국밥은 따뜻한 국물에 밥을 말아먹는 음식입니다. 이곳의 국밥은 정말 특별한데, 국물이 깊은 맛이 나고 돼지고기도 부드러워요. 강력 추천합니다!',
      date: '2026-05-12',
      views: 102,
      likes: 24,
      password: '1234'
    },
    {
      id: 2,
      title: '분위기 좋은 강남 카페 추천',
      excerpt: '인테리어도 예쁘고 커피도 맛있는 카페를 찾아보았어요.',
      fullContent: '이 카페는 강남역 근처에 있으며, 모던한 인테리어가 특징입니다. 커피는 싱글 오리진을 사용하며, 바리스타의 실력도 뛰어나요. 조용한 분위기에서 업무나 공부를 하기 좋습니다.',
      date: '2026-05-11',
      views: 85,
      likes: 17,
      password: '1234'
    },
    {
      id: 3,
      title: '가성비 좋은 양식 레스토랑',
      excerpt: '가성비 대비 음식 퀄리티가 정말 좋아요. 데이트 장소로 추천합니다!',
      fullContent: '양식 레스토랑인데 가격대는 합리적이고 음식 퀄리티는 정말 좋습니다. 파스타, 스테이크, 해산물 등 다양한 메뉴가 있으며, 와인 페어링도 가능합니다. 데이트 추천!',
      date: '2026-05-10',
      views: 78,
      likes: 15,
      password: '1234'
    }
  ]

  const found = mockPosts.find(p => p.id === postId)
  if (found) {
    post.value = found
  }
})

const goBack = () => {
  router.push({ name: 'Community' })
}

const openPasswordModal = () => {
  showPasswordModal.value = true
  password.value = ''
  showPassword.value = false
}

const closePasswordModal = () => {
  showPasswordModal.value = false
  password.value = ''
  showPassword.value = false
}

const verifyPassword = () => {
  // 실제로는 백엔드에 비밀번호를 보내서 검증합니다
  if (password.value === post.value.password) {
    closePasswordModal()
    router.push({ name: 'PostEdit', params: { id: post.value.id } })
  } else {
    alert('비밀번호가 일치하지 않습니다.')
    password.value = ''
  }
}

const toggleLike = () => {
  isLiked.value = !isLiked.value
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<style scoped>
.post-detail-page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 20px;
}

.post-detail-container {
  max-width: 800px;
  margin: 0 auto;
}

.post-detail {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
}

.post-detail-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.post-title {
  margin: 0;
  font-size: 2rem;
  color: #072b57;
  flex: 1;
  line-height: 1.3;
}

.post-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
  text-align: right;
}

.stat {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 0.9rem;
  white-space: nowrap;
}

.stat strong {
  color: #101233;
  font-weight: 600;
}

.post-date {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 24px;
}

.post-content {
  line-height: 1.8;
  color: #475569;
  font-size: 1.05rem;
  margin-bottom: 40px;
  flex: 1;
}

.post-content p {
  margin: 0 0 16px 0;
}

.post-content p:last-child {
  margin-bottom: 0;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.list-button {
  padding: 12px 20px;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.list-button:hover {
  background: #e2e8f0;
  border-color: #94a3b8;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.edit-button,
.like-button {
  padding: 12px 20px;
  border: 1px solid #0f5a9f;
  background: white;
  color: #0f5a9f;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.edit-button:hover {
  background: #0f5a9f;
  color: white;
}

.like-button:hover {
  background: rgba(15, 90, 159, 0.1);
}

.like-button.liked {
  background: #ff6b6b;
  color: white;
  border-color: #ff6b6b;
}

.like-button.liked:hover {
  background: #ff5252;
  border-color: #ff5252;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.modal-header {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.lock-icon {
  font-size: 3rem;
  color: #0f5a9f;
  background: rgba(15, 90, 159, 0.1);
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.modal-title {
  margin: 0 0 12px 0;
  font-size: 1.5rem;
  color: #072b57;
}

.modal-description {
  color: #64748b;
  margin-bottom: 28px;
}

.password-input-group {
  position: relative;
  margin-bottom: 28px;
}

.password-input {
  width: 100%;
  padding: 12px 16px 12px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.password-input:focus {
  outline: none;
  border-color: #0f5a9f;
  box-shadow: 0 0 0 3px rgba(15, 90, 159, 0.1);
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 1rem;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-password:hover {
  color: #0f5a9f;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.cancel-button,
.confirm-button {
  flex: 1;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.cancel-button {
  background: #f1f5f9;
  color: #475569;
}

.cancel-button:hover {
  background: #e2e8f0;
}

.confirm-button {
  background: #0f5a9f;
  color: white;
}

.confirm-button:hover {
  background: #0d4a85;
}

@media (max-width: 768px) {
  .post-detail-page {
    padding: 12px;
  }

  .post-detail {
    padding: 20px;
  }

  .post-detail-top {
    flex-direction: column;
  }

  .post-title {
    font-size: 1.5rem;
  }

  .post-stats {
    flex-direction: row;
    text-align: left;
  }

  .post-footer {
    flex-direction: column;
  }

  .list-button,
  .action-buttons {
    width: 100%;
  }

  .action-buttons {
    flex-direction: column;
  }

  .edit-button,
  .like-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
