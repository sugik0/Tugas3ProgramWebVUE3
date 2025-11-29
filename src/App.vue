<template>
  <div id="app">
    <app-header
      :user="user"
      :waktu-sekarang="waktuSekarang"
      :current-tab="currentTab"
      :is-logged-in="isLoggedIn"
      @change-tab="currentTab = $event"
      @logout="logout"
      @open-login="showLoginModal = true"
    >
    </app-header>

    <main>
      <section v-show="currentTab === 'home'">
        <app-banner
          :title="
            isLoggedIn ? `${greetingText}, ${user.nama}!` : `${greetingText}, Selamat Datang!`
          "
          subtitle="Sistem Informasi Pemesanan dan Distribusi Bahan Ajar Universitas Terbuka"
        >
          <template #side>
            <img src="/assets/img/welcome-img.webp" class="gambar" alt="welcome" />
          </template>
        </app-banner>
      </section>

      <section v-show="currentTab === 'stok'">
        <StockTable
          v-if="dataSiap"
          :initial-data="state.stok"
          :upbjj-list="state.upbjjList"
          :kategori-list="state.kategoriList"
          @edit-buku="handleBukaModalEdit"
          @tambah-buku="handleBukaModalTambah"
        >
        </StockTable>
      </section>

      <section v-show="currentTab === 'tracking'">
        <DoTracking
          v-if="dataSiap"
          :tracking-data="state.tracking"
          :pengiriman-list="state.pengirimanList"
          :paket-list="state.paketList"
          @tambah-do="handleBukaModalDo"
        >
        </DoTracking>
      </section>

      <section v-show="currentTab === 'order'">
        <app-banner title="Halaman Pemesanan" subtitle="Fitur ini dalam masa pengembangan">
        </app-banner>
      </section>
    </main>

    <StockForm
      :is-open="isModalOpen"
      :mode="modeModal"
      :initial-data="bukuForm"
      :upbjj-list="state.upbjjList"
      :kategori-list="state.kategoriList"
      @close="isModalOpen = false"
      @submit-data="handleSimpanStok"
    >
    </StockForm>

    <DoForm
      :is-open="isModalDoOpen"
      :nomor-otomatis="nomorDoOtomatis"
      :pengiriman-list="state.pengirimanList"
      :paket-list="state.paketList"
      @close="isModalDoOpen = false"
      @submit-do="handleSimpanDO"
    >
    </DoForm>

    <login-modal :is-open="showLoginModal" @close="showLoginModal = false" @login="handleLogin">
    </login-modal>

    <app-footer></app-footer>
  </div>
</template>

<script>
import AppBanner from './components/AppBanner.vue'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import StockTable from './components/StockTable.vue'
import StockForm from './components/StockForm.vue'
import DoTracking from './components/DoTracking.vue'
import DoForm from './components/DoForm.vue'
import LoginModal from './components/LoginModal.vue'
import apiService from './services/api'

