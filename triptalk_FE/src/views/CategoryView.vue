<template>
  <section class="category-page">
    <div class="top-bar">
      <div class="controls">
        <label class="select-wrap font-400">
          <div class="select-box">
            <select v-model="selectedProvince">
              <option value="" disabled>도/광역시를 선택해주세요</option>
              <option v-for="province in provinceOptions" :key="province.value" :value="province.value">{{ province.label }}</option>
            </select>
            <span class="select-arrow">▾</span>
          </div>
        </label>

        <label class="select-wrap font-400">
          <div class="select-box">
            <select v-model="selectedRegion" :disabled="!currentRegions.length">
              <option value="" disabled>시/군/구를 선택해주세요</option>
              <option v-for="region in currentRegions" :key="region.value" :value="region.value">{{ region.label }}</option>
            </select>
            <span class="select-arrow">▾</span>
          </div>
        </label>
      </div>

      <router-link :to="{ name: 'Community', query: { contentTypeId: contentTypeId } }" class="community-link font-400">게시판 보러 가기</router-link>
    </div>

    <div class="content-grid">
      <div class="map-card">
        <LeafletMap :selected-region="selectedRegion" :places="filteredPlaces" />
      </div>

      <div class="place-list-card">
        <div class="section-title font-800">{{ selectedRegionMeta?.label || selectedRegion }} 추천 장소</div>
        <div v-if="isLoading" class="status loading">데이터를 불러오는 중입니다...</div>
        <div v-else-if="errorMessage" class="status error">{{ errorMessage }}</div>
        <div v-else-if="!filteredPlaces.length" class="status empty">표시할 장소가 없습니다.</div>
        <div v-else class="place-list-scroll">
          <PlaceCard
            v-for="place in filteredPlaces"
            :key="place.id || place.name"
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
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import LeafletMap from '../features/map/LeafletMap.vue'
import PlaceCard from '../features/map/PlaceCard.vue'
import { apiClient } from '../services/apiClient'

