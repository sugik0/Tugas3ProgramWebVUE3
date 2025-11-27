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
                                <option v-for="lok in upbjjList" :value="lok">{{ lok }}</option>
                            </select>
                        </div>
                        <div v-if="filterLokasi">
                            <label>Kategori:</label>
                            <select v-model="filterKategori">
                                <option value="">Semua Kategori</option>
                                <option v-for="kat in kategoriList" :value="kat">{{ kat }}</option>
                            </select>
                        </div>
                        <div class="checkbox-group" v-if="filterLokasi">
                            <label>
                                <input type="checkbox" v-model="filterHanyaMenipis">
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
                            <img :src="buku.cover" class="book-card-image" alt="Cover">
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
          hoverStatus: null
        }
    },
        created() {
        this.localStok = JSON.parse(JSON.stringify(this.initialData));
    },

    watch: {
        initialData: function(newVal) {
            this.localStok = JSON.parse(JSON.stringify(newVal));
        },

        filterLokasi: function(val) {
            if (!val) this.filterKategori = '';
        }
    },

    computed: {
        stokTampil() {
            let daftar = this.localStok.slice();

            // 1. Filter Lokasi
            if (this.filterLokasi) {
                daftar = daftar.filter(b => b.upbjj === this.filterLokasi);
            }
            // 2. Filter Kategori
            if (this.filterKategori) {
                daftar = daftar.filter(b => b.kategori === this.filterKategori);
            }
            // 3. Filter Menipis
            if (this.filterHanyaMenipis) {
                daftar = daftar.filter(b => b.qty < b.safety || b.qty === 0);
            }

            // 4. Sortir
            if (this.urutkanBerdasarkan === 'judul') {
                daftar.sort((a, b) => a.judul.localeCompare(b.judul));
            } else if (this.urutkanBerdasarkan === 'harga') {
                daftar.sort((a, b) => a.harga - b.harga);
            } else if (this.urutkanBerdasarkan === 'stok') {
                daftar.sort((a, b) => a.qty - b.qty);
            }
            return daftar;
        }
    },

    methods: {
        resetFilter() {
            this.filterLokasi = '';
            this.filterKategori = '';
            this.filterHanyaMenipis = false;
            this.urutkanBerdasarkan = 'judul';
        },

        getStatusClass(buku) {
            if (buku.qty === 0) return 'status-kosong';
            if (buku.qty < buku.safety) return 'status-menipis';
            return 'status-aman';
        },

        formatRupiah(angka) {
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
        },

        requestEdit(buku) {
            this.$emit('edit-buku', buku);
        },
        requestTambah() {
            this.$emit('tambah-buku');
        },

        hapusBuku(kode) {
             if (confirm('Yakin ingin menghapus buku ini?')) {
                this.localStok = this.localStok.filter(b => b.kode !== kode);
            }
        }
    }
}

</script>
