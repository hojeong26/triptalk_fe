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
        <div class="place-list-scroll">
          <PlaceCard
            v-for="place in filteredPlaces"
            :key="place.name"
            :image="place.image"
            :title="place.name"
            :address="place.address"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import LeafletMap from '../features/map/LeafletMap.vue'
import PlaceCard from '../features/map/PlaceCard.vue'

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
    { name: '전주한옥마을', address: '전라북도 전주시 완산구 풍남문로 4가', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80', lat: 35.8151, lng: 127.1530 },
    { name: '완산공원', address: '전라북도 전주시 완산구 효자동', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80', lat: 35.8133, lng: 127.1206 },
    { name: '전주월드컵경기장', address: '전라북도 전주시 덕진구', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80', lat: 35.8454, lng: 127.1290 },
    { name: '전주동물원', address: '전라북도 전주시 덕진구', image: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&w=800&q=80', lat: 35.8470, lng: 127.1208 },
    { name: '전주향교', address: '전라북도 전주시 완산구', image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80', lat: 35.8175, lng: 127.1484 },
    { name: '전주국제영화제 거리', address: '전라북도 전주시 완산구 중앙동', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80', lat: 35.8145, lng: 127.1478 },
    { name: '남고산성', address: '전라북도 전주시 완산구', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80', lat: 35.8210, lng: 127.1670 },
    { name: '전주성심당', address: '전라북도 전주시 완산구 동문동', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', lat: 35.8158, lng: 127.1501 },
    { name: '덕진공원', address: '전라북도 전주시 덕진구', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80', lat: 35.8451, lng: 127.1170 },
    { name: '전주비빔밥 거리', address: '전라북도 전주시 완산구', image: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&w=800&q=80', lat: 35.8139, lng: 127.1492 },
    { name: '전주천', address: '전라북도 전주시 완산구', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80', lat: 35.8160, lng: 127.1394 },
    { name: '전주박물관', address: '전라북도 전주시 완산구', image: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=800&q=80', lat: 35.8192, lng: 127.1490 }
  ],
  gunsan: [
    { name: '근대문화유산거리', address: '전라북도 군산시 월명동', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80', lat: 35.9789, lng: 126.7090 },
    { name: '군산해변', address: '전라북도 군산시 옥도면', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80', lat: 35.9676, lng: 126.7366 }
  ],
  iksan: [
    { name: '미륵사지', address: '전라북도 익산시 금마면 미륵사지로', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', lat: 35.9481, lng: 126.9575 },
    { name: '익산문화관광단지', address: '전라북도 익산시 동산동', image: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=800&q=80', lat: 35.9600, lng: 126.9400 }
  ],
  jeongeup: [
    { name: '정읍사문화공원', address: '전라북도 정읍시 수성동', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80', lat: 35.5690, lng: 126.8563 },
    { name: '내장산', address: '전라북도 정읍시 내장동', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80', lat: 35.4686, lng: 127.0326 }
  ],
  namwon: [
    { name: '남원 춘향테마파크', address: '전라북도 남원시 춘향로', image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80', lat: 35.4168, lng: 127.3905 },
    { name: '왕정동 한옥마을', address: '전라북도 남원시 왕정동', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80', lat: 35.4100, lng: 127.3890 }
  ],
  gimje: [
    { name: '금산사', address: '전라북도 김제시 금산면', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80', lat: 35.8000, lng: 126.8796 },
    { name: '김제 벽골제', address: '전라북도 김제시 신풍동', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80', lat: 35.8040, lng: 126.8900 }
  ],
  wanju: [
    { name: '소양강', address: '전라북도 완주군 소양면', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', lat: 35.9044, lng: 127.1625 },
    { name: '전주 한옥마을', address: '전라북도 완주군 봉동읍', image: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=800&q=80', lat: 35.9044, lng: 127.1625 }
  ],
  buan: [
    { name: '겸백리', address: '전라북도 부안군 변산면', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80', lat: 35.7316, lng: 126.7330 },
    { name: '부안 내소사', address: '전라북도 부안군 계화면', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80', lat: 35.7129, lng: 126.7312 }
  ],
  yeosu: [
    { name: '여수해상케이블카', address: '전라남도 여수시 돌산읍', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', lat: 34.7420, lng: 127.7420 },
    { name: '향일암', address: '전라남도 여수시 돌산읍 향일암로', image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80', lat: 34.7397, lng: 127.7395 }
  ],
  gwangju: [
    { name: '5·18 민주묘지', address: '광주광역시 서구 5·18민주묘지길', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80', lat: 35.1344, lng: 126.9014 },
    { name: '충장로', address: '광주광역시 서구 치평동', image: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=800&q=80', lat: 35.1460, lng: 126.9198 }
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
  align-items: stretch;
  height: 60vh;
  min-height: 480px;
  max-height: 60vh;
}

.map-card,
.place-list-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

.map-card {
  min-height: 0;
}

.place-list-scroll {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.section-title {
  flex-shrink: 0;
  margin-bottom: 14px;
}

.place-list-scroll::-webkit-scrollbar {
  width: 6px;
}

.place-list-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
    height: auto;
    min-height: auto;
    max-height: none;
  }

  .map-card,
  .place-list-card {
    height: auto;
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
