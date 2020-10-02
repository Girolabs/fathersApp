import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  FlatList,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';
import { I18nContext } from '../context/I18nProvider';
import i18n from 'i18n-js';
import { ScrollView } from 'react-native-gesture-handler';
import { Flag } from 'react-native-svg-flagkit';
import moment from 'moment';
import 'moment/min/locales';
import * as Network from 'expo-network';
import SnackBar from '../components/SnackBar';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import { getFiliation } from '../api';
import FiliationHouses from '../components/FiliationHouses';

class FiliationDetailScreen extends Component {
  state = {
    filiation: null,
  };

  loadFiliation = (filiationId, fields) => {
    getFiliation(filiationId, fields)
      .then((res) => {
        const fetchedFiliation = {
          ...res.data.result,
          persons: res.data.result.persons.filter((person) => person.isActive == true && person.isMember == true),
        };
        this.setState({ filiation: fetchedFiliation });
      })
      .catch((err) => {
        this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false });
      });
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const filiationId = navigation.getParam('filiationId');
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected) {
      this.loadFiliation(filiationId, false);
    } else {
      this.setState({ snackMsg: i18n.t('GENERAL.NO_INTERNET'), visible: true, loading: false });
    }
  }
  render() {
    const { navigation } = this.props;
    const { filiation } = this.state;
    let TouchableComp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
      TouchableComp = TouchableNativeFeedback;
    }
    return (
      <I18nContext.Consumer>
        {(value) => {
          moment.locale(value.lang);
          return (
            <SafeAreaView style={styles.screen}>
              {filiation ? (
                <ScrollView>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>{filiation.name}</Text>
                    <Flag id={filiation.country} size={0.2} />
                  </View>
                  <View>
                    <Text style={styles.sectionHeader}>{i18n.t('FILIAL_DETAIL.FILIAL_INFO')}</Text>
                    <TouchableComp
                      onPress={() => {
                        navigation.navigate('DelegationDetail', { delegationId: filiation.territory.territoryId });
                      }}
                    >
                      <View style={styles.listItem}>
                        <Text style={styles.listItemTitle}>{i18n.t('FILIAL_DETAIL.TERRITORY')}</Text>
                        <Text style={styles.listItemBody}>{filiation.territory.name}</Text>
                      </View>
                    </TouchableComp>
                    {filiation.mainAssignment && (
                      <TouchableComp
                        onPress={() => {
                          navigation.navigate('PatreDetail', {
                            fatherId: filiation.mainAssignment.person.personId,
                          });
                        }}
                      >
                        <View style={styles.listItem}>
                          <Text style={styles.listItemTitle}>{i18n.t('FILIAL_DETAIL.SUPERIOR')}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                            <Image
                              source={{
                                uri: `https://schoenstatt-fathers.link${filiation.mainAssignment.person.photo}`,
                              }}
                              style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
                            />

                            <View>
                              <Text style={styles.listItemBody}>{filiation.mainAssignment.roleTitle}</Text>
                              <Text style={styles.listItemBody}>{filiation.mainAssignment.person.fullName}</Text>
                              <Text style={styles.listItemBody}>
                                {`${
                                  filiation.mainAssignment.startDate
                                    ? moment.utc(filiation.mainAssignment.startDate).format('Do MMMM YYYY')
                                    : ''
                                } ${
                                  filiation.mainAssignment.endDate
                                    ? moment.utc(filiation.mainAssignment.endDate).format('Do MMMM YYYY')
                                    : ''
                                }`}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableComp>
                    )}
                  </View>
                  <FiliationHouses houses={filiation.houses.filter((house) => house.isActive)} />
                  <View>
                    <Text style={styles.sectionHeader}>{i18n.t('FILIAL_DETAIL.MEMBERS')}</Text>
                    <FlatList
                      data={filiation.persons}
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
                                style={{
                                  fontSize: 12,
                                  color: Colors.primaryColor,
                                  fontFamily: 'work-sans-semibold',
                                }}
                              >
                                {item.fullName}
                              </Text>
                            </View>
                          </TouchableComp>
                        );
                      }}
                    />
                  </View>
                </ScrollView>
              ) : (
                <ActivityIndicator size="large" color={Colors.primaryColor} />
              )}

              <SnackBar visible={this.state.visible} onDismiss={() => this.setState({ visible: false })}>
                {this.state.snackMsg}
              </SnackBar>
            </SafeAreaView>
          );
        }}
      </I18nContext.Consumer>
    );
  }
}

FiliationDetailScreen.navigationOptions = (navigationData) => ({
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
  headerBackTitle: i18n.t('GENERAL.BACK'),
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.surfaceColorPrimary,
    justifyContent: 'center',
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
    width: '80%',
  },
  sectionHeader: {
    fontFamily: 'work-sans-medium',
    color: Colors.onSurfaceColorPrimary,
    fontSize: 11,
    padding: 15,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    backgroundColor: Colors.surfaceColorPrimary,
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
  card: {
    width: '90%',
    marginLeft: 15,
    marginVertical: 15,
    padding: 15,
    backgroundColor: Colors.primaryColor,
    borderRadius: 5,
  },
  cardTitle: {
    color: Colors.surfaceColorSecondary,
    fontSize: 18,
    fontFamily: 'work-sans-semibold',
    marginLeft: 10,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Colors.onSurfaceColorSecondary,
    borderBottomWidth: 0.5,
    paddingVertical: 10,
  },
  cardBodyText: {
    color: Colors.surfaceColorSecondary,
    fontSize: 15,
    fontFamily: 'work-sans',
    marginLeft: 10,
    width: '80%',
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
export default FiliationDetailScreen;
