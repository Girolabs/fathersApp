import axios from 'axios';
import { AsyncStorage } from 'react-native';
import i18n from 'i18n-js';

console.log('El idioma ', i18n.locale);

const instance = axios.create({
  baseURL: 'https://schoenstatt-fathers.link/',
});

const reqInterceptor = async (config) => {
  let token = await AsyncStorage.getItem('token');
  token = token ? JSON.parse(token).jwt : null;
  if (token) config.headers.Authorization = token;
  return config;
};

instance.interceptors.request.use(reqInterceptor);

export default instance;
