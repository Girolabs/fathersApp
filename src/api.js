import axios from 'axios';
import { AsyncStorage } from 'react-native';

export const url = 'https://schoenstatt-fathers.link/';

const instance = axios.create({
  baseURL: url,
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

export const getReminders = (lang) => {
  return instance.get(`${lang}/api/v1/date-tiles`);
};

export const getBoard = (lang) => {
  return instance.get(`${lang}/api/v1/bulletin-board`);
};

export const getBoardPost = (postId, lang) => {
  return instance.get(`${lang}/api/v1/bulletin-board/${postId}`);
};

export const getTerritories = (fields, lang) => {
  return instance.get(`${lang}/api/v1/territories${fields ? `?fields=${fields}` : ''}`);
};
