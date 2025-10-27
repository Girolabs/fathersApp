import React, { useEffect, useState, useContext, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Image,
  FlatList,
  useWindowDimensions,
  Pressable,
  BackHandler,
  Platform,
} from 'react-native';

import i18n from 'i18n-js';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as Network from 'expo-network';
import 'moment/min/locales';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from 'expo-vector-icons';

import SnackBar from '../components/SnackBar';
import Colors from '../constants/Colors';
import { I18nContext } from '../context/I18nProvider';
import { getLastPhotos, getPinnedPosts, getReminders } from '../api';
import RemindersHeaders from '../components/RemindersHeaders';
import { BulletinCheckContext } from '../context/BulletinCheckProvider';
import star from '../../assets/star.png';
import { CustomSlider } from '../components/CarouselSlider';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.surfaceColorPrimary,
    marginBottom: 15,
  },
  screenLoading: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.surfaceColorPrimary,
    justifyContent: 'center',
  },
  snackError: {
    backgroundColor: Colors.secondaryColor,
  },
});

const HomeScreen = ({ navigation }) => {
  const [reminders, setReminders] = useState([]);
  const [selectedReminder, setSelectedReminder] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const [photos, setPhotos] = useState([]);
  const [favorite, setFavorite] = useState({});
  const { checkOnly } = useContext(BulletinCheckContext);

  // Botón atrás en Android → salir de la app
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;

      const backAction = () => {
        BackHandler.exitApp();
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => subscription.remove();
    }, []),
  );

  // Bloquear orientación + cargar recordatorios al montar
  useEffect(() => {
    let isMounted = true;

    const lockScreen = async () => {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      } catch (e) {
        console.log('Orientation lock failed', e);
      }
    };

    const loadReminders = async () => {
      try {
        const status = await Network.getNetworkStateAsync();
        if (!status.isConnected) {
          if (isMounted) {
            setVisible(true);
            setSnackMsg(i18n.t('GENERAL.NO_INTERNET'));
          }
          return;
        }

        setLoading(true);

        const today = new Date();
        const sixMonthsBefore = new Date(today);
        sixMonthsBefore.setMonth(today.getMonth() - 6);

        const formatDate = (date) =>
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(
            2,
            '0',
          )}`;

        const formattedSixMonthsBefore = formatDate(sixMonthsBefore);

        const res = await getReminders(365, formattedSixMonthsBefore);
        const safeReminders = Array.isArray(res?.data?.result) ? res.data.result : [];
        if (isMounted) setReminders(safeReminders);
      } catch (err) {
        console.log('loadReminders error', err);
        if (isMounted) {
          setVisible(true);
          setSnackMsg(i18n.t('GENERAL.ERROR'));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    lockScreen();
    loadReminders();

    return () => {
      isMounted = false;
    };
  }, []);

  // Ejecutar checkOnly cuando se enfoca
  useFocusEffect(
    useCallback(() => {
      checkOnly?.();
      return () => {};
    }, [checkOnly]),
  );

  // Cargar post destacado (pinned)
  useEffect(() => {
    let active = true;
    getPinnedPosts()
      .then((res) => {
        if (active) {
          const data = res?.data?.result || {};
          setFavorite(data);
        }
      })
      .catch(() => {
        if (active) setFavorite({});
      });
    return () => {
      active = false;
    };
  }, []);

  // Cargar fotos recientes
  useEffect(() => {
    let active = true;
    getLastPhotos()
      .then((res) => {
        if (!active) return;
        const data = Array.isArray(res?.data?.result) ? res.data.result : [];
        const dataSort = data.sort((a, b) => b.galleryPhotoId - a.galleryPhotoId);
        setPhotos(dataSort);
      })
      .catch((e) => {
        console.log('photo load error', e);
        if (active) setPhotos([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const windowHeight = useWindowDimensions().height;

  return (
    <I18nContext.Consumer>
      {(value) => {
        moment.locale(value.lang);

        return (
          <FlatList
            ListHeaderComponent={
              <View style={styles.screen}>
                {!loading ? (
                  <>
                    {favorite && Object.entries(favorite).length > 0 && (
                      <Pressable
                        style={{ padding: 15 }}
                        onPress={() =>
                          navigation.navigate('BulletinDetail', {
                            postId: favorite?.postId,
                            url: favorite?.redirectUrl,
                          })
                        }
                      >
                        <View
                          style={{
                            height: 100,
                            backgroundColor: '#F8CE46',
                            borderRadius: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            padding: 20,
                          }}
                        >
                          <Image source={star} />
                          <Text
                            style={{
                              fontSize: 18,
                              fontFamily: 'work-sans-semibold',
                              color: Colors.primaryColor,
                              paddingHorizontal: 15,
                              width: '85%',
                            }}
                            numberOfLines={2}
                          >
                            {favorite?.title || ''}
                          </Text>
                          <Ionicons name="ios-arrow-forward" size={25} color={Colors.primaryColor} />
                        </View>
                      </Pressable>
                    )}

                    <View
                      style={{
                        backgroundColor: '#fff',
                        width: '100%',
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          margin: 30,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: 'work-sans-semibold',
                            fontWeight: '600',
                            color: Colors.primaryColor,
                            fontSize: 27,
                            textAlign: 'center',
                          }}
                        >
                          {i18n.t('GALLERY.PHOTOS')}
                        </Text>
                        <Pressable
                          style={{
                            width: 30,
                            height: 30,
                            alignItems: 'center',
                          }}
                          onPress={() => navigation.navigate('Gallery')}
                        >
                          <Ionicons name="md-add" size={30} color={Colors.primaryColor} />
                        </Pressable>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          overflow: 'hidden',
                        }}
                      >
                        <CustomSlider data={photos || []} navigation={navigation} />
                      </View>

                      <Pressable
                        onPress={() => navigation.navigate('Photos')}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: 28,
                          marginBottom: 25,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: 'work-sans-semibold',
                            fontWeight: '600',
                            fontSize: 15,
                            color: '#0104AC',
                            marginRight: 20,
                          }}
                        >
                          {i18n.t('GALLERY.SEE_ALL')}
                        </Text>
                        <Ionicons name="ios-arrow-forward" size={23} color="#0104AC" />
                      </Pressable>

                      <View
                        style={{
                          borderBottomColor: '#F2F3FF',
                          borderBottomWidth: StyleSheet.hairlineWidth,
                          width: '90%',
                        }}
                      />
                    </View>

                    <RemindersHeaders
                      reminders={reminders || []}
                      selectedHeader={selectedReminder}
                      onChangeSelectedHeader={(index) => setSelectedReminder(index)}
                      navigation={navigation}
                    />
                  </>
                ) : (
                  <View style={styles.screenLoading}>
                    <ActivityIndicator style={{ height: windowHeight }} size="large" color={Colors.primaryColor} />
                  </View>
                )}

                <SnackBar visible={visible} onDismiss={() => setVisible(false)}>
                  {snackMsg}
                </SnackBar>
              </View>
            }
          />
        );
      }}
    </I18nContext.Consumer>
  );
};

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default HomeScreen;
