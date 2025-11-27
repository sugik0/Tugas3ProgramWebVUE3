<template>
  <div>
    <section class="banner">
      <div class="banner-content">
        <h1>Tracking Pengiriman</h1>
        <p class="subtitle">Lacak status pengiriman Delivery Order (DO) Anda.</p>

        <form class="tracking-form" @submit.prevent="cariDO">
          <input type="text" v-model="nomorDoCari" placeholder="Contoh: DO2025-0001" required />
          <button type="submit" class="search-btn">Cari</button>
        </form>

        <button class="open-modal-btn" type="button" @click="$emit('tambah-do')">
          Tambah DO Baru
        </button>
      </div>

      <section class="card" v-if="hasilPencarian" style="margin-top: 20px">
        <h2>Hasil Pelacakan</h2>
        <div class="result-summary">
          <div class="summary-item">
            <label>Nomor DO</label>
            <span class="status-badge">{{ hasilPencarian.nomorDO }}</span>
          </div>
          <div class="summary-item">
            <label>Status</label>
            <span class="status-badge">{{ hasilPencarian.status }}</span>
          </div>
          <div class="summary-item">
            <label>Penerima</label>
            <span>{{ hasilPencarian.nama }}</span>
          </div>
          <div class="summary-item">
            <label>Ekspedisi</label>
            <span>{{ hasilPencarian.ekspedisi }}</span>
          </div>
        </div>
        <h3 style="padding-left: 1.5rem">Detail Perjalanan</h3>
        <ul class="journey-list">
          <li v-for="item in hasilPencarian.perjalanan">
            <span class="time">{{ item.waktu }}</span>
            <span class="detail">{{ item.keterangan }}</span>
          </li>
        </ul>
      </section>

      <section class="card" v-if="pencarianGagal">
        <p style="color: red; text-align: center">Nomor DO tidak ditemukan.</p>
      </section>
    </section>
  </div>
</template>
<script>
export default {
  name: 'DoTracking',
  props: ['trackingData', 'pengirimanList', 'paketList'],
  emits: ['tambah-do'],
  data() {
    return {
      nomorDoCari: '',
      hasilPencarian: null,
      pencarianGagal: false,
      isModalDoBuka: false,
    }
  },

  methods: {
    // --- Pencarian DO ---
    cariDO() {
      this.hasilPencarian = null
      this.pencarianGagal = false
      const data = this.trackingData
      let ketemu = null

      if (data[this.nomorDoCari]) {
        ketemu = data[this.nomorDoCari]
      } else {
        const allData = Object.values(data)
        ketemu = allData.find((item) => item.nim === this.nomorDoCari)
      }

      if (ketemu) {
        this.hasilPencarian = ketemu
      } else {
        this.pencarianGagal = true
      }
    },
  },
}
</script>