export default {
  components: {
    AppBanner,
    AppHeader,
    AppFooter,
    StockTable,
    StockForm,
    DoTracking,
    DoForm,
    LoginModal,
  },

  data() {
    return {
      currentTab: 'home',
      dataSiap: false,

      // State Global
      state: {
        stok: [],
        tracking: [],
        upbjjList: [],
        kategoriList: [],
        pengirimanList: [],
        paketList: [],
        dataPengguna: [],
      },

      // State Login
      isLoggedIn: false,
      showLoginModal: false,
      loginForm: { email: '', password: '' },

      // Data Header
      user: { nama: '' },
      waktuSekarang: '00:00:00',
      greetingText: 'Selamat Datang',

      // Loading State
      isLoading: false,
      error: null,

      // State Modal Stok
      isModalOpen: false,
      modalTitle: '',
      modeModal: 'tambah',
      bukuForm: {
        kode: '',
        judul: '',
        kategori: '',
        upbjj: '',
        harga: 0,
        qty: 0,
        safety: 10,
        cover: '/assets/img/std_buku.jpg',
      },

      // State Modal DO
      isModalDoOpen: false,
    }
  },

  created() {
    this.cekStatusLogin()
    this.loadLocalData()
    this.ambilDataOnline()
    this.mulaiJam()
    this.updateGreeting()
  },

  computed: {
    nomorDoOtomatis() {
      const tahun = new Date().getFullYear()
      const trackingData = this.state.tracking || {}
      const jumlahData = Object.keys(trackingData).length
      const sequence = (jumlahData + 1).toString().padStart(4, '0')
      return `DO${tahun}-${sequence}`
    },
  },

  methods: {
    async loadLocalData() {
      const localData = await apiService.getLocalData()
      if (localData) {
        this.state.upbjjList = localData.upbjjList
        this.state.kategoriList = localData.kategoriList
        this.state.pengirimanList = localData.pengirimanList
        this.state.paketList = localData.paketList || localData.paket
        this.state.tracking = localData.tracking || {}
        this.dataSiap = true
      }
    },

    ambilDataOnline() {
      var vm = this
      vm.isLoading = true
      vm.error = null

      apiService
        .getOnlineData()
        .then(function (response) {
          const apiData = response.data

          if (apiData.stok) {
            vm.state.stok = apiData.stok
          }

          if (apiData.users) {
            vm.state.dataPengguna = apiData.users
          }

          vm.isLoading = false
        })
        .catch(function (error) {
          vm.isLoading = false
          if (error.response) {
            vm.error = 'Error: ' + error.message
          }
          console.error(vm.error)
        })
    },

    cekStatusLogin() {
      const savedUser = localStorage.getItem('loggedInUser')
      if (savedUser) {
        this.user.nama = savedUser
        this.isLoggedIn = true
      } else {
        this.isLoggedIn = false
        this.currentTab = 'home'
      }
    },

    handleLogin(credentials) {
      const email = credentials.email.trim().toLowerCase()
      const pass = credentials.password

      if (!this.state.dataPengguna || this.state.dataPengguna.length === 0) {
        alert('Data pengguna sedang dimuat, coba sesaat lagi.')
        return
      }

      const foundUser = this.state.dataPengguna.find(
        (u) => u.email.toLowerCase() === email && u.password === pass,
      )

      if (foundUser) {
        alert('Login Berhasil! Selamat datang, ' + foundUser.nama)
        localStorage.setItem('loggedInUser', foundUser.nama)
        this.user.nama = foundUser.nama
        this.isLoggedIn = true
        this.showLoginModal = false
        this.currentTab = 'home'
      } else {
        alert('Email atau Password salah!')
      }
    },

    logout() {
      if (confirm('Apakah Anda yakin ingin keluar?')) {
        localStorage.removeItem('loggedInUser')
        this.isLoggedIn = false
        this.user.nama = ''
        this.currentTab = 'home'
        alert('Anda telah logout.')
      }
    },

    mulaiJam() {
      setInterval(() => {
        this.waktuSekarang = new Date().toLocaleTimeString('id-ID')
        this.updateGreeting()
      }, 1000)
    },

    updateGreeting() {
      const hour = new Date().getHours()
      if (hour < 11) this.greetingText = 'Selamat Pagi'
      else if (hour < 15) this.greetingText = 'Selamat Siang'
      else if (hour < 19) this.greetingText = 'Selamat Sore'
      else this.greetingText = 'Selamat Malam'
    },

    handleBukaModalTambah() {
      this.modeModal = 'tambah'
      this.modalTitle = 'Tambah Data Baru'
      this.bukuForm = {
        kode: '',
        judul: '',
        kategori: '',
        upbjj: '',
        harga: 0,
        qty: 0,
        safety: 10,
        cover: '/assets/img/std_buku.jpg',
      }
      this.isModalOpen = true
    },

    handleBukaModalEdit(buku) {
      this.modeModal = 'edit'
      this.modalTitle = 'Edit Data Stok'
      this.bukuForm = JSON.parse(JSON.stringify(buku))
      this.isModalOpen = true
    },

    handleSimpanStok(formData) {
      const dataBaru = JSON.parse(JSON.stringify(formData))
      if (this.modeModal === 'tambah') {
        const exists = this.state.stok.find((b) => b.kode === dataBaru.kode)
        if (exists) {
          alert('Kode buku sudah ada!')
          return
        }
        this.state.stok = [...this.state.stok, dataBaru]
        alert('Data stok berhasil ditambahkan!')
      } else {
        const index = this.state.stok.findIndex((b) => b.kode === dataBaru.kode)
        if (index !== -1) {
          this.state.stok[index] = dataBaru
          this.state.stok = [...this.state.stok]
          alert('Data stok berhasil diperbarui!')
        }
      }
      this.isModalOpen = false
    },

    handleBukaModalDo() {
      this.isModalDoOpen = true
    },

    handleSimpanDO(formData) {
      const nomorBaru = this.nomorDoOtomatis

      const dataBaru = {
        nomorDO: nomorBaru,
        nim: formData.nim,
        nama: formData.nama,
        status: 'Baru Dibuat',
        ekspedisi: formData.ekspedisi,
        tanggalKirim: formData.tanggalKirim,
        paket: formData.paketKode,
        total: formData.paketTerpilih ? formData.paketTerpilih.harga : 0,
        perjalanan: [
          {
            waktu: new Date().toLocaleString('id-ID'),
            keterangan: 'Order DO dibuat.',
          },
        ],
      }

      this.state.tracking[nomorBaru] = dataBaru

      alert(`DO Baru ${nomorBaru} Berhasil Dibuat!`)
      this.isModalDoOpen = false
    },
  },
}
</script>

<style>
@import './assets/css/style.css';
</style>
