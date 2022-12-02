import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Image,
} from 'react-native';
import { I18nContext } from '../context/I18nProvider';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import moment from 'moment';
import 'moment/min/locales';
import * as Network from 'expo-network';
import SnackBar from '../components/SnackBar';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import { getGeneration, getGenerations } from '../api';
import IdealStatement from '../components/IdealStatement';
import GenerationCourses from '../components/GenerationCourses';
import { getDateFormatByLocale, getDateMaskByLocale, getDateMaskForm } from '../utils/date-utils';
import pencil from '../../assets/editpencil.png';
import { Ionicons } from 'expo-vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.surfaceColorPrimary,
    flex: 1,
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
  },
  cardBody: {
    flexDirection: 'column',
    alignItems: 'flex-start',
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
  snackError: {
    backgroundColor: Colors.secondaryColor,
  },
});

class GenerationDetailScreen extends Component {
  state = {
    generation: {},
    generations: [],
    loading: true,
    showHistorical: false,
    hasAssignment: null,
  };

  loadGeneration = (generationId, fields) => {
    getGeneration(generationId, fields)
      .then((res) => {
        const generation = res.data.result;
        console.log('generacion', generation);
        this.setState({ generation: generation, loading: false });
      })
      .catch(() => {
        this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false });
      });
    /*getGenerations('all').then((resGenerations) => {
      let generations = resGenerations.data.result;
      let generationsAssignment = generations.map((asg) => {
        if (asg.name === this.state.generation.name && asg.mainAssignment.person.fullName !== undefined) {
          return true;
        } else {
          return false;
        }
      });
      console.log('aca', generationsAssignment);
      this.setState({ generations: generations, hasAssignment: generationsAssignment });
    });*/
  };
  async componentDidMount() {
    const { navigation } = this.props;
    const generationId = navigation.getParam('generationId');
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected) {
      this.loadGeneration(generationId, false);
    } else {
      this.setState({ snackMsg: i18n.t('GENERAL.NO_INTERNET'), visible: true, loading: false });
    }
  }
  render() {
    const { generation, generations, showHistorical, hasAssignment } = this.state;
    const { navigation } = this.props;
    let TouchableComp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
      TouchableComp = TouchableNativeFeedback;
    }

    return (
      <I18nContext.Consumer>
        {(value) => {
          const dateForm = getDateMaskForm(value.lang);
          const dateFormat = getDateFormatByLocale(value.lang);
          const dateMask = getDateMaskByLocale(moment.locale());
          moment.locale(value.lang);
          return (
            <SafeAreaView style={styles.screen}>
              {!this.state.loading ? (
                <ScrollView>
                  <View>
                    <View style={styles.titleContainer}>
                      <Text style={styles.title}>{generation.name}</Text>
                    </View>
                    <View>
                      <Text style={styles.sectionHeader}> {i18n.t('GENERATION.GENERATION_INFO')} </Text>
                      {generation.celebrationDate && (
                        <View style={styles.listItem}>
                          <Text style={styles.listItemTitle}> {i18n.t('GENERATION.CELEBRATION_DATE')} </Text>
                          <Text style={styles.listItemBody}>
                            {this.state.generation.celebrationDate
                              ? moment.utc(generation.celebrationDate).format(dateFormat)
                              : ''}
                          </Text>
                        </View>
                      )}

                      <View style={styles.listItem}>
                        <Text style={styles.listItemTitle}>{i18n.t('GENERATION.FOUNDATION_DATE')}</Text>
                        <Text style={styles.listItemBody}>
                          {generation.foundingDate ? moment.utc(generation.foundingDate).format(dateFormat) : ''}
                        </Text>
                      </View>
                      <IdealStatement
                        languages={generation ? generation.idealLanguages : []}
                        recommendedLang={generation.recommendedIdealField}
                        navigation={navigation}
                        entity={generation}
                      />
                      {generation.assignments.length > 0 ? (
                        <View>
                          <Text style={styles.sectionHeader}>{i18n.t('GENERAL.ASSIGNMENTS')}</Text>
                          <Pressable
                            style={{
                              width: 30,
                              height: 30,
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              position: 'absolute',
                              left: '75%',
                              top: 8,
                            }}
                            onPress={() => {
                              this.setState({ showHistorical: !showHistorical });
                            }}
                          >
                            <FontAwesome5
                              name="history"
                              size={24}
                              color={showHistorical ? Colors.primaryColor : '#B6B6D9'}
                            />
                          </Pressable>

                          <Pressable
                            style={{
                              width: 30,
                              height: 30,
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              position: 'absolute',
                              left: '88%',
                              top: 8,
                            }}
                            onPress={() => {
                              navigation.navigate('AssigmentsForm', {
                                entityName: generation.name,
                                roles: generation.assignments.map((item) => ({
                                  name: item.roleTitle,
                                  value: item.roleId,
                                })),
                                entityId: generation.generationId,
                                isCreate: true,
                              });
                            }}
                          >
                            <Ionicons name="md-add" size={30} color={Colors.primaryColor} fontWeight="700" />
                          </Pressable>

                          {generation.assignments.map((asg) => {
                            if (showHistorical ? asg : asg.isActive)
                              return (
                                <TouchableComp
                                  key={asg.assignmentId}
                                  onPress={() => {
                                    navigation.navigate('PatreDetail', {
                                      fatherId: asg.person.personId,
                                    });
                                  }}
                                >
                                  <View style={styles.listItem}>
                                    {/*<Text style={styles.listItemTitle}>{i18n.t('FILIAL_DETAIL.SUPERIOR')}</Text>*/}
                                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                      <Image
                                        source={{
                                          uri: `https://schoenstatt-fathers.link${asg.person.photo}`,
                                        }}
                                        style={{
                                          width: 50,
                                          height: 50,
                                          borderRadius: 25,
                                          marginRight: 10,
                                          borderWidth: 1,
                                          borderColor: asg.isActive ? '#292929' : '#B6B6D9',
                                        }}
                                      />

                                      <View>
                                        <Text
                                          style={
                                            asg.isActive ? styles.listItemBodyBlack : styles.listItemBodyBlackInactive
                                          }
                                        >
                                          {asg.roleTitle}
                                        </Text>
                                        <Text
                                          style={
                                            asg.isActive ? styles.listItemBodyBlue : styles.listItemBodyBlueInactive
                                          }
                                        >
                                          {asg.person.fullName}
                                        </Text>
                                        <Text style={asg.isActive ? styles.listItemBody : styles.listItemBodyInactive}>
                                          {/*`${moment.utc(asg.startDate).format(dateMask)}`*/}
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
                                          this.props.navigation.navigate('AssigmentsForm', {
                                            assignmentId: asg.assignmentId,
                                            entityName: generation.name,
                                            entityId: generation.generationId,
                                            roleTitle: asg.roleTitle,
                                            roleId: asg.roleId,
                                            fatherId: asg.person.personId,
                                            isCreate: false,
                                            personName: asg.person.fullName,
                                            startDate: asg.startDate
                                              ? moment.utc(asg.startDate).format(dateForm)
                                              : null,
                                            endDate: asg.endDate ? moment.utc(asg.endDate).format(dateForm) : null,
                                          });
                                        }}
                                      >
                                        <Image source={pencil} />
                                      </Pressable>
                                    </View>
                                  </View>
                                </TouchableComp>
                              );
                          })}
                        </View>
                      ) : null}
                      <GenerationCourses courses={generation.courses} />
                    </View>
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

GenerationDetailScreen.navigationOptions = (navigationData) => ({
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

export default GenerationDetailScreen;