const route = useRoute()
const selectedProvince = ref('jeollabukdo')
const selectedRegion = ref('jeonju')
const places = ref([])
const isLoading = ref(false)
const errorMessage = ref('')
const provinceGroups = [
  {
    value: 'jeollabukdo',
    label: '전라북도',
    regions: [
      { value: 'jeonju', label: '전주시', areaCode: 37, sigunguCode: 1 },
      { value: 'gunsan', label: '군산시', areaCode: 37, sigunguCode: 2 },
      { value: 'iksan', label: '익산시', areaCode: 37, sigunguCode: 3 },
      { value: 'jeongeup', label: '정읍시', areaCode: 37, sigunguCode: 4 },
      { value: 'namwon', label: '남원시', areaCode: 37, sigunguCode: 5 },
      { value: 'gimje', label: '김제시', areaCode: 37, sigunguCode: 6 },
      { value: 'wanju', label: '완주군', areaCode: 37, sigunguCode: 7 },
      { value: 'jinan', label: '진안군', areaCode: 37, sigunguCode: 8 },
      { value: 'muju', label: '무주군', areaCode: 37, sigunguCode: 9 },
      { value: 'jangsu', label: '장수군', areaCode: 37, sigunguCode: 10 },
      { value: 'imsil', label: '임실군', areaCode: 37, sigunguCode: 11 },
      { value: 'sunchang', label: '순창군', areaCode: 37, sigunguCode: 12 },
      { value: 'gochang', label: '고창군', areaCode: 37, sigunguCode: 13 },
      { value: 'buan', label: '부안군', areaCode: 37, sigunguCode: 14 }
    ]
  },
  {
    value: 'jeollanamdo',
    label: '전라남도',
    regions: [
      { value: 'mokpo', label: '목포시', areaCode: 38, sigunguCode: 1 },
      { value: 'yeosu', label: '여수시', areaCode: 38, sigunguCode: 2 },
      { value: 'suncheon', label: '순천시', areaCode: 38, sigunguCode: 3 },
      { value: 'naju', label: '나주시', areaCode: 38, sigunguCode: 4 },
      { value: 'gwangyang', label: '광양시', areaCode: 38, sigunguCode: 5 },
      { value: 'damyang', label: '담양군', areaCode: 38, sigunguCode: 6 },
      { value: 'gokseong', label: '곡성군', areaCode: 38, sigunguCode: 7 },
      { value: 'gurye', label: '구례군', areaCode: 38, sigunguCode: 8 },
      { value: 'goheung', label: '고흥군', areaCode: 38, sigunguCode: 9 },
      { value: 'boseong', label: '보성군', areaCode: 38, sigunguCode: 10 },
      { value: 'hwaseong', label: '화순군', areaCode: 38, sigunguCode: 11 },
      { value: 'jangheung', label: '장흥군', areaCode: 38, sigunguCode: 12 },
      { value: 'gangjin', label: '강진군', areaCode: 38, sigunguCode: 13 },
      { value: 'haenam', label: '해남군', areaCode: 38, sigunguCode: 14 },
      { value: 'yeongam', label: '영암군', areaCode: 38, sigunguCode: 15 },
      { value: 'muan', label: '무안군', areaCode: 38, sigunguCode: 16 },
      { value: 'hampyeong', label: '함평군', areaCode: 38, sigunguCode: 17 },
      { value: 'yeonggwang', label: '영광군', areaCode: 38, sigunguCode: 18 },
      { value: 'jangseong', label: '장성군', areaCode: 38, sigunguCode: 19 },
      { value: 'wando', label: '완도군', areaCode: 38, sigunguCode: 20 },
      { value: 'jindo', label: '진도군', areaCode: 38, sigunguCode: 21 },
      { value: 'sinan', label: '신안군', areaCode: 38, sigunguCode: 22 }
    ]
  },
  {
    value: 'gwangju',
    label: '광주광역시',
    regions: [
      { value: 'donggu', label: '동구', areaCode: 5, sigunguCode: 1 },
      { value: 'seogu', label: '서구', areaCode: 5, sigunguCode: 2 },
      { value: 'namgu', label: '남구', areaCode: 5, sigunguCode: 3 },
      { value: 'bukgu', label: '북구', areaCode: 5, sigunguCode: 4 },
      { value: 'gwangsangu', label: '광산구', areaCode: 5, sigunguCode: 5 }
    ]
  }
]

const provinceOptions = computed(() => provinceGroups.map(({ value, label }) => ({ value, label })))
const currentRegions = computed(() => provinceGroups.find((group) => group.value === selectedProvince.value)?.regions || [])
const contentTypeId = computed(() => Number(route.query.contentTypeId || 12))
const selectedRegionMeta = computed(() => currentRegions.value.find((region) => region.value === selectedRegion.value) || currentRegions.value[0] || null)

function normalizePlace(item) {
  const locationId = item.contentId ?? item.contentid ?? item.id ?? ''
  const latitude = Number(item.mapy ?? item.lat ?? 0)
  const longitude = Number(item.mapx ?? item.lng ?? 0)

  return {
    id: locationId,
    name: item.title || item.name || '제목 없음',
    address: item.addr1 || item.addr2 || '주소 정보 없음',
    image: item.firstimage || item.firstimage2 || '',
    lat: latitude,
    lng: longitude,
    tel: item.tel || '',
    ...item
  }
}

