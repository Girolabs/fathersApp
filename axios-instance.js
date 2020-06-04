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
    let token = await AsyncStorage.getItem('token');
    console.log('Token Interceptor', token)
    token =token ?  JSON.parse(token).jwt: null
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;

})

export default instance;
