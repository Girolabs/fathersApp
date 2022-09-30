import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Platform,
  Pressable,
} from 'react-native';
import i18n from 'i18n-js';
import { FlatList } from 'react-native-gesture-handler';
import { Flag } from 'react-native-svg-flagkit';
import Colors from '../constants/Colors';
import moment from 'moment';
import 'moment/min/locales';
import { I18nContext } from '../context/I18nProvider';
import * as Network from 'expo-network';
import SnackBar from '../components/SnackBar';
import { getTerritory } from '../api';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import { FontAwesome5 } from '@expo/vector-icons';
import IdealStatement from '../components/IdealStatement';
import { getDateMaskByLocale, getDateFormatByLocale } from '../utils/date-utils';
import { Ionicons } from 'expo-vector-icons';
import pencil from '../../assets/editpencil.png';

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
  listItemBodyInactive: {
    fontFamily: 'work-sans',
    fontSize: 12,
    color: '#B6B6D9',
  },
  listItemBodyBlack: {
    fontFamily: 'work-sans-semibold',
    fontSize: 12,
    color: Colors.onSurfaceColorPrimary,
  },
  listItemBodyBlackInactive: {
    fontFamily: 'work-sans-semibold',
    fontSize: 12,
    color: '#B6B6D9',
  },
  listItemBodyBlue: {
    fontFamily: 'work-sans-semibold',
    fontWeight: '600',
    fontSize: 15,
    color: '#0104AC',
  },
  listItemBodyBlueInactive: {
    fontFamily: 'work-sans-semibold',
    fontWeight: '600',
    fontSize: 15,
    color: '#B6B6D9',
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
    width: '50%',
  },
  cardBodyTextBold: {
    color: Colors.surfaceColorSecondary,
    fontSize: 15,
    fontFamily: 'work-sans-semibold',
    textAlign: 'left',
    width: '50%',
  },
  fatherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceColorPrimary,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceColorSecondary,
    padding: 15,
    borderBottomColor: Colors.onSurfaceColorSecondary,
    borderBottomWidth: 0.5,
  },
  statsText: {
    marginLeft: 16,
    color: Colors.onSurfaceColorPrimary,
    paddingVertical: 10,
    fontFamily: 'work-sans-medium',
  },
  snackError: {
    backgroundColor: Colors.secondaryColor,
  },
});

class DelegationDetailScreen extends Component {
  state = {
    territory: null,
    showHistorical: false,
    assignments: [],
    filiations: [],
  };

