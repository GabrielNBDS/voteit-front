import axios from 'axios'

const api = axios.create({
  baseURL: 'https://voteitapi.hashiracode.dev.br'
})

export default api
