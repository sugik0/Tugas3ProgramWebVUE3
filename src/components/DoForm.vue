<template>
    <div class="modal" :class="{ 'is-buka': isOpen }">
        <div class="modal-content">
            <span class="close-btn" @click="$emit('close')">&times;</span>
            <h2>Tambah Input Delivery Order Baru</h2>

            <form @submit.prevent="simpan" class="modal-form">
                <div class="form-group">
                    <label>Nomor DO (Otomatis)</label>
                    <input type="text" :value="nomorOtomatis" disabled class="form-control">
                </div>

                <div class="form-group">
                    <label>NIM</label>
                    <input type="text" v-model="localForm.nim" required class="form-control">
                </div>

                <div class="form-group">
                    <label>Nama</label>
                    <input type="text" v-model="localForm.nama" required class="form-control">
                </div>

                <div class="form-group">
                    <label>Ekspedisi</label>
                    <select v-model="localForm.ekspedisi" required class="form-control">
                        <option value="" disabled>Pilih Ekspedisi</option>
                        <option v-for="item in pengirimanList" :value="item.nama">
                            {{ item.nama }}
                        </option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Paket Bahan Ajar</label>
                    <select v-model="localForm.paketKode" required class="form-control">
                        <option value="" disabled>Pilih Paket</option>
                        <option v-for="item in paketList" :value="item.kode">
                            {{ item.kode }} - {{ item.nama }}
                        </option>
                    </select>

                    <div class="info-paket" v-if="paketTerpilih" style="background: #f4f4f4; padding: 10px; margin-top: 10px; border-radius:5px;">
                        <strong>Detail Paket:</strong>
                        <p style="margin:0">Isi: {{ paketTerpilih.isi.join(', ') }}</p>
                        <p style="margin:0">Harga: Rp {{ paketTerpilih.harga }}</p>
                    </div>
                </div>

                <div class="form-group">
                    <label>Tanggal Kirim</label>
                    <input type="date" v-model="localForm.tanggalKirim" required class="form-control">
                </div>

                <button type="submit" class="add-btn">Simpan DO Baru</button>
            </form>
        </div>
    </div>
</template>
<script>
export default {
  name: 'do-form',
  props: ['isOpen', 'nomorOtomatis', 'pengirimanList', 'paketList'],
  emits: ['close', 'submit-do'],
  data() {
        return {
            localForm: {
                nim: '',
                nama: '',
                ekspedisi: '',
                paketKode: '',
                tanggalKirim: new Date().toISOString().slice(0, 10),
            },
            paketTerpilih: null
        }
    },

    watch: {
        'localForm.paketKode': function (val) {
            if (val) {
                this.paketTerpilih = this.paketList.find(p => p.kode === val);
            } else {
                this.paketTerpilih = null;
            }
        }
    },

    methods: {
        simpan() {
            this.$emit('submit-do', {
                ...this.localForm,
                paketTerpilih: this.paketTerpilih
            });
        }
    }
}
</script>
