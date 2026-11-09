import axios from 'axios';

const api2 = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.0.7:3333',
});

export default api2;
