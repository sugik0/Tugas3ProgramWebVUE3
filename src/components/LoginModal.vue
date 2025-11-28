<template>
  <div class="modal" :class="{ 'is-buka': isOpen }">
    <div class="modal-content" style="max-width: 400px">
      <span class="close-btn" @click="$emit('close')">&times;</span>

      <form @submit.prevent="submitLogin" class="modal-form">
        <h2 style="text-align: center; color: #004a99">Login SITTA</h2>

        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" placeholder="admin@ut.ac.id" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" placeholder="admin123" required />
        </div>

        <button type="submit" class="add-btn" style="width: 100%; margin-top: 15px">Masuk</button>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'login-modal',
  props: ['isOpen'],
  emits: ['close', 'login'],
  data() {
    return {
      email: '',
      password: '',
    }
  },

  methods: {
    submitLogin() {
      this.$emit('login', {
        email: this.email,
        password: this.password,
      })
      this.password = ''
    },
  },
}
</script>
<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

form h2 {
  text-align: center;
  color: #004a99;
  margin-bottom: 10px;
}

label {
  font-weight: bold;
  display: block;
}

input[type='text'],
input[type='email'],
input[type='password'],
input[type='number'] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.form-control {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
}
</style>
