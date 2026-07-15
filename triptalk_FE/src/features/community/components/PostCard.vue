<template>
  <router-link :to="{ name: 'PostDetail', params: { id: id } }" class="post-card-link">
    <article class="post-card">
      <div class="post-top">
        <h3 class="font-800">{{ title }}</h3>
        <div class="post-stats font-300">
          <span class="stat">
            <FontAwesomeIcon :icon="['far', 'heart']" />
            <strong>{{ likes }}</strong>
          </span>
          <span class="stat">
            <FontAwesomeIcon :icon="['fas', 'eye']" />
            <strong>{{ views }}</strong>
          </span>
        </div>
      </div>
      <p class="excerpt font-300">{{ excerpt }}</p>
      <p class="post-date font-300">{{ date }}</p>
    </article>
  </router-link>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  id: { type: Number, required: true },
  title: String,
  excerpt: String,
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  date: { type: String, default: '' }
})
</script>

<style scoped>
.post-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
.post-card-link:hover .post-card {
  box-shadow: 0 15px 30px rgba(15, 23, 42, 0.12);
  transition: box-shadow 0.3s ease;
}
.post-card {
  padding: 20px;
  border-radius: 20px;
  background: white;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
  transition: box-shadow 0.3s ease;
}
.post-top {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 12px;
}
.post-card h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #072B57;
}
.post-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: #64748b;
  font-size: 0.9rem;
}
.stat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.stat strong {
  color: #101233;
}
.excerpt {
  margin: 0;
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.post-date {
  margin-top: 12px;
  color: #94a3b8;
  font-size: 0.85rem;
}
</style>
