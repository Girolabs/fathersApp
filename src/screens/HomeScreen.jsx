import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, ScrollView, Image, Modal } from 'react-native';
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
import { getReminders } from '../api';
import RemindersHeaders from '../components/RemindersHeaders';
import { BulletinCheckContext } from '../context/BulletinCheckProvider';
import { Pressable } from 'react-native';
import { Ionicons } from 'expo-vector-icons';

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

const HomeScreen = () => {
  const [reminders, setReminders] = useState([]);
  const [selectedReminder, setSelectedReminder] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const { unseenPostsCount, markCheckUnseenCounter, checkOnly } = useContext(BulletinCheckContext);
  const [photoModal, setPhotoModal] = useState(false);

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
                      width: 23,
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                    onPress={() => setPhotoModal(false)}
                  >
                    <Ionicons name="ios-arrow-back" size={23} />
                  </Pressable>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'gray',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <Image
                      style={{
                        backgroundColor: 'blue',
                        width: 300,
                        height: 300,
                        borderRadius: 8,
                      }}
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
                      margin: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'work-sans-semibold',
                        color: Colors.primaryColor,
                        fontSize: 15,
                        textAlign: 'center',
                        letterSpacing: 2.5,
                        textTransform: 'uppercase',
                      }}
                    >
                      Últimas fotos subidas
                    </Text>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}
                  >
                    <Pressable
                      style={{ width: '30%', height: 100, backgroundColor: '#292929', borderRadius: 8 }}
                      onPress={() => setPhotoModal(!photoModal)}
                    >
                      <Image />
                    </Pressable>
                    <Pressable
                      style={{ width: '30%', height: 100, backgroundColor: '#292929', borderRadius: 8 }}
                      onPress={() => setPhotoModal(!photoModal)}
                    >
                      <Image />
                    </Pressable>
                    <Pressable
                      style={{ width: '30%', height: 100, backgroundColor: '#292929', borderRadius: 8 }}
                      onPress={() => setPhotoModal(!photoModal)}
                    >
                      <Image />
                    </Pressable>
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