function inferRegionFromCoordinates(latitude, longitude) {
  if (latitude >= 35.10 && latitude <= 35.22 && longitude >= 126.74 && longitude <= 126.84) return { province: 'gwangju', region: 'gwangsangu' }
  if (latitude >= 35.12 && latitude <= 35.18 && longitude >= 126.86 && longitude <= 126.95) return { province: 'gwangju', region: 'seogu' }
  if (latitude >= 35.13 && latitude <= 35.18 && longitude >= 126.90 && longitude <= 127.00) return { province: 'gwangju', region: 'donggu' }
  if (latitude >= 35.13 && latitude <= 35.18 && longitude >= 126.88 && longitude <= 126.92) return { province: 'gwangju', region: 'namgu' }
  if (latitude >= 35.16 && latitude <= 35.20 && longitude >= 126.90 && longitude <= 126.95) return { province: 'gwangju', region: 'bukgu' }
  if (latitude >= 35.70 && latitude <= 36.05 && longitude >= 126.80 && longitude <= 127.20) return { province: 'jeollabukdo', region: 'jeonju' }
  if (latitude >= 35.92 && latitude <= 36.02 && longitude >= 126.55 && longitude <= 126.80) return { province: 'jeollabukdo', region: 'gunsan' }
  if (latitude >= 35.90 && latitude <= 36.00 && longitude >= 126.90 && longitude <= 127.20) return { province: 'jeollabukdo', region: 'iksan' }
  if (latitude >= 35.50 && latitude <= 35.60 && longitude >= 126.78 && longitude <= 126.90) return { province: 'jeollabukdo', region: 'jeongeup' }
  if (latitude >= 35.35 && latitude <= 35.45 && longitude >= 127.32 && longitude <= 127.45) return { province: 'jeollabukdo', region: 'namwon' }
  if (latitude >= 35.75 && latitude <= 35.85 && longitude >= 126.80 && longitude <= 126.92) return { province: 'jeollabukdo', region: 'gimje' }
  if (latitude >= 35.85 && latitude <= 36.00 && longitude >= 127.10 && longitude <= 127.20) return { province: 'jeollabukdo', region: 'wanju' }
  if (latitude >= 35.65 && latitude <= 35.78 && longitude >= 126.65 && longitude <= 126.78) return { province: 'jeollabukdo', region: 'buan' }
  if (latitude >= 34.65 && latitude <= 34.82 && longitude >= 127.62 && longitude <= 127.78) return { province: 'jeollanamdo', region: 'yeosu' }
  return null
}

function requestLocations() {
  const regionMeta = selectedRegionMeta.value
  if (!regionMeta) return

  isLoading.value = true
  errorMessage.value = ''

  return apiClient.get('/locations/', {
    params: {
      contentTypeId: contentTypeId.value,
      areaCode: regionMeta.areaCode,
      sigunguCode: regionMeta.sigunguCode
    }
  })
    .then(({ data }) => {
      const items = Array.isArray(data?.locations) ? data.locations : []
      places.value = items.map(normalizePlace)
      if (!items.length) {
        errorMessage.value = '표시할 장소가 없습니다.'
      }
    })
    .catch((err) => {
      console.error(err)
      errorMessage.value = '데이터를 불러오지 못했습니다.'
      places.value = []
    })
    .finally(() => {
      isLoading.value = false
    })
}

function initLocationBasedRegion() {
  const providedLatitude = Number(route.query.latitude)
  const providedLongitude = Number(route.query.longitude)

  if (!Number.isNaN(providedLatitude) && !Number.isNaN(providedLongitude)) {
    const inferredRegion = inferRegionFromCoordinates(providedLatitude, providedLongitude)
    if (inferredRegion) {
      selectedProvince.value = inferredRegion.province
      selectedRegion.value = inferredRegion.region
    }
    requestLocations()
    return
  }

  if (!navigator.geolocation) {
    requestLocations()
    return
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const inferredRegion = inferRegionFromCoordinates(position.coords.latitude, position.coords.longitude)
      if (inferredRegion) {
        selectedProvince.value = inferredRegion.province
        selectedRegion.value = inferredRegion.region
      }
      requestLocations()
    },
    () => {
      requestLocations()
    },
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
  )
}

onMounted(() => {
  initLocationBasedRegion()
})

watch(selectedProvince, (newProvince) => {
  const province = provinceGroups.find((group) => group.value === newProvince)
  if (!province) return

  const hasCurrentRegion = province.regions.some((region) => region.value === selectedRegion.value)
  if (!hasCurrentRegion) {
    selectedRegion.value = province.regions[0]?.value || ''
  }

  requestLocations()
})

watch(selectedRegion, () => {
  requestLocations()
})

watch(() => route.query.contentTypeId, () => {
  requestLocations()
})

const filteredPlaces = computed(() => places.value)
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
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
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

.status {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  border-radius: 14px;
  color: #475569;
  background: #f8fafc;
  font-size: 0.95rem;
}

.status.error {
  color: #dc2626;
  background: #fef2f2;
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
