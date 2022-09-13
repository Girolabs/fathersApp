import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, ScrollView, Image, Modal } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import i18n from 'i18n-js';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as Network from 'expo-network';
import 'moment/min/locales';
import { NavigationEvents, navigation } from 'react-navigation';
import * as ScreenOrientation from 'expo-screen-orientation';
import SnackBar from '../components/SnackBar';
import Colors from '../constants/Colors';
import HeaderButton from '../components/HeaderButton';
import { I18nContext } from '../context/I18nProvider';
import { getReminders } from '../api';
import RemindersHeaders from '../components/RemindersHeaders';
import { BulletinCheckContext } from '../context/BulletinCheckProvider';
import { Pressable } from 'react-native';
import { Ionicons, Foundation } from 'expo-vector-icons';
import bishopLogo from '../../assets/img/bishop.png';
import person from '../../assets/img/person.png';
import fatherIcon from '../../assets/img/fatherIcon.png';
import CustomSlider from '../components/CarouselSlider';
import data from '../data/data';
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
  const [photoModal, setPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showComments, setShowComments] = useState(false);

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
  }, []);

  return (
    <I18nContext.Consumer>
      {(value) => {
        moment.locale(value.lang);
        console.log(moment.locale());

        return (
          <ScrollView nestedScrollEnabled={true}>
            <View style={styles.screen}>
              <NavigationEvents
                onDidFocus={() => {
                  loadReminders();
                  checkOnly();
                }}
              />
              {photoModal ? (
                <Modal>
                  <Pressable
                    style={{
                      margin: 10,
                      width: 25,
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                    onPress={() => setPhotoModal(false)}
                  >
                    <Ionicons name="ios-arrow-back" size={24} />
                  </Pressable>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      //backgroundColor: Colors.onSurfaceColorPrimary,
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <Image
                      style={{
                        backgroundColor: Colors.onSurfaceColorSecondary,
                        width: 350,
                        height: 350,
                        borderRadius: 8,
                      }}
                      source={selectedPhoto}
                    />
                  </View>
                </Modal>
              ) : null}
              {!loading ? (
                <>
                  <RemindersHeaders
                    reminders={reminders}
                    selectedHeader={selectedReminder}
                    onChangeSelectedHeader={(index) => setSelectedReminder(index)}
                  />
                  <View
                    style={{
                      backgroundColor: '#B6B6D9',
                      marginTop: 20,
                      borderRadius: 8,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        margin: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'work-sans-semibold',
                          fontWeight: 'bold',
                          color: Colors.primaryColor,
                          fontSize: 15,
                          textAlign: 'center',
                          letterSpacing: 2.5,
                          textTransform: 'uppercase',
                        }}
                      >
                        Photos <Ionicons name="md-images" size={20} />
                      </Text>
                      <Pressable
                        style={{
                          width: 23,
                        }}
                        onPress={() => {
                          navigation.navigate('Gallery');
                        }}
                      >
                        <Ionicons name="md-add" size={23} color={Colors.primaryColor} />
                      </Pressable>
                    </View>
                    <View
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        overflow: 'hidden',
                      }}
                    >
                      <CustomSlider data={data} />
                      {/*<Pressable
                        style={{ width: '30%', height: 100, backgroundColor: '#fff', borderRadius: 8 }}
                        onPress={() => {
                          setPhotoModal(!photoModal);
                          setSelectedPhoto(bishopLogo);
                        }}
                      >
                        <Image source={bishopLogo} style={{ width: '100%', height: '100%' }} />
                      </Pressable>
                      <Pressable
                        style={{ width: '30%', height: 100, backgroundColor: '#fff', borderRadius: 8 }}
                        onPress={() => {
                          setPhotoModal(!photoModal);
                          setSelectedPhoto(person);
                        }}
                      >
                        <Image source={person} style={{ width: '100%', height: '100%' }} />
                      </Pressable>
                      <Pressable
                        style={{
                          width: '30%',
                          height: 100,
                          backgroundColor: Colors.onSurfaceColorPrimary,
                          borderRadius: 8,
                        }}
                        onPress={() => {
                          setPhotoModal(!photoModal);
                          setSelectedPhoto(fatherIcon);
                        }}
                      >
                        <Image source={fatherIcon} style={{ width: '100%', height: '100%' }} />
                      </Pressable>*/}
                    </View>
                    <Pressable
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        margin: 20,
                      }}
                      onPress={() => setShowComments(!showComments)}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: Colors.primaryColor,
                          fontWeight: 'bold',
                          marginRight: 10,
                        }}
                      >
                        Comments
                      </Text>
                      <Foundation name="comments" size={25} color={Colors.primaryColor} />
                    </Pressable>
                    {showComments ? (
                      <View style={{ marginBottom: 20 }}>
                        <View
                          style={{
                            width: '90%',
                            height: 'auto',
                            backgroundColor: '#F2F3FF',
                            borderRadius: 8,
                            marginBottom: 5,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              color: '#292929',
                              paddingVertical: 10,
                              paddingHorizontal: 20,
                            }}
                          >
                            Comentario
                          </Text>
                        </View>
                        <View
                          style={{
                            width: '90%',
                            height: 'auto',
                            backgroundColor: '#F2F3FF',
                            borderRadius: 8,
                            marginVertical: 5,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              color: '#292929',
                              paddingVertical: 10,
                              paddingHorizontal: 20,
                            }}
                          >
                            ComentarioComentarioComentarioComentarioComentarioComentarioComentarioComentarioComentarioComentarioComentarioComentarioComentarioComentarioComentario
                          </Text>
                        </View>
                        <View
                          style={{
                            width: '90%',
                            height: 'auto',
                            backgroundColor: '#F2F3FF',
                            borderRadius: 8,
                            marginVertical: 5,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              color: '#292929',
                              paddingVertical: 10,
                              paddingHorizontal: 20,
                            }}
                          >
                            ComentarioComentarioComentarioComentarioComentarioComentarioComentario
                          </Text>
                        </View>
                      </View>
                    ) : null}
                  </View>
                </>
              ) : (
                <View style={styles.screenLoading}>
                  <ActivityIndicator size="large" color={Colors.primaryColor} />
                </View>
              )}
              <SnackBar visible={visible} onDismiss={() => setVisible(false)}>
                {snackMsg}
              </SnackBar>
            </View>
          </ScrollView>
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
