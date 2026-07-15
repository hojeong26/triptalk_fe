<template>
  <section class="community-page">
    <header class="community-header">
      <div class="community-header-left">
        <div class="community-title-wrap">
          <strong class="font-800">맛집 게시판</strong>
          <span class="font-400">여행자들의 생생한 추천 글을 만나보세요</span>
        </div>
      </div>
      <button class="map-button font-400">지도 보러 가기</button>
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
      <button class="chip active font-400">최신순</button>
      <button class="chip font-400">추천순</button>
    </div>

    <div class="post-list">
      <PostCard
        v-for="post in posts"
        :key="post.id"
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
import PostCard from '../features/community/components/PostCard.vue'

const posts = [
  {
    id: 1,
    title: '현지인이 추천하는 진짜 국밥집',
    excerpt: '여기 국밥 진짜 맛있어요! 현지인들도 줄 서서 먹는 맛집입니다.',
    likes: 24,
    views: 102,
    date: '2026-09-04'
  },
  {
    id: 2,
    title: '분위기 좋은 강남 카페 추천',
    excerpt: '인테리어도 예쁘고 커피도 맛있는 카페를 찾아보았어요.',
    likes: 17,
    views: 85,
    date: '2026-09-03'
  },
  {
    id: 3,
    title: '가성비 좋은 양식 레스토랑',
    excerpt: '가성비 대비 음식 퀄리티가 정말 좋아요. 데이트 장소로 추천합니다!',
    likes: 15,
    views: 78,
    date: '2026-09-02'
  },
  {
    id: 4,
    title: '강남역 근처 숨은 맛집 리스트',
    excerpt: '직장인들이 점심에 많이 가는 숨은 맛집 모음입니다.',
    likes: 11,
    views: 67,
    date: '2026-09-01'
  },
  {
    id: 4,
    title: '강남역 근처 숨은 맛집 리스트',
    excerpt: '직장인들이 점심에 많이 가는 숨은 맛집 모음입니다.',
    likes: 11,
    views: 67,
    date: '2026-09-01'
  },
  {
    id: 4,
    title: '강남역 근처 숨은 맛집 리스트',
    excerpt: '직장인들이 점심에 많이 가는 숨은 맛집 모음입니다.',
    likes: 11,
    views: 67,
    date: '2026-09-01'
  },
  {
    id: 4,
    title: '강남역 근처 숨은 맛집 리스트',
    excerpt: '직장인들이 점심에 많이 가는 숨은 맛집 모음입니다.',
    likes: 11,
    views: 67,
    date: '2026-09-01'
  }
]
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
