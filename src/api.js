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

// all brings filitations
export const getTerritories = (fields, lang) => {
  return instance.get(`${lang}/api/v1/territories${fields ? `?fields=${fields}` : ''}`);
};

export const getTerritory = (territoryId, fields, lang) => {
  return instance.get(`${lang}/api/v1/territories/${territoryId}${fields ? `?fields=${fields}` : ''}`);
};

export const getFiliations = (fields, lang) => {
  return instance.get(`${lang}/api/v1/filiations${fields ? `?fields=${fields}` : ''}`);
};

export const getFiliation = (filiationId, fields, lang) => {
  return instance.get(`${lang}/api/v1/filiations/${filiationId}${fields ? `?fields=${fields}` : ''}`);
};

export const getHouses = (fields, lang) => {
  return instance.get(`${lang}/api/v1/houses${fields ? `?fields=${fields}` : ''}`);
};

export const getHouse = (houseId, fields, lang) => {
  return instance.get(`${lang}/api/v1/houses/${houseId}${fields ? `?fields=${fields}` : ''}`);
};

export const getPersons = (fields, lang) => {
  return instance.get(`${lang}/api/v1/persons${fields ? `?fields=${fields}` : ''}`);
};

export const getPerson = (personId, fields, lang) => {
  return instance.get(`${lang}/api/v1/persons/${personId}${fields ? `?fields=${fields}` : ''}`);
};

export const getInterfaceData = (lang) => {
  return instance.get(`${lang}/api/v1/interface-data`);
};

export const getCourses = (fields, lang) => {
  return instance.get(`${lang}/api/v1/courses${fields ? `?fields=${fields}` : ''}`);
};

export const getGenerations = (fields, lang) => {
  return instance.get(`${lang}/api/v1/generations${fields ? `?fields=${fields}` : ''}`);
}

export const getGeneration = (generationId, fields, lang) => {
  return instance.get(`${lang}/api/v1/generations/${generationId}${fields ? `?fields=${fields}` : ''}`);
};

export const getCourse = (courseId, fields, lang) => {
  return instance.get(`${lang}/api/v1/courses/${courseId}${fields ? `?fields=${fields}` : ''}`);
};

export const getPersonByUser = (userId, fields, lang) => {
  return instance.get(`${lang}/api/v1/persons/${userId}${fields ? `?fields=${fields}` : ''}`);
};

export const saveLivingSituation = (values, lang) => {
  return instance.post(`${lang}/api/v1/living-situations`, values);
};

export const updateLivingSituation = (livingSituationId, values, lang) => {
  return instance.put(`${lang}/api/v1/living-situations/${livingSituationId}`, values);
};


