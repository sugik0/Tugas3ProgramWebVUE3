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
<style scoped>
header {
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  z-index: 100;
  height: 80px;
  box-sizing: border-box;
}

.main-header-nav {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  height: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.nav-left {
  justify-self: start;
}
.nav-left .logo {
  height: 60px;
  display: block;
}
.nav-left a {
  text-decoration: none;
}

.nav-center {
  justify-self: center;
}
.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1.5rem;
}
.nav-menu li {
  position: relative;
}
.nav-menu li a {
  text-decoration: none;
  color: #333;
  font-weight: 700;
  padding: 0.5rem 0.25rem;
  transition: color 0.2s ease;
  white-space: nowrap;
}
.nav-menu li a:hover,
.nav-menu li a.active {
  color: #004a99;
}
.dropdown-toggle {
  cursor: pointer;
}
.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 220px;
  list-style: none;
  padding: 0.5rem 0;
  margin: 0;
  z-index: 1001;
}
.dropdown-menu li {
  padding: 0.5rem 1rem;
}
.dropdown-menu li a {
  font-weight: 400;
}
.dropdown:hover .dropdown-menu {
  display: block;
}

.nav-right {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.profile-pic {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ddd;
}
#userNameDisplay {
  font-weight: 700;
  color: #333;
  white-space: nowrap;
}
.nav-right .clock-display {
  color: #333;
  font-weight: 700;
  padding-right: 0.75rem;
  margin-right: 0.75rem;
  border-right: 2px solid #ddd;
  white-space: nowrap;
}
</style>
