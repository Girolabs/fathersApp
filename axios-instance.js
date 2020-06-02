import axios from 'axios';
import { AsyncStorage } from 'react-native';

const instance = axios.create({
  baseURL: 'https://schoenstatt-fathers.link/en/api/v1/',

  data: null,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(async ( config ) => {
    const token = await AsyncStorage.getItem('token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;

})

export default instance;
