<template>
  <div>
    <section class="banner">
      <div class="banner-content">
        <h1>Informasi Bahan Ajar</h1>
        <p class="subtitle">Kelola dan lihat ketersediaan stok bahan ajar di berbagai lokasi.</p>

        <button class="open-modal-btn" @click="requestTambah">Tambah Data Buku Baru</button>

        <div class="filter-container">
          <h4>Filter dan Urutkan</h4>
          <div class="filter-controls">
            <div>
              <label>Lokasi (UT-Daerah):</label>
              <select v-model="filterLokasi">
                <option value="">Semua Lokasi</option>
                <option v-for="lok in upbjjList" :value="lok" :key="lok">{{ lok }}</option>
              </select>
            </div>
            <div v-if="filterLokasi">
              <label>Kategori:</label>
              <select v-model="filterKategori">
                <option value="">Semua Kategori</option>
                <option v-for="kat in kategoriList" :value="kat" :key="kat">{{ kat }}</option>
              </select>
            </div>
            <div class="checkbox-group" v-if="filterLokasi">
              <label>
                <input type="checkbox" v-model="filterHanyaMenipis" />
                Hanya stok menipis
              </label>
            </div>
            <div>
              <label>Urutkan:</label>
              <select v-model="urutkanBerdasarkan">
                <option value="judul">Judul (A-Z)</option>
                <option value="harga">Harga</option>
                <option value="stok">Stok</option>
              </select>
            </div>
            <div>
              <button @click="resetFilter">Reset Filter</button>
            </div>
          </div>
        </div>
      </div>

      <div class="stok-header-controls">
        <h2>Daftar Stok Saat Ini</h2>
        <section class="card">
          <div class="stok-grid">
            <article class="book-card" v-for="buku in stokTampil" :key="buku.kode">
              <img :src="buku.cover" class="book-card-image" alt="Cover" />
              <div class="book-card-content">
                <h3 class="book-card-title">{{ buku.judul }}</h3>

                <div class="book-card-details">
                  <span>Kode: {{ buku.kode }}</span>
                  <span>Kategori: {{ buku.kategori }}</span>
                  <span>Lokasi: {{ buku.upbjj }}</span>
                </div>

                <div class="book-card-stock" :class="getStatusClass(buku)">
                  Stok: {{ buku.qty }}
                  <span v-if="buku.qty === 0">(Kosong)</span>
                  <span v-else-if="buku.qty < buku.safety">(Menipis)</span>
                  <span v-else>(Aman)</span>
                </div>

                <div class="book-card-price">
                  {{ formatRupiah(buku.harga) }}
                </div>

                <div class="card-actions">
                  <button @click="requestEdit(buku)">Edit</button>
                  <button @click="hapusBuku(buku.kode)">Hapus</button>
                </div>
              </div>
            </article>
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'StockTable',
  props: ['initialData', 'upbjjList', 'kategoriList'],
  emits: ['edit-buku', 'tambah-buku'],

  data() {
    return {
      localStok: [],
      filterLokasi: '',
      filterKategori: '',
      filterHanyaMenipis: false,
      urutkanBerdasarkan: 'judul',
      hoverStatus: null,
    }
  },
  created() {
    this.localStok = JSON.parse(JSON.stringify(this.initialData))
  },

  watch: {
    initialData: function (newVal) {
      this.localStok = JSON.parse(JSON.stringify(newVal))
    },

    filterLokasi: function (val) {
      if (!val) this.filterKategori = ''
    },
  },

  computed: {
    stokTampil() {
      let daftar = this.localStok.slice()

      // 1. Filter Lokasi
      if (this.filterLokasi) {
        daftar = daftar.filter((b) => b.upbjj === this.filterLokasi)
      }
      // 2. Filter Kategori
      if (this.filterKategori) {
        daftar = daftar.filter((b) => b.kategori === this.filterKategori)
      }
      // 3. Filter Menipis
      if (this.filterHanyaMenipis) {
        daftar = daftar.filter((b) => b.qty < b.safety || b.qty === 0)
      }

      // 4. Sortir
      if (this.urutkanBerdasarkan === 'judul') {
        daftar.sort((a, b) => a.judul.localeCompare(b.judul))
      } else if (this.urutkanBerdasarkan === 'harga') {
        daftar.sort((a, b) => a.harga - b.harga)
      } else if (this.urutkanBerdasarkan === 'stok') {
        daftar.sort((a, b) => a.qty - b.qty)
      }
      return daftar
    },
  },

  methods: {
    resetFilter() {
      this.filterLokasi = ''
      this.filterKategori = ''
      this.filterHanyaMenipis = false
      this.urutkanBerdasarkan = 'judul'
    },

    getStatusClass(buku) {
      if (buku.qty === 0) return 'status-kosong'
      if (buku.qty < buku.safety) return 'status-menipis'
      return 'status-aman'
    },

    formatRupiah(angka) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka)
    },

    requestEdit(buku) {
      this.$emit('edit-buku', buku)
    },
    requestTambah() {
      this.$emit('tambah-buku')
    },

    hapusBuku(kode) {
      if (confirm('Yakin ingin menghapus buku ini?')) {
        this.localStok = this.localStok.filter((b) => b.kode !== kode)
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

.stok-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.book-card {
  background-color: #fdfdfd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

.book-card-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.book-card-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.book-card-title {
  font-weight: 700;
  font-size: 1rem;
  color: #004a99;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  height: 2.8em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.book-card-details {
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 0.75rem;
  flex-grow: 0;
  line-height: 1.5;
}

.book-card-details span {
  display: block;
}

.book-card-stock,
.book-card-price,
.catatan {
  font-weight: 700;
  font-size: 1.1rem;
  color: #333;
  margin-top: 0.75rem;
}

.catatan {
  font-size: 0.85rem;
  font-style: italic;
  color: #555;
  background-color: #f9f9f9;
  padding: 8px 10px;
  border-radius: 4px;
  border-left: 3px solid #ffc425; /* Aksen kuning UT */
  word-break: break-word; /* Mencegah teks panjang merusak layout */
}

.status-kosong {
  color: red;
  font-weight: bold;
}

.status-menipis {
  color: orange;
  font-weight: bold;
}

.status-aman {
  color: green;
}

.filter-container {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  text-align: left;
}

.filter-container h4 {
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 1rem;
  color: #333;
  text-align: center;
}

.filter-controls > div {
  display: flex;
  flex-direction: column; /* Tumpuk label di atas input */
  justify-content: flex-end; /* Ratakan ke bawah (penting untuk tombol) */
}

.filter-controls label {
  font-weight: 700;
  font-size: 1rem;
  color: #555;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
}
.filter-controls select,
.filter-controls button {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  box-sizing: border-box; /* Agar padding tidak merusak lebar */
}

/* 5. Penanganan khusus untuk blok checkbox
*/
.filter-controls > div.checkbox-group {
  justify-content: flex-start; /* Jangan ratakan ke bawah */
  padding-top: 1rem; /* Posisikan agar sejajar dengan input lain */
}

.filter-controls .checkbox-group label {
  font-weight: normal;
  display: flex;
  align-items: center;
  margin-bottom: 0;
}

.filter-controls .checkbox-group input {
  margin-right: 0.5rem;
  /* Hapus style lebar penuh dari checkbox */
  width: auto;
  padding: 0;
}
</style>
