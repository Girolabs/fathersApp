import axios from 'axios';
import { AsyncStorage } from 'react-native';
import i18n from 'i18n-js';

console.log('El idioma ', i18n.locale);



const instance = axios.create({
  baseURL: 'https://schoenstatt-fathers.link/',

  data: null,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(async (config) => {
  let token = await AsyncStorage.getItem('token');
  console.log('Token Interceptor', token);
  token = token ? JSON.parse(token).jwt : null;
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

export default instance;
