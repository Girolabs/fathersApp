import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Image, FlatList, useWindowDimensions } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import i18n from 'i18n-js';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as Network from 'expo-network';
import 'moment/min/locales';
import { NavigationEvents } from 'react-navigation';
import * as ScreenOrientation from 'expo-screen-orientation';
import SnackBar from '../components/SnackBar';
import Colors from '../constants/Colors';
import HeaderButton from '../components/HeaderButton';
import { I18nContext } from '../context/I18nProvider';
import { getLastPhotos, getPhoto, getPhotos, getReminders } from '../api';
import RemindersHeaders from '../components/RemindersHeaders';
import { BulletinCheckContext } from '../context/BulletinCheckProvider';
import { Pressable } from 'react-native';
import { Ionicons } from 'expo-vector-icons';
import star from '../../assets/star.png';
import { CustomSlider } from '../components/CarouselSlider';
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.surfaceColorPrimary,
    marginBottom: 15,
  },
  screenLoading: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.surfaceColorPrimary,
    justifyContent: 'center',
  },
  prayerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.secondaryColor,
    width: '100%',
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
  },
  prayerCardTitle: {
    fontFamily: 'work-sans-semibold',
    fontSize: 18,
    color: Colors.primaryColor,
  },
  title: {
    color: Colors.primaryColor,
    fontFamily: 'work-sans-semibold',
    fontSize: 28,
    marginTop: 5,
    padding: 20,
  },
  reminderHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.primaryColor,
    borderRadius: 15,
    marginTop: 5,
  },
  reminderHeaderTitle: {
    color: Colors.surfaceColorPrimary,
    fontSize: 15,
    marginLeft: 10,
    fontFamily: 'work-sans-medium',
    width: '85%',
  },
  reminderImportantHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.secondaryColor,
    borderRadius: 15,
    marginTop: 5,
  },
  reminderListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceColorPrimary,
    backgroundColor: Colors.surfaceColorSecondary,
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
  const { unseenPostsCount, markCheckUnseenCounter, checkOnly } = useContext(BulletinCheckContext);
  const [photos, setPhotos] = useState([]);

  const loadReminders = async () => {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected) {
      setLoading(true);
      //pasar fecha de hoy como parametro en getReminders
      const startDate = new Date().toISOString().split('T')[0];
      getReminders(startDate)
        .then((res) => {
          const fetchedReminders = res.data.result.slice(0, 6);
          setReminders(fetchedReminders);
        })
        .catch(() => {
          setVisible(true);
          setSnackMsg(i18n.t('GENERAL.ERROR'));
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setVisible(true);
      setSnackMsg(i18n.t('GENERAL.NO_INTERNET'));
    }
  };

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    loadReminders();
    getLastPhotos().then((res) => {
      setPhotos(res.data.result);
      console.log('LAST 3', res.data.result);
    });
    getPhoto(4).then((res) => console.log('PHOTO ID', res.data.result));
    getPhotos().then((res) => console.log('ALL PHOTOS', res.data.result));
  }, []);

  const windowHeight = useWindowDimensions().height;

  return (
    <I18nContext.Consumer>
      {(value) => {
        moment.locale(value.lang);
        console.log(moment.locale());

        return (
          <FlatList
            ListHeaderComponent={
              <>
                <View style={styles.screen}>
                  <NavigationEvents
                    onDidFocus={() => {
                      loadReminders();
                      checkOnly();
                    }}
                  />
                  {!loading ? (
                    <Pressable
                      onPress={() =>
                        navigation.navigate('BulletinDetail', {
                          postId: 5,
                          favorite: true,
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
                        >
                          Oración de la Comunidad
                        </Text>
                        <Ionicons name="ios-arrow-forward" size={25} color={Colors.primaryColor} />
                      </View>
                      <RemindersHeaders
                        reminders={reminders}
                        selectedHeader={selectedReminder}
                        onChangeSelectedHeader={(index) => setSelectedReminder(index)}
                      />
                    </Pressable>
                  ) : (
                    <View style={styles.screenLoading}>
                      <ActivityIndicator
                        style={{
                          height: windowHeight,
                        }}
                        size="large"
                        color={Colors.primaryColor}
                      />
                    </View>
                  )}
                  <SnackBar visible={visible} onDismiss={() => setVisible(false)}>
                    {snackMsg}
                  </SnackBar>
                </View>
              </>
            }
            ListFooterComponent={
              <>
                {!loading ? (
                  <View
                    style={{
                      backgroundColor: '#fff',
                      marginTop: 20,
                      width: '100%',
                      height: '100%',
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
                        onPress={() => {
                          navigation.navigate('Gallery');
                        }}
                      >
                        <Ionicons name="md-add" size={30} color={Colors.primaryColor} fontWeight="700" />
                      </Pressable>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        overflow: 'hidden',
                      }}
                    >
                      <CustomSlider data={photos} />
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
                ) : null}
              </>
            }
          ></FlatList>
        );
      }}
    </I18nContext.Consumer>
  );
};

HomeScreen.navigationOptions = (navigationData) => ({
  headerTitle: '',
  headerRight: () => (
    <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item
        title="Menu"
        iconName="md-menu"
        onPress={() => {
          navigationData.navigation.toggleDrawer();
        }}
      />
    </HeaderButtons>
  ),
  headerBackTitle: i18n.t('GENERAL.BACK'),
});

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default HomeScreen;
