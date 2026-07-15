<template>
  <div ref="mapRoot" class="leaflet-map"></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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
let map = null
let markerLayer = null

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
}

function renderMarkers() {
  if (!map || !markerLayer) return
  markerLayer.clearLayers()

  props.places.forEach((place) => {
    if (!place.lat || !place.lng) return
    const marker = L.marker([place.lat, place.lng])
      .bindPopup(`<strong>${place.name}</strong><br>${place.address}`)
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
  const regionCenter = {
    jeonju: [35.8242, 127.1478],
    gunsan: [35.9676, 126.7366],
    iksan: [35.9481, 126.9575],
    jeongeup: [35.5687, 126.8563],
    namwon: [35.4168, 127.3905],
    gimje: [35.8035, 126.8808],
    wanju: [35.9044, 127.1625],
    buan: [35.7316, 126.7330],
    yeosu: [34.7420, 127.7420],
    gwangju: [35.1460, 126.9198]
  }

  const center = regionCenter[props.selectedRegion] || [35.8, 127.1]
  if (map) {
    map.setView(center, 10)
  }
})
</script>

<style scoped>
.leaflet-map {
  width: 100%;
  height: 100%;
  min-height: 420px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}
</style>
