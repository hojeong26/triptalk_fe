<template>
  <article class="place-card-item">
    <img v-if="image" :src="image" :alt="title" class="place-image" />
    <div v-else class="place-image placeholder">No Image</div>

    <div class="place-info">
      <h3 class="font-700">{{ title }}</h3>
      <p class="font-400">{{ address }}</p>
    </div>
  </article>
</template>

<script setup>
defineProps({
  image: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.place-card-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  background: #fbfdff;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.04);
}

.place-image {
  width: 74px;
  height: 74px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
  background: #e2e8f0;
}

.place-image.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 0.8rem;
}

.place-info {
  min-width: 0;
}

.place-info h3 {
  margin: 0 0 6px;
  font-size: 0.98rem;
  color: #0f172a;
  line-height: 1.4;
}

.place-info p {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
