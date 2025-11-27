<template>
  <header>
    <nav class="main-header-nav">
      <div class="nav-left">
        <a href="#" @click.prevent="gantiTab('home')">
          <img src="/assets/img/UT_Header.webp" alt="Logo Universitas Terbuka" class="logo" />
        </a>
      </div>

      <div class="nav-center">
        <ul class="nav-menu" v-if="isLoggedIn">
          <li>
            <a href="#" @click.prevent="gantiTab('stok')" :class="{ active: currentTab === 'stok' }"
              >Informasi Bahan Ajar</a
            >
          </li>
          <li>
            <a
              href="#"
              @click.prevent="gantiTab('tracking')"
              :class="{ active: currentTab === 'tracking' }"
              >Tracking Pengiriman</a
            >
          </li>
          <li>
            <a
              href="#"
              @click.prevent="gantiTab('order')"
              :class="{ active: currentTab === 'order' }"
              >Pemesanan</a
            >
          </li>
          <li class="dropdown">
            <a href="#" class="dropdown-toggle">Laporan ▾</a>
            <ul class="dropdown-menu">
              <li><a href="#">Monitoring Progress DO</a></li>
              <li><a href="#">Rekap Bahan Ajar</a></li>
            </ul>
          </li>
        </ul>
      </div>

      <div class="nav-right">
        <div id="liveClock" class="clock-display" style="font-weight: bold; color: #333">
          {{ waktuSekarang }}
        </div>

        <div v-if="isLoggedIn" style="display: flex; align-items: center; gap: 10px">
          <img src="/assets/img/pp.jpg" class="profile-pic" />
          <span id="userNameDisplay">{{ user.nama }}</span>
          <button class="logout-btn" @click="triggerLogout">Logout</button>
        </div>

        <div v-else>
          <button class="login-btn" @click="triggerLogin">Login</button>
        </div>
      </div>
    </nav>
  </header>
</template>
<script>
export default {
  name: 'app-header',
  props: ['user', 'waktuSekarang', 'currentTab', 'isLoggedIn'],

  methods: {
    gantiTab(tabName) {
      this.$emit('change-tab', tabName)
    },
    triggerLogout() {
      this.$emit('logout')
    },
    triggerLogin() {
      this.$emit('open-login')
    },
  },
}
</script>