  loadTerritory = (territoryId, fields) => {
    getTerritory(territoryId, fields)
      .then((res) => {
        const fetchedDelegation = {
          ...res.data.result,
          homeTerritoryMembers: res.data.result.homeTerritoryMembers.filter(
            (member) => member.isActive == true && member.isMember == true,
          ),
        };
        const fetchedAssignments =
          fetchedDelegation.assignments && fetchedDelegation.assignments.filter((asg) => asg.isActive);

        const fetchedActiveFiliations = fetchedDelegation.filiations.filter((filiation) => filiation.isActive);
        this.setState({
          territory: fetchedDelegation,
          assignments: fetchedAssignments,
          filiations: fetchedActiveFiliations,
        });
      })
      .catch((err) => {
        this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false });
      });
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const territoryId = navigation.getParam('delegationId');
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected === true) {
      this.loadTerritory(territoryId, 'all');
    } else {
      this.setState({ snackMsg: i18n.t('GENERAL.NO_INTERNET'), visible: true, loading: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showHistorical != this.state.showHistorical) {
      if (this.state.territory) {
        if (!this.state.showHistorical) {
          const activeAsg = this.state.territory.assignments.filter((asg) => asg.isActive);
          this.setState({ assignments: activeAsg });
        } else {
          this.setState({ assignments: this.state.territory.assignments });
        }
      }
    }
  }

  render() {
    let TouchableComp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
      TouchableComp = TouchableNativeFeedback;
    }
    const { navigation } = this.props;
    const { territory, showHistorical, assignments, filiations } = this.state;
    return (
      <I18nContext.Consumer>
        {(value) => {
          const dateMask = getDateMaskByLocale(value.lang);
          const dateFormat = getDateFormatByLocale(value.lang);
          moment.locale(value.lang);
          return (
            <SafeAreaView style={styles.screen}>
              {territory ? (
                <FlatList
                  keyExtractor={(item) => item.personId.toString()}
                  ListHeaderComponent={
                    <>
                      <View style={styles.titleContainer}>
                        <Text style={styles.title}>{territory.name}</Text>
                      </View>
                      <View>
                        <Text style={styles.sectionHeader}>{i18n.t('TERRITORY_DETAIL.TERRITORY_INFO')}</Text>
                        {territory.parentTerritory && (
                          <TouchableComp
                            onPress={() => {
                              console.log('apreto', territory.parentTerritory.territoryId);
                              navigation.push('DelegationDetail', {
                                delegationId: territory.parentTerritory.territoryId,
                              });
                            }}
                          >
                            <View style={styles.listItem}>
                              <Text style={styles.listItemTitle}>{i18n.t('TERRITORY_DETAIL.TERRITORY_CHARGE')}</Text>
                              <Text style={styles.listItemBody}>{territory.parentTerritory.name}</Text>
                            </View>
                          </TouchableComp>
                        )}
                        {territory.celebrationDate && (
                          <View style={styles.listItem}>
                            <Text style={styles.listItemTitle}>{i18n.t('TERRITORY_DETAIL.CELEBRATION_DATE')}</Text>
                            <Text style={styles.listItemBody}>
                              {moment.utc(territory.celebrationDate).format(dateFormat)}
                            </Text>
                          </View>
                        )}
                        <IdealStatement
                          languages={territory.idealLanguages ? territory.idealLanguages : []}
                          recommendedLang={territory.recommendedIdealField}
                          navigation={navigation}
                          entity={territory}
                        />
                        <View style={[styles.listItem]}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.listItemTitle}>{i18n.t('TERRITORY_DETAIL.ASSIGNMENTS')}</Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: 70,
                                marginRight: '3%',
                              }}
                            >
                              <TouchableComp
                                onPress={() => {
                                  this.setState({ showHistorical: !showHistorical });
                                }}
                              >
                                <FontAwesome5
                                  name="history"
                                  size={24}
                                  color={showHistorical ? Colors.primaryColor : '#B6B6D9'}
                                />
                              </TouchableComp>
                              <Pressable
                                onPress={() => {
                                  navigation.navigate('AssigmentsForm', {
                                    entityName: territory.name,
                                    roles: territory.assignments.map((item) => ({
                                      name: item.roleTitle,
                                      value: item.roleId,
                                    })),
                                    entityId: territory.territoryId,
                                    isCreate: true,
                                  });
                                }}
                              >
                                <Ionicons name="md-add" size={30} color={Colors.primaryColor} fontWeight="700" />
                              </Pressable>
                            </View>
                          </View>
                          {assignments.map((asg) => {
                            return (
                              <TouchableComp
                                key={[asg.person.personId, asg.startDate]}
                                onPress={() => {
                                  navigation.navigate('PatreDetail', { fatherId: asg.person.personId });
                                }}
                              >
                                <View style={styles.fatherItem}>
                                  <Image
                                    source={{ uri: `https://schoenstatt-fathers.link${asg.person.photo}` }}
                                    style={{
                                      width: 50,
                                      height: 50,
                                      borderRadius: 25,
                                      marginRight: 10,
                                      borderWidth: 1,
                                      borderColor: asg.isActive ? '#292929' : '#B6B6D9',
                                    }}
                                  />
                                  <View style={{ flexDirection: 'column' }}>
                                    <Text
                                      style={asg.isActive ? styles.listItemBodyBlack : styles.listItemBodyBlackInactive}
                                    >
                                      {asg.roleTitle}
                                    </Text>
                                    <Text
                                      style={asg.isActive ? styles.listItemBodyBlue : styles.listItemBodyBlueInactive}
                                    >
                                      {asg.person.fullName}
                                    </Text>
                                    <Text style={asg.isActive ? styles.listItemBody : styles.listItemBodyInactive}>
                                      {`${moment.utc(asg.startDate).format(dateMask)} - ${moment
                                        .utc(asg.endDate)
                                        .format(dateMask)}`}
                                    </Text>
                                  </View>
                                  <Pressable
                                    style={{
                                      position: 'absolute',
                                      left: '90%',
                                      padding: 5,
                                    }}
                                    onPress={() => {
                                      navigation.navigate('AssigmentsForm', {
                                        entityName: territory.name,
                                        entityId: territory.territoryId,
                                        roleTitle: asg.roleTitle,
                                        roleId: asg.roleId,
                                        fatherId: asg.person.personId,
                                        isCreate: false,
                                        personName: asg.person.fullName,
                                      });
                                    }}
                                  >
                                    <Image source={pencil} />
                                  </Pressable>
                                </View>
                              </TouchableComp>
                            );
                          })}
                        </View>
                      </View>
                      <View styles={{ marginTop: 10, marginBottom: 5, backgroundColor: Colors.surfaceColorSecondary }}>
                        <Text style={styles.sectionHeader}>{i18n.t('TERRITORY_DETAIL.TERRITORY_FILIATION')}</Text>
                        <View>
                          {filiations.map((filiation) => {
                            return (
                              <TouchableComp
                                key={filiation.filiationId}
                                onPress={() => {
                                  navigation.navigate('FiliationDetail', { filiationId: filiation.filiationId });
                                }}
                              >
                                <View style={styles.card}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Flag id={filiation.country} size={0.1} />
                                    <Text style={styles.cardTitle}>{filiation.name}</Text>
                                  </View>

                                  <View style={styles.cardBody}>
                                    <Text style={styles.cardBodyText}>{i18n.t('TERRITORY_DETAIL.RECTOR')}</Text>
                                    <Text style={styles.cardBodyTextBold}>
                                      {filiation.mainAssignment ? filiation.mainAssignment.person.fullName : null}
                                    </Text>
                                  </View>
                                </View>
                              </TouchableComp>
                            );
                          })}
                        </View>
                      </View>
                      <Text style={styles.sectionHeader}>{i18n.t('TERRITORY_DETAIL.MEMBERS_OF_TERRITORY')}</Text>
                    </>
                  }
                  data={this.state.territory.homeTerritoryMembers}
                  renderItem={({ item }) => {
                    return (
                      <TouchableComp onPress={() => navigation.navigate('PatreDetail', { fatherId: item.personId })}>
                        <View style={styles.memberItem}>
                          <Image
                            source={{ uri: `https://schoenstatt-fathers.link${item.photo}` }}
                            style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}
                          />
                          <Text style={{ fontSize: 12, color: Colors.primaryColor, fontFamily: 'work-sans-semibold' }}>
                            {item.fullName}
                          </Text>
                        </View>
                      </TouchableComp>
                    );
                  }}
                  ListFooterComponent={
                    <>
                      <Text style={styles.statsText}> Total: {territory.statistics.total} </Text>
                      <Text style={styles.statsText}>
                        {' '}
                        {`${i18n.t('TERRITORY_DETAIL.PRIESTS')}: ${territory.statistics.livingPerpetual}`}{' '}
                      </Text>
                      <Text style={styles.statsText}>
                        {' '}
                        {`${i18n.t('TERRITORY_DETAIL.STUDENTS')}: ${territory.statistics.students}`}{' '}
                      </Text>
                      <Text style={styles.statsText}>
                        {' '}
                        {`${i18n.t('TERRITORY_DETAIL.DECEASED')}: ${territory.statistics.deceased}`}{' '}
                      </Text>
                    </>
                  }
                />
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

DelegationDetailScreen.navigationOptions = (navigationData) => ({
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

export default DelegationDetailScreen;
