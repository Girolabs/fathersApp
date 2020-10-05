import axios from 'axios';
import { AsyncStorage } from 'react-native';
import i18n from 'i18n-js';

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
  // console.log('Token Interceptor', token);
  console.log(config);
  const lang = i18n.locale;
  token = token ? JSON.parse(token).jwt : null;
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  config.url = i18n.locale + config.url;
  return config;
});

export default instance;

export const getReminders = () => {
  return instance.get('/api/v1/date-tiles');
};

export const getBoard = () => {
  return instance.get('/api/v1/bulletin-board');
};

export const getBoardPost = (postId) => {
  return instance.get(`/api/v1/bulletin-board/${postId}`);
};

// all brings filitations
export const getTerritories = (fields) => {
  return instance.get(`/api/v1/territories${fields ? `?fields=${fields}` : ''}`);
};

export const getTerritory = (territoryId, fields) => {
  return instance.get(`/api/v1/territories/${territoryId}${fields ? `?fields=${fields}` : ''}`);
};

export const getFiliations = (fields) => {
  return instance.get(`/api/v1/filiations${fields ? `?fields=${fields}` : ''}`);
};

export const getFiliation = (filiationId, fields) => {
  return instance.get(`/api/v1/filiations/${filiationId}${fields ? `?fields=${fields}` : ''}`);
};

export const getHouses = (fields) => {
  return instance.get(`/api/v1/houses${fields ? `?fields=${fields}` : ''}`);
};

export const getHouse = (houseId, fields) => {
  return instance.get(`/api/v1/houses/${houseId}${fields ? `?fields=${fields}` : ''}`);
};

export const getPersons = (fields) => {
  return instance.get(`/api/v1/persons${fields ? `?fields=${fields}` : ''}`);
};

export const getPerson = (personId, fields) => {
  return instance.get(`/api/v1/persons/${personId}${fields ? `?fields=${fields}` : ''}`);
};

export const getInterfaceData = () => {
  return instance.get('/api/v1/interface-data');
};

export const getCourses = (fields) => {
  return instance.get(`/api/v1/courses${fields ? `?fields=${fields}` : ''}`);
};

export const getGenerations = (fields) => {
  return instance.get(`/api/v1/generations${fields ? `?fields=${fields}` : ''}`);
};

export const getGeneration = (generationId, fields) => {
  return instance.get(`/api/v1/generations/${generationId}${fields ? `?fields=${fields}` : ''}`);
};

export const getCourse = (courseId, fields) => {
  return instance.get(`/api/v1/courses/${courseId}${fields ? `?fields=${fields}` : ''}`);
};

export const getPersonByUser = (userId, fields) => {
  return instance.get(`/api/v1/persons/${userId}${fields ? `?fields=${fields}` : ''}`);
};

export const saveLivingSituation = (values) => {
  return instance.post('/api/v1/living-situations', values);
};

export const updateLivingSituation = (livingSituationId, values) => {
  return instance.put(`/api/v1/living-situations/${livingSituationId}`, values);
};

export const updateFatherForm = (fatherId, values) => {
  return instance.put(`/api/v1/persons/${fatherId}`, values);
};

export const getCheckUnseenPosts = () => {
  return instance.get('/api/v1/bulletin-board/check-for-unseen-posts');
};

export const markAllPost = () => {
  return instance.post('/api/v1/bulletin-board/mark-all-posts?action=seen');
};
