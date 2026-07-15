<template>
  <header class="site-header">
    <div class="container header-inner font-800">
      <div class="brand">
        <span class="pin" aria-hidden>
          <!-- simple map pin svg, blue fill -->
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M12 2C8.686 2 6 4.686 6 8c0 5.25 6 12 6 12s6-6.75 6-12c0-3.314-2.686-6-6-6z" fill="#2563EB"/>
            <circle cx="12" cy="8" r="2.4" fill="#fff"/>
          </svg>
        </span>
        <span class="logo">TripTalk</span>
      </div>
    </div>
  </header>
</template>

<script setup>
</script>

<style scoped>
.site-header {
  background: var(--bg);
  border-bottom: 1px solid #e6eef6;
  padding: 12px 0;
}
.header-inner { display:flex; align-items:center; }
.brand { display:flex; align-items:center; gap:10px }
.pin svg { display:block }
.logo {
  font-size: 20px;
  font-weight: 700;
  color: #072B57; /* 진한 네이비 */
}
</style>