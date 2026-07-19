<template>
  <div ref="mapRoot" class="leaflet-map">
    <div v-if="selectedPlace" class="detail-panel" :style="detailPanelStyle">
      <img v-if="selectedPlace.image" :src="selectedPlace.image" :alt="selectedPlace.name" class="detail-image" />
      <div v-else class="detail-image placeholder">No Image</div>

      <div class="detail-content">
        <h3>{{ selectedPlace.name }}</h3>
        <p class="address">{{ selectedPlace.address }}</p>
        <p class="phone">{{ selectedPlace.tel || '전화번호 정보 없음' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Vite 번들 환경에서 Leaflet 기본 마커 이미지 경로가 깨지는 문제를 방지한다.
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

const props = defineProps({
  selectedRegion: {
    type: String,
    default: '전주'
  },
  places: {
    type: Array,
    default: () => []
  }
})

const mapRoot = ref(null)
const selectedPlace = ref(null)
const detailPanelStyle = ref({})
let map = null
let markerLayer = null

function updateDetailPanelPosition() {
  if (!map || !selectedPlace.value || !selectedPlace.value.lat || !selectedPlace.value.lng) {
    detailPanelStyle.value = {}
    return
  }

  const point = map.latLngToContainerPoint(L.latLng(selectedPlace.value.lat, selectedPlace.value.lng))
  detailPanelStyle.value = {
    left: `${point.x}px`,
    top: `${point.y}px`
  }
}

function createMap() {
  if (!mapRoot.value) return
  map = L.map(mapRoot.value, {
    zoomControl: true,
    scrollWheelZoom: true
  }).setView([35.8, 127.1], 7)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  markerLayer = L.layerGroup().addTo(map)

  map.on('click', () => {
    selectedPlace.value = null
    detailPanelStyle.value = {}
  })

  map.on('move zoom', updateDetailPanelPosition)
}

function renderMarkers() {
  if (!map || !markerLayer) return
  markerLayer.clearLayers()
  selectedPlace.value = null

  props.places.forEach((place) => {
    if (!place.lat || !place.lng) return
    const marker = L.marker([place.lat, place.lng])
      .on('click', () => {
        selectedPlace.value = place
        updateDetailPanelPosition()
      })

    markerLayer.addLayer(marker)
  })

  if (props.places.length) {
    const bounds = L.latLngBounds(props.places.map((place) => [place.lat, place.lng]))
    map.fitBounds(bounds, { padding: [40, 40] })
  }
}

onMounted(() => {
  createMap()
  renderMarkers()
})

watch(() => props.places, renderMarkers, { deep: true })
watch(() => props.selectedRegion, () => {
  selectedPlace.value = null
  detailPanelStyle.value = {}
  const regionCenter = {
    jeonju: [35.8242, 127.1478],
    gunsan: [35.9676, 126.7366],
    iksan: [35.9481, 126.9575],
    jeongeup: [35.5687, 126.8563],
    namwon: [35.4168, 127.3905],
    gimje: [35.8035, 126.8808],
    wanju: [35.9044, 127.1625],
    jinan: [35.7834, 127.4230],
    muju: [36.0000, 127.6600],
    jangsu: [35.6500, 127.5200],
    imsil: [35.6139, 127.2879],
    sunchang: [35.3749, 127.1363],
    gochang: [35.4333, 126.7025],
    buan: [35.7316, 126.7330],
    mokpo: [34.8118, 126.3922],
    yeosu: [34.7420, 127.7420],
    suncheon: [34.9502, 127.4872],
    naju: [35.0160, 126.7108],
    gwangyang: [34.9407, 127.6958],
    damyang: [35.3214, 126.9876],
    gokseong: [35.2820, 127.2922],
    gurye: [35.2020, 127.4627],
    goheung: [34.6200, 127.2849],
    boseong: [34.7667, 127.0800],
    hwaseong: [35.0648, 126.9860],
    jangheung: [34.6800, 126.9200],
    gangjin: [34.6420, 126.7700],
    haenam: [34.5713, 126.5990],
    yeongam: [34.8000, 126.7000],
    muan: [34.9900, 126.4800],
    hampyeong: [35.0650, 126.5200],
    yeonggwang: [35.2777, 126.5098],
    jangseong: [35.3017, 126.7858],
    wando: [34.3650, 126.7000],
    jindo: [34.4865, 126.2646],
    sinan: [34.8333, 125.9333],
    donggu: [35.1460, 126.9198],
    seogu: [35.1460, 126.9198],
    namgu: [35.1333, 126.9000],
    bukgu: [35.1800, 126.9200],
    gwangsangu: [35.1592, 126.7827]
  }

  const center = regionCenter[props.selectedRegion] || [35.8, 127.1]
  if (map) {
    map.setView(center, 10)
  }
})
</script>

<style scoped>
.leaflet-map {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  flex: 1;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.detail-panel {
  position: absolute;
  z-index: 1000;
  display: flex;
  gap: 12px;
  align-items: center;
  width: min(320px, calc(100% - 28px));
  padding: 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.18);
  backdrop-filter: blur(8px);
  transform: translate(-50%, calc(-100% - 16px));
  pointer-events: none;
}

.detail-image {
  width: 76px;
  height: 76px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
  background: #e2e8f0;
}

.detail-image.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 0.8rem;
}

.detail-content {
  min-width: 0;
}

.detail-content h3 {
  margin: 0 0 6px;
  font-size: 0.95rem;
  color: #0f172a;
  line-height: 1.3;
}

.detail-content p {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.4;
}

.address {
  margin-bottom: 4px;
}

.phone {
  font-weight: 600;
  color: #2563eb;
}
</style>
