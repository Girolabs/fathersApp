import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  FlatList,
  TouchableNativeFeedback,
  Platform,
  Clipboard,
} from 'react-native';
import Colors from '../constants/Colors';
import { I18nContext } from '../context/I18nProvider';
import { Flag } from 'react-native-svg-flagkit';
import i18n from 'i18n-js';
import moment from 'moment';
import 'moment/min/locales';
import { ScrollView } from 'react-native-gesture-handler';
import countries from 'i18n-iso-countries';
import * as Network from 'expo-network';
import { Snackbar } from 'react-native-paper';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import { getHouse, getFiliation } from '../api';

countries.registerLocale(require('i18n-iso-countries/langs/en.json'));
countries.registerLocale(require('i18n-iso-countries/langs/es.json'));

class HouseDetailScreen extends Component {
  state = {
    house: null,
  };

  loadHouse = (houseId, fields) => {
    getHouse(houseId, fields)
      .then((resHouse) => {
        const house = resHouse.data.result;
        getFiliation(house.filiationId, fields)
          .then((resFiliation) => {
            const filiation = resFiliation.data.result;
            const membersHouse = filiation.persons
              .filter((person) => person.activeLivingSituation.houseId == house.houseId)
              .filter((person) => person.isActive == true && person.isMember == true);
            this.setState({ house: { ...house, membersHouse, filiationName: filiation.name } });
          })
          .catch(() => {
            this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false });
          });
      })
      .catch(() => {
        this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false });
      });
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const houseId = navigation.getParam('houseId');
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected) {
      this.loadHouse(houseId, false);
    } else {
      this.setState({ snackMsg: i18n.t('GENERAL.NO_INTERNET'), visible: true, loading: false });
    }
  }

  render() {
    const { navigation } = this.props;
    const { house } = this.state;
    let TouchableComp = TouchableOpacity;
    if (Platform.OS == 'android' && Platform.Version >= 21) {
      TouchableComp = TouchableNativeFeedback;
    }

    return (
      <I18nContext.Consumer>
        {(value) => {
          moment.locale(value.lang);
          return (
            <SafeAreaView>
              <ScrollView>
                {house ? (
                  <View style={styles.screen}>
                    <View style={styles.titleContainer}>
                      <View style={{ flexDirection: 'column', alignItems: 'flex-start', maxWidth: '80%' }}>
                        <Text style={styles.title}>{house.name}</Text>
                        {house.isMainFiliationHouse && (
                          <Text
                            style={{
                              backgroundColor: Colors.primaryColor,
                              color: Colors.surfaceColorSecondary,
                              borderRadius: 20,
                              padding: 10,
                            }}
                          >
                            {i18n.t('HOUSE_DETAIL.MAIN_HOUSE')}
                          </Text>
                        )}
                      </View>

                      <Flag id={house.country} size={0.2} />
                    </View>
                    <View>
                      <Text style={styles.sectionHeader}>{i18n.t('HOUSE_DETAIL.HOUSE_INFO')}</Text>
                      {/*  <View style={styles.listItem}>
                      <Text style={styles.listItemTitle}>{i18n.t('HOUSE_DETAIL.PHONE')}</Text>
                      <Text style={styles.listItemBody}>{house.}</Text>
                    </View> */}
                      <View style={styles.listItem}>
                        <TouchableComp
                          onPress={() => {
                            navigation.navigate('FiliationDetail', { filiationId: house.filialId });
                          }}
                        >
                          <View>
                            <Text style={styles.listItemTitle}>{i18n.t('HOUSE_DETAIL.FILIAL')}</Text>
                            <Text style={styles.listItemBody}>{house.filiationName}</Text>
                          </View>
                        </TouchableComp>
                      </View>
                      {house.fax && (
                        <TouchableComp
                          onPress={() => {
                            Clipboard.setString(house.fax);
                            this.setState({ snackMsg: i18n.t('GENERAL.COPY_CLIPBOARD'), visible: true });
                          }}
                        >
                          <View style={styles.listItem}>
                            <Text style={styles.listItemTitle}>{i18n.t('HOUSE_DETAIL.FAX')}</Text>
                            <Text style={styles.listItemBody}>{house.fax}</Text>
                          </View>
                        </TouchableComp>
                      )}

                      <View style={styles.listItem}>
                        <Text style={styles.listItemTitle}>{i18n.t('HOUSE_DETAIL.DIOCESE')}</Text>
                        <Text style={styles.listItemBody}>{house.diocese}</Text>
                      </View>
                      {house.email && (
                        <View style={styles.listItem}>
                          <Text style={styles.listItemTitle}>{i18n.t('HOUSE_DETAIL.EMAIL')}</Text>
                          <Text style={styles.listItemBody}>{house.email}</Text>
                        </View>
                      )}

                      <View style={styles.listItem}>
                        <Text style={styles.listItemTitle}>{i18n.t('HOUSE_DETAIL.ADDRESS')}</Text>
                        <Text style={styles.listItemBody}>{house.street1}</Text>
                        <Text style={styles.listItemBody}>{house.cityState}</Text>
                        <Text style={styles.listItemBody}>{countries.getName(house.country, value.lang)}</Text>
                      </View>
                      <Text style={styles.sectionHeader}>{i18n.t('HOUSE_DETAIL.MEMBERS')}</Text>
                      <FlatList
                        data={house.membersHouse}
                        renderItem={({ item }) => {
                          return (
                            <TouchableComp
                              onPress={() => navigation.navigate('PatreDetail', { fatherId: item.personId })}
                            >
                              <View style={styles.memberItem}>
                                <Image
                                  source={{ uri: `https://schoenstatt-fathers.link${item.photo}` }}
                                  style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}
                                />
                                <Text
                                  style={{ fontSize: 12, color: Colors.primaryColor, fontFamily: 'work-sans-semibold' }}
                                >
                                  {item.fullName}
                                </Text>
                              </View>
                            </TouchableComp>
                          );
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <ActivityIndicator size="large" color={Colors.primaryColor} />
                )}
                <Snackbar
                  visible={this.state.visible}
                  onDismiss={() => this.setState({ visible: false })}
                  style={styles.snackError}
                >
                  {this.state.snackMsg}
                </Snackbar>
              </ScrollView>
            </SafeAreaView>
          );
        }}
      </I18nContext.Consumer>
    );
  }
}
HouseDetailScreen.navigationOptions = (navigationData) => ({
  headerTitle: '',
  headerRight: (
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

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.surfaceColorPrimary,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: 'work-sans-semibold',
    fontSize: 27,
    color: Colors.primaryColor,
    marginRight: 10,
  },
  sectionHeader: {
    fontFamily: 'work-sans-medium',
    color: Colors.onSurfaceColorPrimary,
    fontSize: 11,
    padding: 15,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    backgroundColor: Colors.surfaceColorPecondary,
  },
  listItem: {
    backgroundColor: Colors.surfaceColorSecondary,
    padding: 15,
  },
  listItemTitle: {
    fontFamily: 'work-sans-semibold',
    fontSize: 18,
    color: Colors.onSurfaceColorPrimary,
  },
  listItemBody: {
    fontFamily: 'work-sans',
    fontSize: 12,
    color: Colors.onSurfaceColorPrimary,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceColorSecondary,
    padding: 15,
    borderBottomColor: Colors.onSurfaceColorSecondary,
    borderBottomWidth: 0.5,
  },
  snackError: {
    backgroundColor: Colors.secondaryColor,
  },
});

export default HouseDetailScreen;
