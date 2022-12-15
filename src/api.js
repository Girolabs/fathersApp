import axios from 'axios';
import { Alert, AsyncStorage } from 'react-native';
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
  //   console.log(config);
  const lang = i18n.locale;
  token = token ? JSON.parse(token).jwt : null;
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  config.url = i18n.locale + config.url;
  return config;
});

export default instance;

export const errorHandler = async (err) => {
  if (err.response?.status == 400) {
    Alert.alert(i18n.t('GENERAL.ERROR_400'));
  } else if (err.response?.status == 401) {
    //logout
    try {
      await AsyncStorage.removeItem('token');
      props.navigation.navigate('Auth');
    } catch (e) {
      console.log(e);
    }
    return;
  } else if (err.response?.status == 403) {
    Alert.alert(i18n.t('GENERAL.ERROR_403'));
  } else {
    Alert.alert(i18n.t('GENERAL.ERROR_500'));
  }
};

export const getReminders = (startDate) => {
  return instance.get(`/api/v2/date-tiles${!!startDate ? `?startDate=${startDate}` : ''}`);
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

export const archivePost = (postId) => {
  return instance.post(`/api/v1/bulletin-board/${postId}/mark-post?action=archived`);
};

export const getArchivedPosts = () => {
  return instance.get(`/api/v1/bulletin-board?isArchived=true`);
};

export const unarchivePost = (postId) => {
  return instance.post(`/api/v1/bulletin-board/${postId}/mark-post?action=unarchived`);
};

export const getPinnedPosts = () => {
  return instance.get(`/api/v1/bulletin-board/pinned-post`);
};

export const savePinnedPost = (postId) => {
  return instance.post(`/api/v1/bulletin-board/${postId}/mark-post?action=pinned`);
};

export const saveUnpinnedPost = (postId) => {
  return instance.post(`/api/v1/bulletin-board/${postId}/mark-post?action=unpinned`);
};

export const getLastPhotos = () => {
  return instance.get(`/api/v1/photo-gallery?limit=4`);
};

export const getPhoto = (photoGalleryId, fields) => {
  return instance.get(`/api/v1/photo-gallery/${photoGalleryId}${fields ? `?fields=${fields}` : ''}`);
};

export const deletePhoto = (photoGalleryId) => {
  return instance.delete(`/api/v1/photo-gallery/${photoGalleryId}`);
};

export const getPhotos = (limit = 10, offset = 0) => {
  return instance.get(`/api/v1/photo-gallery`, { params: { offset, limit } });
};

export const savePhoto = (values) => {
  return instance.post('/api/v1/photo-gallery', values);
};

export const likePhoto = (photoGalleryId) => {
  return instance.post(`/api/v1/photo-gallery/${photoGalleryId}/like`);
};

export const unlikePhoto = (photoGalleryId) => {
  return instance.post(`/api/v1/photo-gallery/${photoGalleryId}/unlike`);
};

export const commentPhoto = (photoGalleryId, values) => {
  return instance.post(`/api/v1/photo-gallery/${photoGalleryId}/comments`, values);
};

export const updateCaption = (photoGalleryId, values) => {
  return instance.put(`/api/v1/photo-gallery/${photoGalleryId}`, values);
};

export const updateComment = (photoGalleryId, commentId, values) => {
  return instance.put(`/api/v1/photo-gallery/${photoGalleryId}/comments/${commentId}`, values);
};

export const deleteComment = (photoGalleryId, commentId) => {
  return instance.delete(`/api/v1/photo-gallery/${photoGalleryId}/comments/${commentId}`);
};

export const getAssignments = () => {
  return instance.get(`/api/v1/assignments`);
};

export const getAssignment = (assignmentId) => {
  return instance.get(`/api/v1/assignments/${assignmentId}`);
};

export const saveAssignment = (values) => {
  return instance.post(`/api/v1/assignments`, values);
};

export const updateAssignment = (assignmentId, values) => {
  return instance.put(`/api/v1/assignments/${assignmentId}`, values);
};

export const deleteAssignment = (assignmentId) => {
  return instance.delete(`/api/v1/assignments/${assignmentId}`);
};

export const assigmentsUserPermissions = () => {
  return instance.get(`/api/v1/assignments/user-permissions`);
};
