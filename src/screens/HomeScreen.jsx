import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Platform,
  TouchableNativeFeedback,
  Linking,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Ionicons } from 'expo-vector-icons';
import Constants from 'expo-constants';
import i18n from 'i18n-js';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Flag } from 'react-native-svg-flagkit';
import * as Network from 'expo-network';
import axios from '../../axios-instance';
import 'moment/min/locales';
import Colors from '../constants/Colors';
import HeaderButton from '../components/HeaderButton';
import { I18nContext } from '../context/I18nProvider';
import { Snackbar } from 'react-native-paper';
import { setDetectionImagesAsync } from 'expo/build/AR';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 15,
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
    fontSize: 22,
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
    marginTop: 15,
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
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');

  let TouchableComp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  useEffect(async () => {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected === true) {
      axios
        .get(`${i18n.locale}/api/v1/date-tiles?daysInAdvance=8&key=${Constants.manifest.extra.secretKey}`)
        .then((res) => {
          console.log(res.data.result);
          const fetchedReminders = res.data.result;
          setReminders(fetchedReminders);
          setLoading(false);
        });
    } else {
      setVisible(true);
      setSnackMsg(i18n.t(i18n.t('GENERAL.NO_INTERNET')));
    }
  }, []);
  console.log('render: HomeScreen');
  return (
    <I18nContext.Consumer>
      {(value) => (
        <View style={styles.screen}>
          {!loading ? (
            <>
              <TouchableComp
                onPress={() => {
                  navigation.navigate('Prayers');
                  /*  console.log('El idioma', lang); */
                }}
              >
                <View style={styles.prayerCard}>
                  <Text style={styles.prayerCardTitle}> {i18n.t('HOME_SCREEN.COMMUNITY_PRAYER')}</Text>
                  <Ionicons name="ios-arrow-forward" size={23} color={Colors.primaryColor} />
                </View>
              </TouchableComp>

              <TouchableComp
                onPress={() => {
                  navigation.navigate('Miscellaneous');
                }}
              >
                <View style={styles.prayerCard}>
                  <Text style={styles.prayerCardTitle}> {i18n.t('HOME_SCREEN.MISC')}</Text>
                  <Ionicons name="ios-arrow-forward" size={23} color={Colors.primaryColor} />
                </View>
              </TouchableComp>

              <Text style={styles.title}>{i18n.t('HOME_SCREEN.REMINDERS')}</Text>

              <FlatList
                data={reminders.slice(0, 4)}
                renderItem={({ item, index }) => {
                  moment.locale(value.lang);
                  const date = moment.utc(item[0].date).format('dddd,  Do MMMM YYYY');

                  return (
                    <View>
                      {item[0].isImportant ? (
                        <TouchableComp
                          style={{ flex: 1, marginBottom: 15 }}
                          onPress={() => {
                            if (selectedReminder == null) {
                              setSelectedReminder(index);
                            } else if (selectedReminder === index) {
                              setSelectedReminder(null);
                            } else {
                              setSelectedReminder(index);
                            }
                          }}
                        >
                          <View style={styles.reminderImportantHeader}>
                            <View style={{ flexDirection: 'row' }}>
                              <Ionicons name="ios-calendar" size={23} color={Colors.surfaceColorPrimary} />
                              <Text style={styles.reminderHeaderTitle}>
                                {`${item[0].text} ${item[0].importantText.replace('%s', item[0].yearsAgo)} `}
                              </Text>
                            </View>
                            {selectedReminder === index ? (
                              <Ionicons name="md-arrow-dropup" size={23} color={Colors.surfaceColorPrimary} />
                            ) : (
                              <Ionicons name="md-arrow-dropdown" size={23} color={Colors.surfaceColorPrimary} />
                            )}
                          </View>
                        </TouchableComp>
                      ) : (
                        <TouchableComp
                          style={{ flex: 1 }}
                          onPress={() => {
                            if (selectedReminder == null) {
                              setSelectedReminder(index);
                            } else if (selectedReminder === index) {
                              setSelectedReminder(null);
                            } else {
                              setSelectedReminder(index);
                            }
                          }}
                        >
                          <View style={styles.reminderHeader}>
                            <View style={{ flexDirection: 'row' }}>
                              <Ionicons name="ios-calendar" size={23} color={Colors.surfaceColorPrimary} />
                              <Text style={styles.reminderHeaderTitle}>{date}</Text>
                            </View>

                            {selectedReminder === index ? (
                              <Ionicons name="md-arrow-dropup" size={23} color={Colors.surfaceColorPrimary} />
                            ) : (
                              <Ionicons name="md-arrow-dropdown" size={23} color={Colors.surfaceColorPrimary} />
                            )}
                          </View>
                        </TouchableComp>
                      )}
                      {selectedReminder === index && (
                        <FlatList
                          data={item}
                          renderItem={({ item }) => (
                            <View style={styles.reminderListItem}>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {item.entityCountry != null ? (
                                  <Flag id={item.entityCountry} size={0.1} />
                                ) : (
                                  <Ionicons name="ios-flag" size={23} color={Colors.onSurfaceColorSecondary} />
                                )}
                                <View style={{ marginLeft: 15 }}>
                                  {item.isImportant ? (
                                    <Text style={{ fontFamily: 'work-sans', fontSize: 15 }}>{date}</Text>
                                  ) : (
                                    <Text style={{ fontFamily: 'work-sans', fontSize: 15 }}>{item.text}</Text>
                                  )}

                                  <TouchableComp
                                    onPress={() => {
                                      navigation.navigate('PatreDetail', { fatherId: item.entityObject.personId });
                                    }}
                                  >
                                    <Text
                                      style={{
                                        fontFamily: 'work-sans-semibold',
                                        fontSize: 12,
                                      }}
                                    >
                                      {item.entityName}
                                    </Text>
                                  </TouchableComp>
                                </View>
                              </View>

                              {item.entityObject.phones !== undefined &&
                                item.entityObject.phones.length > 0 &&
                                item.entityObject.phones[0].whatsApp && (
                                  <TouchableComp
                                    onPress={() => {
                                      Linking.openURL(
                                        `http://api.whatsapp.com/send?phone=${item.entityObject.phones[0].number}`,
                                      );
                                    }}
                                  >
                                    <Ionicons name="logo-whatsapp" size={23} color={Colors.onSurfaceColorSecondary} />
                                  </TouchableComp>
                                )}
                            </View>
                          )}
                        />
                      )}
                    </View>
                  );
                }}
              />
            </>
          ) : (
            <ActivityIndicator size="large" color={Colors.primaryColor} />
          )}
          <Snackbar visible={visible} onDismiss={this._onDismissSnackBar} style={styles.snackError}>
            {snackMsg}
          </Snackbar>
        </View>
      )}
    </I18nContext.Consumer>
  );
};

HomeScreen.navigationOptions = (navigationData) => ({
  headerTitle: '',
  headerLeft: (
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
});

HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default HomeScreen;
