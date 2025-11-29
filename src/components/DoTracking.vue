<template>
  <div>
    <app-banner
      title="Tracking Pengiriman"
      subtitle="Lacak status pengiriman Delivery Order (DO) Anda."
    >
      <form class="tracking-form" @submit.prevent="cariDO">
        <input type="text" v-model="nomorDoCari" placeholder="Contoh: DO2025-0001" required />
        <button type="submit" class="search-btn">Cari</button>
      </form>

      <button class="open-modal-btn" type="button" @click="$emit('tambah-do')">
        Tambah DO Baru
      </button>

      <template #side>
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
            <li v-for="(item, index) in hasilPencarian.perjalanan" :key="index">
              <span class="time">{{ item.waktu }}</span>
              <span class="detail">{{ item.keterangan }}</span>
            </li>
          </ul>
        </section>

        <section class="card" v-if="pencarianGagal">
          <p style="color: red; text-align: center">Nomor DO tidak ditemukan.</p>
        </section>
      </template>
    </app-banner>
  </div>
</template>
<script>
import AppBanner from './AppBanner.vue'

export default {
  name: 'DoTracking',
  components: {
    AppBanner,
  },
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

      // 1. Cari berdasarkan Key (Nomor DO)
      if (data[this.nomorDoCari]) {
        ketemu = {
          ...data[this.nomorDoCari],
          nomorDO: this.nomorDoCari,
        }
      }
      // 2. Cari berdasarkan NIM (Looping manual)
      else {
        const foundKey = Object.keys(data).find((key) => data[key].nim === this.nomorDoCari)
        if (foundKey) {
          ketemu = {
            ...data[foundKey],
            nomorDO: foundKey,
          }
        }
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
<style scoped>
.card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.card h2 {
  margin-top: 0;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.75rem;
  color: #333;
}

.tracking-form input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}
.tracking-form input:focus {
  outline: none;
  border-color: #004a99;
  box-shadow: 0 0 0 3px rgba(0, 74, 153, 0.1);
}

.result-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-item label {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #555;
  margin-bottom: 0.25rem;
}

.summary-item span {
  font-size: 1.1rem;
  font-weight: 700;
  color: #004a99;
}

.status-badge {
  background-color: #ffc425;
  color: #004a99;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 1rem !important;
}

.journey-list {
  list-style: none;
  padding-left: 1.5rem;
  border-left: 3px solid #004a99;
  margin-top: 1rem;
}

.journey-list li {
  position: relative;
  padding-bottom: 1.5rem;
}

.journey-list li::before {
  content: '';
  position: absolute;
  left: -2.1rem;
  top: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ffc425;
  border: 2px solid #004a99;
}

.journey-list li .time {
  display: block;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.25rem;
}

.journey-list li .detail {
  display: block;
  color: #555;
  font-size: 0.95rem;
}

#formTambahDO h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #004a99;
  font-size: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 1rem;
}

#formTambahDO input,
#formTambahDO select {
  padding: 10px;
  border-radius: 5px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

#formTambahDO input:focus,
#formTambahDO select:focus {
  outline: none;
  border-color: #004a99;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(0, 74, 153, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.info-paket {
  background: #f4f4f4;
  border: 1px dashed #ccc;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  text-align: left;
}
</style>
