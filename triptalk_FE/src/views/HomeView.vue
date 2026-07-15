<template>
  <div class="home-page">
    <section class="hero">
      <h1>
        <span class="hero-emphasis">어디로</span>
        <span class="hero-accent">떠나볼까요?</span>
      </h1>
      <p class="hero-description">
        궁금한 카테고리를 선택해 여행정보를 확인하고 다른 여행자들과 이야기를 나눠보세요.
      </p>
    </section>

    <section class="category-grid">
      <button class="category-card" v-for="category in categories" :key="category.id">
        <span class="icon" aria-hidden="true">{{ category.icon }}</span>
        <strong class="category-title">{{ category.title }}</strong>
        <span class="category-subtitle">{{ category.subtitle }}</span>
      </button>
    </section>
  </div>
</template>

<script setup>
const categories = [
  { id: 'sight', title: '관광지', subtitle: '핫플부터 숨은 명소까지', icon: '🗺️' },
  { id: 'leports', title: '레포츠', subtitle: '액티브한 여행을 즐겨요', icon: '🏄' },
  { id: 'culture', title: '문화시설', subtitle: '전시, 박물관, 공연 정보', icon: '🏛️' },
  { id: 'shopping', title: '쇼핑', subtitle: '기념품과 인기 쇼핑 스팟', icon: '🛍️' },
  { id: 'stay', title: '숙박', subtitle: '편안한 숙소를 찾아보세요', icon: '🛏️' },
  { id: 'course', title: '여행코스', subtitle: '추천 코스로 계획 세우기', icon: '🧭' },
  { id: 'food', title: '음식점', subtitle: '지역 맛집을 한눈에', icon: '🍜' },
  { id: 'festival', title: '축제공연행사', subtitle: '지금 열리는 행사 확인', icon: '🎉' }
]
</script>

<style scoped>
.home-page { display: flex; flex-direction: column; align-items: center; gap: 40px; padding: 40px 0; }
.hero { text-align: center; max-width: 680px; margin: 100px 0px}
.hero h1 { font-size: 3rem; line-height: 1.05; margin: 0; }
.hero-emphasis { color: #072B57; }
.hero-accent { color: #2563EB; }
.hero-description { margin-top: 16px; color: #101233; font-size: 1rem; line-height: 1.8; }
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  width: 100%;
  max-width: 980px;
}
.category-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  aspect-ratio: 1 / 1;
  width: 100%;
  padding: 24px;
  border: none;
  border-radius: var(--radius);
  background: white;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.12);
  border: 1px solid rgba(37, 99, 235, 0.18);
}
.icon {
  font-size: 2.1rem;
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  background: rgba(37, 99, 235, 0.12);
  color: #2563EB;
}
.category-title {
  display: block;
  margin-top: 8px;
  font-size: 1.05rem;
  color: #072B57;
}
.category-subtitle {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .hero h1 { font-size: 2.6rem; }
  .category-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 768px) {
  .home-page { padding: 32px 16px; gap: 32px; }
  .hero { margin: 80px 0 0; }
  .hero h1 { font-size: 2.2rem; }
  .hero-description { font-size: 0.98rem; }
  .category-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; max-width: 100%; }
  .category-card { padding: 20px; gap: 10px; }
  .icon { width: 48px; height: 48px; font-size: 1.9rem; }
  .category-title { font-size: 1rem; }
  .category-subtitle { font-size: 0.9rem; }
}

@media (max-width: 480px) {
  .hero h1 { font-size: 1.8rem; }
  .hero-description { font-size: 0.92rem; }
  .category-grid { grid-template-columns: 1fr; gap: 14px; }
  .category-card { padding: 18px; }
}
</style>
