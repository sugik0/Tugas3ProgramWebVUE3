<template>
  <footer>
    <p>&copy; 2025 Universitas Terbuka. Hak Cipta Dilindungi.</p>
  </footer>
</template>
<script>
export default {
  name: 'app-footer',
}
</script>
<style scoped>
footer {
  width: auto;
  height: 200px;
  color: white;
  text-align: center;
  font-size: 0.9rem;
  background-image: url('/assets/img/banner-footer.png');
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
</style>
