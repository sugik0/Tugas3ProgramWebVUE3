<template>
    <div class="modal" :class="{ 'is-buka': isOpen }">
        <div class="modal-content">
            <span class="close-btn" @click="$emit('close')">&times;</span>

            <h2>{{ mode === 'tambah' ? 'Tambah Data Stok' : 'Edit Data Stok' }}</h2>

            <form @submit.prevent="simpan" class="modal-form">
                <div class="form-group">
                    <label>Kode Barang</label>
                    <input v-model="localForm.kode" :readonly="mode === 'edit'" required class="form-control">
                </div>

                <div class="form-group">
                    <label>Nama Barang</label>
                    <input v-model="localForm.judul" required class="form-control">
                </div>

                <div class="form-group">
                    <label>Kategori</label>
                    <select v-model="localForm.kategori" required class="form-control">
                        <option v-for="kat in kategoriList" :value="kat">{{ kat }}</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>UPBJJ</label>
                    <select v-model="localForm.upbjj" required class="form-control">
                        <option v-for="lok in upbjjList" :value="lok">{{ lok }}</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Harga</label>
                    <input type="number" v-model.number="localForm.harga" required>
                </div>

                <div class="form-group">
                    <label>Stok</label>
                    <input type="number" v-model.number="localForm.qty" required>
                </div>

                <div class="form-group">
                    <label>Safety Stock</label>
                    <input type="number" v-model.number="localForm.safety" required>
                </div>

                <button type="submit" class="add-btn" style="width:100%; margin-top:1rem;">
                    {{ mode === 'tambah' ? 'Tambah Data' : 'Simpan Perubahan' }}
                </button>
            </form>
        </div>
    </div>
</template>
<script>
export default {
    name: 'StockForm',
    props: ['isOpen', 'mode', 'initialData', 'kategoriList', 'upbjjList'],
    emits: ['close','submit-data'],

    data() {
          return {
              localForm: {}
          }
      },

      watch: {
          initialData: {
              handler(val) {
                  this.localForm = JSON.parse(JSON.stringify(val));
              },
              deep: true,
              immediate: true
          }
      },

      methods: {
          simpan() {
              this.$emit('submit-data', this.localForm);
          }
      }
}
</script>
