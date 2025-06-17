import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Roteador Telefone: 192.168.162.182
// Wi-Fi: 192.168.1.26

const api = axios.create({
  baseURL: 'http:/192.168.1.26:8080' 
});

let refreshFunction = null;
export const setRefreshFunction = (fn) => {
  refreshFunction = fn;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 403 && originalRequest.url !== '/auth/refresh-token' && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const newAccessToken = await refreshFunction();

      if (newAccessToken) {
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest); 
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
