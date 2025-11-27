import axios from 'axios'

const apiService = {
  // Ambil data dari file JSON lokal
  async getLocalData() {
    try {
      const response = await fetch('data/dataBahanAjar.json')
      if (!response.ok) throw new Error('Gagal memuat data JSON lokal')
      return await response.json()
    } catch (error) {
      console.error('Error memuat data lokal:', error)
      return null
    }
  },

  // Ambil data dari API SERVER MYSQL
  async getOnlineData() {
    const urlAPI = 'https://api.geprekndut.my.id/api.php'
    const apiKey = '050300375'

    return axios.get(urlAPI, {
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
    })
  },
}

export default apiService
