<template>
  <section class="banner">
    <div class="banner-content">
      <h1>{{ title }}</h1>
      <h2 v-if="subtitle" class="subtitle">{{ subtitle }}</h2>
      <slot></slot>
    </div>

    <div class="banner-side-content" v-if="$slots.side">
      <slot name="side"></slot>
    </div>
  </section>
</template>

<script>
export default {
  name: 'app-banner',
  props: ['title', 'subtitle'],
}
</script>
<style scoped>
.banner {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 63vh;
  padding: 2.1rem;
  background-image: url('/assets/img/banner-landing.png');
  background-size: cover;
  background-position: center;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 2.5rem;
  position: relative;
  z-index: 0;
}

.banner:not(:has(.banner-side-content)) {
  grid-template-columns: 1fr;
}

.banner h1 {
  font-size: 3.5rem;
  color: #004a99;
  margin-bottom: 0.5rem;
}

.banner p {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 1.5rem;
}
</style>
