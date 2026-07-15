<template>
  <section class="community-page">
    <header class="community-header">
      <div class="community-header-left">
        <div class="community-title-wrap">
          <strong class="font-800">{{ boardTitle }}</strong>
          <span class="font-400">여행자들의 생생한 추천 글을 만나보세요</span>
        </div>
      </div>
      <button class="map-button font-400" @click="goToMap">지도 보러 가기</button>
    </header>

    <div class="search-area">
      <div class="search-box">
        <input type="text" placeholder="검색어를 입력해보세요" class="font-400"/>
        <button class="search-icon" aria-label="검색">
          🔍
        </button>
      </div>
      <button class="write-button font-400">글쓰기</button>
    </div>

    <div class="filter-chips">
      <button class="chip font-400" :class="{ active: sortKeyword === '최신순' }" @click="selectSort('최신순')">최신순</button>
      <button class="chip font-400" :class="{ active: sortKeyword === '추천순' }" @click="selectSort('추천순')">추천순</button>
    </div>

    <div v-if="isLoading" class="status">게시글을 불러오는 중입니다...</div>
    <div v-else-if="errorMessage" class="status error">{{ errorMessage }}</div>
    <div v-else class="post-list">
      <PostCard
        v-for="post in posts"
        :key="post.id"
        :id="post.id"
        :title="post.title"
        :excerpt="post.excerpt"
        :likes="post.likes"
        :views="post.views"
        :date="post.date"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PostCard from '../features/community/components/PostCard.vue'
import { apiClient } from '../services/apiClient'

const router = useRouter()
const route = useRoute()
const posts = ref([])
const sortKeyword = ref('최신순')
const isLoading = ref(false)
const errorMessage = ref('')
const nextCursor = ref(100)
const pageSize = 10

const categoryTitleMap = {
  12: '관광지',
  14: '문화시설',
  15: '축제공연행사',
  25: '여행코스',
  28: '레포츠',
  32: '숙박',
  38: '쇼핑',
  39: '음식점'
}

const contentTypeId = computed(() => Number(route.query.contentTypeId || 39))
const boardTitle = computed(() => {
  const label = categoryTitleMap[contentTypeId.value] || '여행'
  return `${label} 게시판`
})

function goToMap() {
  router.push({ name: 'Category', params: { id: 'jeonju' } })
}

function selectSort(keyword) {
  sortKeyword.value = keyword
  fetchPosts()
}

function toDateOnly(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return String(value).split('T')[0] || ''
  }
  return date.toISOString().slice(0, 10)
}

function normalizePost(post) {
  return {
    id: post.postId ?? post.id,
    title: post.title || '제목 없음',
    excerpt: post.content || '',
    likes: Number(post.likeCount || 0),
    views: Number(post.viewCount || 0),
    date: toDateOnly(post.createAt || post.date || ''),
    contentTypeId: post.contentTypeId
  }
}

async function fetchPosts() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const { data } = await apiClient.get('/posts', {
      params: {
        contentTypeId: contentTypeId.value,
        keyword: sortKeyword.value,
        sort: 'latest',
        cursor: nextCursor.value,
        size: pageSize
      }
    })

    posts.value = Array.isArray(data?.posts) ? data.posts.map(normalizePost) : []
  } catch (err) {
    console.error(err)
    errorMessage.value = '게시글을 불러오지 못했습니다.'
    posts.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
.community-page { width: 100%; max-width: 2080px; margin: 0 auto; padding: 40px 16px; }
.community-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 28px; }
.community-header-left { display: flex; align-items: center; gap: 16px; }
.community-title-wrap { display: flex; flex-direction: column; gap: 4px; }
.community-title-wrap strong {
  font-size: 1.2rem;
  color: #072B57;
}
.community-title-wrap span {
  font-size: 0.95rem;
  color: #64748b;
}
.map-button {
  background: #2563EB;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}
.search-area { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; }
.search-box {
  position: relative;
  flex: 1;
  max-width: 640px;
}
.search-box input {
  width: 100%;
  padding: 12px 48px 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
}
.search-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: none;
  color: white;
  cursor: pointer;
  display: grid;
  place-items: center;
}
.write-button {
  background: #2563EB;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  cursor: pointer;
}
.filter-chips { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
.chip {
  border: 1px solid #d1d5db;
  border-radius: 999px;
  padding: 10px 16px;
  background: white;
  cursor: pointer;
}
.chip.active { background: #eff6ff; border-color: #bfdbfe; color: #2563EB; }
.post-list { display: grid; gap: 18px; }
.post-list { display: grid; gap: 18px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
.status {
  padding: 20px;
  border-radius: 14px;
  background: #f8fafc;
  color: #475569;
  text-align: center;
}
.status.error {
  color: #dc2626;
  background: #fef2f2;
}

@media (max-width: 1024px) {
  .post-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 768px) {
  .community-page { padding: 24px 12px; }
  .community-header { flex-direction: column; align-items: flex-start; }
  .search-area { flex-direction: column; }
  .post-list { grid-template-columns: 1fr; }
}
</style>
