<template>
  <section class="category-page">
    <div class="top-bar">
      <div class="controls">
        <label class="select-wrap font-400">
          <div class="select-box">
            <select v-model="selectedRegion">
              <option value="" disabled>지역을 선택해주세요</option>
              <option v-for="region in regions" :key="region.value" :value="region.value">{{ region.label }}</option>
            </select>
            <span class="select-arrow">▾</span>
          </div>
        </label>
      </div>

      <router-link :to="{ name: 'Community' }" class="community-link font-400">게시판 보러 가기</router-link>
    </div>

    <div class="content-grid">
      <div class="map-card">
        <LeafletMap :selected-region="selectedRegion" :places="filteredPlaces" />
      </div>

      <div class="place-list-card">
        <div class="section-title font-800">{{ selectedRegion }} 추천 장소</div>
        <div v-for="place in filteredPlaces" :key="place.name" class="place-card">
          <div>
            <h3 class="font-700">{{ place.name }}</h3>
            <p class="font-400">{{ place.description }}</p>
          </div>
          <span class="badge font-400">{{ place.tag }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import LeafletMap from '../features/map/LeafletMap.vue'

const route = useRoute()
const selectedRegion = ref('jeonju')
const regions = [
  { value: 'jeonju', label: '전라북도 전주시' },
  { value: 'gunsan', label: '전라북도 군산시' },
  { value: 'iksan', label: '전라북도 익산시' },
  { value: 'jeongeup', label: '전라북도 정읍시' },
  { value: 'namwon', label: '전라북도 남원시' },
  { value: 'gimje', label: '전라북도 김제시' },
  { value: 'wanju', label: '전라북도 완주시' },
  { value: 'buan', label: '전라북도 부안군' },
  { value: 'yeosu', label: '전라남도 여수시' },
  { value: 'gwangju', label: '광주광역시 서구' }
]

const placeData = {
  jeonju: [
    { name: '전주한옥마을', description: '전통 한옥과 맛집이 즐비한 대표 관광지입니다.', tag: '관광지', lat: 35.8151, lng: 127.1530 },
    { name: '완산공원', description: '산책과 야경이 좋은 도심 휴식 공간입니다.', tag: '산책', lat: 35.8133, lng: 127.1206 }
  ],
  gunsan: [
    { name: '근대문화유산거리', description: '군산의 역사와 감성을 느낄 수 있는 명소입니다.', tag: '역사', lat: 35.9789, lng: 126.7090 },
    { name: '군산해변', description: '바다 풍경과 일몰을 즐기기 좋은 장소입니다.', tag: '바다', lat: 35.9676, lng: 126.7366 }
  ],
  iksan: [
    { name: '미륵사지', description: '웅장한 사찰과 유적을 둘러볼 수 있습니다.', tag: '유적', lat: 35.9481, lng: 126.9575 },
    { name: '익산문화관광단지', description: '다양한 테마의 문화시설이 모여 있습니다.', tag: '문화', lat: 35.9600, lng: 126.9400 }
  ],
  jeongeup: [
    { name: '정읍사문화공원', description: '자연과 예술이 함께 어우러진 공간입니다.', tag: '자연', lat: 35.5690, lng: 126.8563 },
    { name: '내장산', description: '등산과 풍경 감상이 가능한 대표 명소입니다.', tag: '등산', lat: 35.4686, lng: 127.0326 }
  ],
  namwon: [
    { name: '남원 춘향테마파크', description: '춘향전의 분위기를 느낄 수 있는 테마공간입니다.', tag: '테마', lat: 35.4168, lng: 127.3905 },
    { name: '왕정동 한옥마을', description: '한옥이 잘 보존된 전통 거리입니다.', tag: '전통', lat: 35.4100, lng: 127.3890 }
  ],
  gimje: [
    { name: '금산사', description: '고즈넉한 분위기의 사찰입니다.', tag: '사찰', lat: 35.8000, lng: 126.8796 },
    { name: '김제 벽골제', description: '호수와 자연 풍경이 아름다운 관광지입니다.', tag: '자연', lat: 35.8040, lng: 126.8900 }
  ],
  wanju: [
    { name: '소양강', description: '맑은 자연 풍경과 레포츠 활동이 가능합니다.', tag: '레포츠', lat: 35.9044, lng: 127.1625 },
    { name: '전주 한옥마을', description: '완주의 전통문화와 먹거리를 즐길 수 있습니다.', tag: '전통', lat: 35.9044, lng: 127.1625 }
  ],
  buan: [
    { name: '겸백리', description: '해변과 바다 풍경이 아름다운 곳입니다.', tag: '바다', lat: 35.7316, lng: 126.7330 },
    { name: '부안 내소사', description: '조용한 산책과 사찰 탐방이 가능합니다.', tag: '사찰', lat: 35.7129, lng: 126.7312 }
  ],
  yeosu: [
    { name: '여수해상케이블카', description: '바다 풍경과 여수 시내를 한눈에 볼 수 있습니다.', tag: '바다', lat: 34.7420, lng: 127.7420 },
    { name: '향일암', description: '여수의 대표적인 일몰 명소입니다.', tag: '일몰', lat: 34.7397, lng: 127.7395 }
  ],
  gwangju: [
    { name: '5·18 민주묘지', description: '광주의 역사와 의미를 느낄 수 있는 장소입니다.', tag: '역사', lat: 35.1344, lng: 126.9014 },
    { name: '충장로', description: '맛집과 쇼핑이 함께 있는 대표 상권입니다.', tag: '상권', lat: 35.1460, lng: 126.9198 }
  ]
}

const filteredPlaces = computed(() => placeData[selectedRegion.value] || [])
</script>

<style scoped>
.category-page {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 16px 80px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.community-link {
  text-decoration: none;
  color: white;
  background: #2563eb;
  border: none;
  padding: 12px 20px;
  border-radius: 999px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.16);
}

.controls {
  margin: 0;
}

.select-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #475569;
}

.select-box {
  position: relative;
  width: min(360px, 100%);
}

.select-box select {
  width: 100%;
  appearance: none;
  padding: 12px 44px 12px 14px;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 100%);
  color: #072b57;
  font-size: 0.95rem;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.08);
}

.select-arrow {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #2563eb;
  pointer-events: none;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.6fr 0.9fr;
  gap: 24px;
  align-items: start;
}

.map-card,
.place-list-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}

.map-card {
  min-height: 480px;
}

.section-title {
  font-size: 1.1rem;
  color: #072b57;
  margin-bottom: 14px;
}

.place-card {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.place-card:last-child {
  border-bottom: none;
}

.place-card h3 {
  margin: 0 0 6px;
  font-size: 1rem;
  color: #0f172a;
}

.place-card p {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
  font-size: 0.95rem;
}

.badge {
  color: #2563eb;
  background: #eff6ff;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
  white-space: nowrap;
}

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .top-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .community-link {
    width: 100%;
    text-align: center;
  }
}
</style>
