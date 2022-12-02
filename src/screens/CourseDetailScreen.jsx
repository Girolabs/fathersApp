import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  TouchableNativeFeedback,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import Constants from 'expo-constants';
import { I18nContext } from '../context/I18nProvider';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import moment from 'moment';
import 'moment/min/locales';
import { Flag } from 'react-native-svg-flagkit';

import * as Network from 'expo-network';
import SnackBar from '../components/SnackBar';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import { getCourse, getPerson } from '../api';
import IdealStatement from '../components/IdealStatement';
import { getDateMaskByLocale, getDateFormatByLocale, getDateMaskForm } from '../utils/date-utils';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from 'expo-vector-icons';
import pencil from '../../assets/editpencil.png';
import { Ionicons } from 'expo-vector-icons';

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
    textAlign: 'left',
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

class CourseDetailScreen extends Component {
  state = {
    course: null,
    showHistorical: false,
  };

  loadCourse = (courseId, fields) => {
    getCourse(courseId, fields)
      .then((res) => {
        let course = res.data.result;
        this.setState({ course });
        if (course.leaderAssignment) {
          getPerson(course.leaderAssignment.personId, false)
            .then((respPerson) => {
              const person = respPerson.data.result;
              let leaderAssignment = {
                ...course.leaderAssignment,
                person,
              };
              course = {
                ...course,
                leaderAssignment,
                persons: course.persons,
              };
              this.setState({ course });
            })
            .catch((error) => {
              this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false });
            });
        }
      })
      .catch(() => {
        this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false });
      });
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const courseId = navigation.getParam('courseId');
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected === true) {
      this.loadCourse(courseId, false, i18n.locale);
    } else {
      this.setState({ snackMsg: i18n.t('GENERAL.NO_INTERNET'), visible: true, loading: false });
    }
  }
  render() {
    let TouchableComp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
      TouchableComp = TouchableNativeFeedback;
    }
    const { course, showHistorical } = this.state;
    const { navigation } = this.props;
    if (course) console.log('Course -> ', course);
    return (
      <I18nContext.Consumer>
        {(value) => {
          const dateForm = getDateMaskForm(value.lang);
          const dateFormat = getDateFormatByLocale(moment.locale());
          const dateMask = getDateMaskByLocale(moment.locale());
          moment.locale(value.lang);
          return (
            <SafeAreaView style={styles.screen}>
              {course ? (
                <ScrollView>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>{course.name}</Text>
                  </View>
                  <View>
                    <Text style={styles.sectionHeader}>{i18n.t('COURSE.INFORMATION')}</Text>
                    {course.generation && (
                      <TouchableComp
                        onPress={() => {
                          navigation.navigate('GenerationDetail', { generationId: course.generation.generationId });
                        }}
                      >
                        <View style={styles.listItem}>
                          <Text style={styles.listItemTitle}>{i18n.t('COURSE.GENERATION')}</Text>
                          <Text style={styles.listItemBody}>{course.generation.name}</Text>
                        </View>
                      </TouchableComp>
                    )}

                    <View style={styles.listItem}>
                      <Text style={styles.listItemTitle}>{i18n.t('COURSE.CELEBRATION_DATE')}</Text>
                      <Text style={styles.listItemBody}>
                        {course.celebrationDate ? moment.utc(course.celebrationDate).format(dateFormat) : ''}
                      </Text>
                    </View>
                    <IdealStatement
                      languages={course.idealLanguages ? course.idealLanguages : []}
                      recommendedLang={course.recommendedIdealField}
                      navigation={navigation}
                      entity={course}
                    />
                    <View style={styles.listItem}>
                      <Text style={styles.listItemTitle}>{i18n.t('COURSE.CONSECRATION_DATE')}</Text>
                      <Text style={styles.listItemBody}>
                        {course.idealConsecrationDate
                          ? moment.utc(course.idealConsecrationDate).format(dateFormat)
                          : ''}
                      </Text>
                    </View>
                    {course.leaderAssignment && (
                      <TouchableComp
                        onPress={() => {
                          if (course.leaderAssignment.person) {
                            navigation.push('PatreDetail', { fatherId: course.leaderAssignment.person.personId });
                          }
                        }}
                      >
                        <View style={styles.listItem}>
                          <Text style={styles.listItemTitle}>{i18n.t('COURSE.LEADER')}</Text>
                          <View style={{ flexDirection: 'row' }}>
                            {course.leaderAssignment.person && (
                              <Image
                                source={{
                                  uri: `https://schoenstatt-fathers.link${course.leaderAssignment.person.photo}`,
                                }}
                                style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
                              />
                            )}
                            {course.leaderAssignment.person && (
                              <View
                                style={{
                                  flexDirection: 'column',
                                  alignItems: 'flex-start',
                                  justifyContent: 'center',
                                }}
                              >
                                <Text style={styles.listItemBody}>
                                  {course.leaderAssignment.person.fullFriendlyName}
                                </Text>
                                <Text style={styles.listItemBody}>
                                  {`${
                                    course.leaderAssignment.startDate
                                      ? moment.utc(course.leaderAssignment.startDate).format(dateMask)
                                      : ''
                                  } - ${
                                    course.leaderAssignment.endDate
                                      ? moment.utc(course.leaderAssignment.endDate).format(dateMask)
                                      : ''
                                  }`}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </TouchableComp>
                    )}

                    <View style={styles.listItem}>
                      <Text style={styles.listItemTitle}>{i18n.t('COURSE.NOVITIATE_START')}</Text>
                      <Text style={styles.listItemBody}>
                        {course.novitiateStartDate ? moment.utc(course.novitiateStartDate).format(dateFormat) : ''}
                      </Text>
                    </View>
                    {course.novitiateFiliation && (
                      <TouchableComp
                        onPress={() => {
                          navigation.navigate('FiliationDetail', {
                            filiationId: course.novitiateFiliation.filiationId,
                          });
                        }}
                      >
                        <View style={styles.listItem}>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ marginRight: 10 }}>
                              <Text style={styles.listItemTitle}>{i18n.t('COURSE.NOVITIATE')}</Text>
                              <Text style={styles.listItemBody}>
                                {course.novitiateFiliation ? course.novitiateFiliation.name : ''}
                              </Text>
                            </View>
                            {course.novitiateFiliation && <Flag id={course.novitiateFiliation.country} size={0.2} />}
                          </View>
                        </View>
                      </TouchableComp>
                    )}

                    {course.noviceMaster && (
                      <TouchableComp
                        onPress={() => {
                          navigation.push('PatreDetail', { fatherId: course.noviceMaster.personId });
                        }}
                      >
                        <View style={styles.listItem}>
                          <Text style={styles.listItemTitle}>{i18n.t('COURSE.NOVICE_MASTER')}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {course.noviceMaster && (
                              <Image
                                source={{ uri: `https://schoenstatt-fathers.link${course.noviceMaster.photo}` }}
                                style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
                              />
                            )}

                            <Text style={styles.listItemBody}>
                              {course.noviceMaster ? course.noviceMaster.fullFriendlyName : ''}
                            </Text>
                          </View>
                        </View>
                      </TouchableComp>
                    )}

                    {course.scholasticateFiliations && (
                      <TouchableComp
                        onPress={() => {
                          if (course.scholasticateFiliations[0]) {
                            navigation.navigate('FiliationDetail', {
                              filiationId: course.scholasticateFiliations[0].filiationId,
                            });
                          }
                        }}
                      >
                        <View style={styles.listItem}>
                          <Text style={styles.listItemTitle}>{i18n.t('COURSE.SCHOLASTICATE')}</Text>
                          <Text style={styles.listItemBody}>
                            {course.scholasticateFiliations[0] ? course.scholasticateFiliations[0].name : null}
                          </Text>
                        </View>
                      </TouchableComp>
                    )}
                    <View style={{ backgroundColor: Colors.surfaceColorSecondary }}>
                      <Text style={[styles.listItemTitle, { paddingLeft: 15 }]}>
                        {i18n.t('COURSE.SCHOLASTICATE_RECTORS')}
                      </Text>
                      {course.scholasticateRectors.map((rector) => {
                        return (
                          <TouchableComp
                            key={rector.personId}
                            onPress={() => {
                              navigation.push('PatreDetail', { fatherId: rector.personId });
                            }}
                          >
                            <View style={styles.listItem}>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {rector && (
                                  <Image
                                    source={{ uri: `https://schoenstatt-fathers.link${rector.photo}` }}
                                    style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
                                  />
                                )}

                                <Text style={styles.listItemBody}>{rector ? rector.fullFriendlyName : ''}</Text>
                              </View>
                            </View>
                          </TouchableComp>
                        );
                      })}
                    </View>
                    {course.firstTertianshipFiliation && (
                      <Fragment>
                        <Text style={styles.sectionHeader}>{i18n.t('COURSE.FIRST_TERTIANSHIP')}</Text>
                        <TouchableComp
                          onPress={() => {
                            navigation.navigate('FiliationDetail', {
                              filiationId: course.firstTertianshipFiliation.filiationId,
                            });
                          }}
                        >
                          <View style={styles.listItem}>
                            <View
                              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                              <View style={{ marginRight: 10 }}>
                                <Text style={styles.listItemTitle}>{i18n.t('COURSE.FILIATION')}</Text>
                                <Text style={styles.listItemBody}>{course.firstTertianshipFiliation.name}</Text>
                              </View>
                              {course.firstTertianshipFiliation.country && (
                                <Flag id={course.firstTertianshipFiliation.country} size={0.2} />
                              )}
                            </View>
                          </View>
                        </TouchableComp>
                        <TouchableComp
                          onPress={() => {
                            navigation.push('PatreDetail', { fatherId: course.firstTertianshipMaster.personId });
                          }}
                        >
                          <View style={styles.listItem}>
                            <Text style={styles.listItemTitle}>{i18n.t('COURSE.MASTER')}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              {course.firstTertianshipMaster && (
                                <Image
                                  source={{
                                    uri: `https://schoenstatt-fathers.link${course.firstTertianshipMaster.photo}`,
                                  }}
                                  style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
                                />
                              )}

                              <Text style={styles.listItemBody}>
                                {course.firstTertianshipMaster && course.firstTertianshipMaster.fullFriendlyName
                                  ? course.firstTertianshipMaster.fullFriendlyName
                                  : ''}
                              </Text>
                            </View>
                          </View>
                        </TouchableComp>
                        <View style={styles.listItem}>
                          <Text style={styles.listItemTitle}>{i18n.t('COURSE.START_DATE')}</Text>
                          <Text style={styles.listItemBody}>
                            {course.firstTertianshipStartDate
                              ? moment.utc(course.firstTertianshipStartDate).format(dateFormat)
                              : ''}
                          </Text>
                        </View>
                        <View style={styles.listItem}>
                          <Text style={styles.listItemTitle}>{i18n.t('COURSE.END_DATE')}</Text>
                          <Text style={styles.listItemBody}>
                            {course.firstTertianshipEndDate
                              ? moment.utc(course.firstTertianshipEndDate).format(dateFormat)
                              : ''}
                          </Text>
                        </View>
                      </Fragment>
                    )}
                    {course.secondTertianshipFiliation && (
                      <Fragment>
                        <Text style={styles.sectionHeader}>{i18n.t('COURSE.SECOND_TERTIANSHIP')}</Text>
                        <TouchableComp
                          onPress={() => {
                            navigation.navigate('FiliationDetail', {
                              filiationId: course.secondTertianshipFiliation.filiationId,
                            });
                          }}
                        >
                          <View style={styles.listItem}>
                            <View
                              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                              <View style={{ marginRight: 10 }}>
                                <Text style={styles.listItemTitle}>{i18n.t('COURSE.FILIATION')}</Text>
                                <Text style={styles.listItemBody}>{course.secondTertianshipFiliation.name}</Text>
                              </View>
                              {course.secondTertianshipFiliation.country && (
                                <Flag id={course.secondTertianshipFiliation.country} size={0.2} />
                              )}
                            </View>
                          </View>
                        </TouchableComp>
                        <TouchableComp
                          onPress={() => {
                            navigation.push('PatreDetail', { fatherId: course.secondTertianshipMaster.personId });
                          }}
                        >
                          <View style={styles.listItem}>
                            <Text style={styles.listItemTitle}>{i18n.t('COURSE.MASTER')}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              {course.secondTertianshipMaster && (
                                <Image
                                  source={{
                                    uri: `https://schoenstatt-fathers.link${course.secondTertianshipMaster.photo}`,
                                  }}
                                  style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
                                />
                              )}

                              <Text style={styles.listItemBody}>
                                {course.secondTertianshipMaster && course.secondTertianshipMaster.fullFriendlyName
                                  ? course.secondTertianshipMaster.fullFriendlyName
                                  : ''}
                              </Text>
                            </View>
                          </View>
                        </TouchableComp>
                        <View style={styles.listItem}>
                          <Text style={styles.listItemTitle}>{i18n.t('COURSE.START_DATE')}</Text>
                          <Text style={styles.listItemBody}>
                            {course.secondTertianshipStartDate
                              ? moment.utc(course.secondTertianshipStartDate).format(dateFormat)
                              : ''}
                          </Text>
                        </View>
                        <View style={styles.listItem}>
                          <Text style={styles.listItemTitle}>{i18n.t('COURSE.END_DATE')}</Text>
                          <Text style={styles.listItemBody}>
                            {course.secondTertianshipEndDate
                              ? moment.utc(course.secondTertianshipEndDate).format(dateFormat)
                              : ''}
                          </Text>
                        </View>
                      </Fragment>
                    )}

                    {course.sionzeitFiliation && (
                      <Fragment>
                        <Text style={styles.sectionHeader}>{i18n.t('COURSE.SION_TIME')}</Text>
                        <TouchableComp
                          onPress={() => {
                            navigation.navigate('FiliationDetail', {
                              filiationId: course.sionzeitFiliation.filiationId,
                            });
                          }}
                        >
                          <View style={styles.listItem}>
                            <View
                              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                              <View style={{ marginRight: 10 }}>
                                <Text style={styles.listItemTitle}>{i18n.t('COURSE.FILIATION')}</Text>
                                <Text style={styles.listItemBody}>{course.sionzeitFiliation.name}</Text>
                              </View>
                              {course.sionzeitFiliation.country && (
                                <Flag id={course.sionzeitFiliation.country} size={0.2} />
                              )}
                            </View>
                          </View>
                        </TouchableComp>
                        <TouchableComp
                          onPress={() => {
                            navigation.push('PatreDetail', { fatherId: course.sionzeitCoordinator.personId });
                          }}
                        >
                          <View style={styles.listItem}>
                            <Text style={styles.listItemTitle}>{i18n.t('COURSE.SION_TIME_MASTER')}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              {course.sionzeitCoordinator && (
                                <Image
                                  source={{
                                    uri: `https://schoenstatt-fathers.link${course.sionzeitCoordinator.photo}`,
                                  }}
                                  style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
                                />
                              )}

                              <Text style={styles.listItemBody}>
                                {course.sionzeitCoordinator && course.sionzeitCoordinator.fullFriendlyName
                                  ? course.sionzeitCoordinator.fullFriendlyName
                                  : ''}
                              </Text>
                            </View>
                          </View>
                        </TouchableComp>
                        <View style={styles.listItem}>
                          <Text style={styles.listItemTitle}>{i18n.t('COURSE.START_DATE')}</Text>
                          <Text style={styles.listItemBody}>
                            {course.sionzeitStartDate ? moment.utc(course.sionzeitStartDate).format(dateFormat) : ''}
                          </Text>
                        </View>
                        <View style={styles.listItem}>
                          <Text style={styles.listItemTitle}>{i18n.t('COURSE.END_DATE')}</Text>
                          <Text style={styles.listItemBody}>
                            {course.sionzeitEndDate ? moment.utc(course.sionzeitEndDate).format(dateFormat) : ''}
                          </Text>
                        </View>
                      </Fragment>
                    )}
                    {course.assignments.length > 0 ? (
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
                              entityName: course.name,
                              roles: course.assignments.map((item) => ({ name: item.roleTitle, value: item.roleId })),
                              entityId: course.courseId,
                              isCreate: true,
                            });
                          }}
                        >
                          <Ionicons name="md-add" size={30} color={Colors.primaryColor} fontWeight="700" />
                        </Pressable>

                        {course.assignments.map((asg) => {
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
                                  <Text style={styles.listItemTitle}>{i18n.t('FILIAL_DETAIL.SUPERIOR')}</Text>
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
                                        style={asg.isActive ? styles.listItemBodyBlue : styles.listItemBodyBlueInactive}
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
                                          entityName: course.name,
                                          entityId: course.courseId,
                                          roleTitle: asg.roleTitle,
                                          roleId: asg.roleId,
                                          fatherId: asg.person.personId,
                                          isCreate: false,
                                          personName: asg.person.fullName,
                                          startDate: asg.startDate ? moment.utc(asg.startDate).format(dateForm) : null,
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
                    <Text style={styles.sectionHeader}>{i18n.t('COURSE.MEMBERS')}</Text>
                    {course.persons.map((person) => {
                      return (
                        <TouchableComp
                          key={person.personId}
                          onPress={() => navigation.navigate('PatreDetail', { fatherId: person.personId })}
                        >
                          <View style={styles.memberItem}>
                            <Image
                              source={{ uri: `https://schoenstatt-fathers.link${person.photo}` }}
                              style={{ width: 30, height: 30, borderRadius: 15, marginRight: 10 }}
                            />

                            <Text
                              style={{ fontSize: 12, color: Colors.primaryColor, fontFamily: 'work-sans-semibold' }}
                            >
                              {person.fullFriendlyName}&nbsp;
                              {person.deathDate && (
                                <>
                                  {'('}
                                  <FontAwesome5 name="cross" size={10} color={Colors.primaryColor} />
                                  {person.deathDate.substring(0, 4) + ')'}
                                </>
                              )}
                              {person.leaveDate && (
                                <>
                                  {'(X'}
                                  {/* <Entypo name="cross" size={15} color={Colors.primaryColor} /> */}
                                  {person.leaveDate.substring(0, 4) + ')'}
                                </>
                              )}
                            </Text>
                          </View>
                        </TouchableComp>
                      );
                    })}
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

CourseDetailScreen.navigationOptions = (navigationData) => ({
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

export default CourseDetailScreen;
