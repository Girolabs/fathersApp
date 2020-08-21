import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TouchableNativeFeedback,
  ActivityIndicator,
  SafeAreaView,
  SectionList,
  Image,
  ScrollView,
} from 'react-native';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import { Ionicons } from 'expo-vector-icons';
import moment from 'moment';
import 'moment/min/locales';
import { I18nContext } from '../context/I18nProvider';
import { Flag } from 'react-native-svg-flagkit';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { getTerritories, getFiliations, getGenerations, getCourses, getPersons } from '../api';

class AssignmentsScreen extends Component {
  state = {
    selectedtTab: 0,
    territories: [],
    loading: true,
    generations: [],
    courses: [],
  };
  componentDidMount() {
    getTerritories('all').then((resTerritory) => {
      let territories = resTerritory.data.result;
      getFiliations('all').then((resFiliations) => {
        let filiations = resFiliations.data.result;
        territories = territories.map((territory) => {
          let resfiliations = [];
          if (territory.filiations) {
            resfiliations = territory.filiations.map((tFiliation) => {
              let returnFiliation = null;
              filiations.forEach((filiation) => {
                if (tFiliation.filiationId == filiation.filiationId) {
                  returnFiliation = {
                    ...tFiliation,
                    data: filiation.assignments,
                  };
                }
              });
              if (returnFiliation != null) {
                return returnFiliation;
              } else {
                return tFiliation;
              }
            });
            return {
              ...territory,
              filiations: resfiliations,
            };
          }
        });
        territories = territories.map((territory) => {
          let filiations = territory.filiations.map((filiation) => {
            if (filiation.isActive == true) {
              return filiation;
            }
          });
          filiations = filiations.filter((filiation) => filiation != undefined);
          return {
            ...territory,
            filiations,
          };
        });

        console.log('t', territories);

        territories = territories.map((territory) => {
          return {
            ...territory,
            data: territory.assignments,
          };
        });

        getGenerations('all').then((resGenerations) => {
          let generations = resGenerations.data.result;
          getCourses('all').then((resCourses) => {
            let courses = resCourses.data.result;
            this.setState({ generations, courses });
          });
        });
        this.setState({ territories, loading: false });
      });
    });
  }
  render() {
    const { territories, selectedtTab } = this.state;
    let TouchableComp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
      TouchableComp = TouchableNativeFeedback;
    }

    const tabs = [
      {
        text: i18n.t('ASSIGNMENTS.TERRITORY'),
      },
      {
        text: i18n.t('ASSIGNMENTS.FILIATIONS'),
      },
      {
        text: i18n.t('ASSIGNMENTS.HISTORICAL'),
      },
      {
        text: i18n.t('ASSIGNMENTS.GENERATIONS'),
      },
      {
        text: i18n.t('ASSIGNMENTS.COURSES'),
      },
    ];
    let filtered = [];
    let list;
    if (territories.length > 0) {
      switch (selectedtTab) {
        case 0:
          filtered = territories
            .filter((territory) => territory.isActive == true)
            .map((territory) => {
              let data = territory.data.filter((assignment) => assignment.isActive === true);
              return {
                ...territory,
                data,
              };
            });

          list = (
            <SectionList
              sections={filtered}
              renderItem={({ item }) => (
                <ListItem
                  name={item.person.fullName}
                  photo={item.person.photo}
                  roleTitle={item.roleTitle}
                  startDate={item.startDate}
                  endDate={item.endDate}
                  selectPerson={() =>
                    item.person
                      ? this.props.navigation.navigate('PatreDetail', {
                          fatherId: item.person.personId,
                        })
                      : null
                  }
                />
              )}
              renderSectionHeader={({ section: { name, territoryId } }) => (
                <Header
                  selectHeader={() => {
                    this.props.navigation.navigate('DelegationDetail', {
                      delegationId: territoryId,
                    });
                  }}
                  name={name}
                />
              )}
            />
          );
          console.log('filtered', filtered);
          break;

        case 1:
          filtered = territories
            .filter((territory) => territory.isActive == true)
            .map((territory) => {
              let filiations = territory.filiations.map((filiation) => {
                return {
                  ...filiation,
                  data: filiation.data.map((asg) => {
                    return {
                      ...asg,
                      filiationName: filiation.name,
                      filiationId: filiation.filiationId,
                      country: filiation.country,
                    };
                  }),
                };
              });
              return {
                ...territory,
                filiations,
              };
            });
          list = (
            <ScrollView>
              {filtered.map((territory) => {
                return (
                  <View>
                    <TouchableComp
                      onPress={() => {
                        this.props.navigation.navigate('DelegationDetail', {
                          delegationId: territory.territoryId,
                        });
                      }}
                    >
                      <View style={styles.sectionHeaderContainer}>
                        <Text style={styles.header}>{territory.name}</Text>
                        <Ionicons name="ios-help-circle-outline" size={23} color={Colors.primaryColor} />
                      </View>
                    </TouchableComp>
                    {territory.filiations.map((filiation) => {
                      console.log(filiation);
                      return (
                        <Fragment>
                          {filiation.data.map((asg) => {
                            return (
                              <Fragment>
                                {asg.isActive && (
                                  <View style={styles.itemContainer}>
                                    <Image
                                      style={{ width: 45, height: 45, borderRadius: 50 }}
                                      resizMode="center"
                                      source={{
                                        uri: `https://schoenstatt-fathers.link${asg.person.photo}`,
                                      }}
                                    />
                                    <View style={styles.itemTextContainer}>
                                      <TouchableComp
                                        onPress={() => {
                                          this.props.navigation.navigate('FiliationDetail', {
                                            filiationId: asg.filiationId,
                                          });
                                        }}
                                      >
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                          <Text style={styles.itemTextTitle}>{asg.filiationName}</Text>
                                          <Flag id={asg.country} size={0.1} />
                                        </View>
                                      </TouchableComp>

                                      <Text style={styles.itemText}>{asg.roleTitle}</Text>
                                      <TouchableComp
                                        onPress={() => {
                                          this.props.navigation.navigate('PatreDetail', {
                                            fatherId: asg.person.personId,
                                          });
                                        }}
                                      >
                                        <Text style={styles.itemText}>{asg.person.fullName}</Text>
                                      </TouchableComp>

                                      <Text style={styles.itemText}>{`${
                                        asg.startDate ? moment.utc(asg.startDate).format('Do MMMM YYYY') : ''
                                      } - ${asg.endDate ? moment.utc(asg.endDate).format('Do MMMM YYYY') : ''}`}</Text>
                                    </View>
                                  </View>
                                )}
                              </Fragment>
                            );
                          })}
                        </Fragment>
                      );
                    })}
                  </View>
                );
              })}
            </ScrollView>
          );
          break;
        case 2:
          filtered = territories;
          list = (
            <SectionList
              sections={filtered}
              renderItem={({ item }) => (
                <ListItem
                  name={item.person.fullName}
                  photo={item.person.photo}
                  roleTitle={item.roleTitle}
                  startDate={item.startDate}
                  endDate={item.endDate}
                  selectPerson={() =>
                    item.person
                      ? this.props.navigation.navigate('PatreDetail', {
                          fatherId: item.person.personId,
                        })
                      : null
                  }
                />
              )}
              renderSectionHeader={({ section: { name, territoryId } }) => (
                <Header
                  selectHeader={() => {
                    this.props.navigation.navigate('DelegationDetail', {
                      delegationId: territoryId,
                    });
                  }}
                  name={name}
                />
              )}
            />
          );
          break;
        case 3:
          list = (
            <ScrollView>
              {this.state.generations.map((generation) => {
                return (
                  <ListItemGC
                    photo={generation.mainAssignment ? generation.mainAssignment.person.photo : null}
                    title={generation.name}
                    fullName={generation.mainAssignment ? generation.mainAssignment.person.fullName : null}
                    startDate={generation.mainAssignment ? generation.mainAssignment.startDate : null}
                    endDate={generation.mainAssignment ? generation.mainAssignment.endDate : null}
                    selectTitle={() =>
                      this.props.navigation.navigate('GenerationDetail', {
                        generationId: generation.generationId,
                      })
                    }
                    selectPerson={() =>
                      generation.mainAssignment
                        ? this.props.navigation.navigate('PatreDetail', {
                            fatherId: generation.mainAssignment.person.personId,
                          })
                        : null
                    }
                  />
                );
              })}
            </ScrollView>
          );

          break;
        case 4:
          list = (
            <ScrollView>
              {this.state.courses.map((course) => {
                return (
                  <ListItemGC
                    photo={course.leaderAssignment ? course.leaderAssignment.person.photo : null}
                    title={course.name}
                    fullName={course.leaderAssignment ? course.leaderAssignment.person.fullName : null}
                    startDate={course.leaderAssignment ? course.leaderAssignment.startDate : null}
                    endDate={course.leaderAssignment ? course.leaderAssignment.endDate : null}
                    selectTitle={() =>
                      this.props.navigation.navigate('CourseDetail', {
                        courseId: course.courseId,
                      })
                    }
                    selectPerson={() =>
                      course.leaderAssignment
                        ? this.props.navigation.navigate('PatreDetail', {
                            fatherId: course.leaderAssignment.person.personId,
                          })
                        : null
                    }
                  />
                );
              })}
            </ScrollView>
          );
          break;
      }
    }

    return (
      <I18nContext.Consumer>
        {(value) => {
          moment.locale(value.lang);
          return (
            <SafeAreaView>
              {!this.state.loading ? (
                <Fragment>
                  <View style={styles.tabsGroup}>
                    {tabs.map((tab, index) => {
                      return (
                        <TouchableComp
                          key={index}
                          onPress={() => {
                            this.setState({ selectedtTab: index });
                          }}
                        >
                          <View
                            style={[this.state.selectedtTab === index ? styles.tabButtonSelected : styles.tabButton]}
                          >
                            <Text
                              style={[
                                this.state.selectedtTab === index ? styles.tabButtonTextSelected : styles.tabButtonText,
                              ]}
                            >
                              {tab.text && tab.text.length >= 6 ? tab.text.slice(0, 6) : tab.text}
                            </Text>
                          </View>
                        </TouchableComp>
                      );
                    })}
                  </View>
                  <View style={styles.scrollContainer}>{filtered && <Fragment>{list}</Fragment>}</View>
                </Fragment>
              ) : (
                <ActivityIndicator size="large" color={Colors.primaryColor} />
              )}
            </SafeAreaView>
          );
        }}
      </I18nContext.Consumer>
    );
  }
}

AssignmentsScreen.navigationOptions = (navigationData) => ({
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

const Header = (props) => {
  const { name, selectHeader } = props;
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  return (
    <TouchableComp
      onPress={() => {
        selectHeader();
      }}
    >
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.header}>{name}</Text>
        <Ionicons name="ios-help-circle-outline" size={23} color={Colors.primaryColor} />
      </View>
    </TouchableComp>
  );
};

const ListItem = (props) => {
  const { photo, name, startDate, endDate, roleTitle, selectPerson } = props;
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }
  return (
    <TouchableComp
      onPress={() => {
        selectPerson();
      }}
    >
      <View style={styles.itemContainer}>
        <Image
          style={{ width: 45, height: 45, borderRadius: 22 }}
          resizMode="center"
          source={{
            uri: `https://schoenstatt-fathers.link${photo}`,
          }}
        />
        <View style={styles.itemTextContainer}>
          <Text style={styles.itemTextTitle}>{roleTitle}</Text>
          <Text style={styles.itemText}>{name}</Text>
          <Text style={styles.itemText}>{`${startDate ? moment.utc(startDate).format('Do MMMM YYYY') : ''} - ${
            endDate ? moment.utc(endDate).format('Do MMMM YYYY') : ''
          }`}</Text>
        </View>
      </View>
    </TouchableComp>
  );
};

const ListItemGC = (props) => {
  const { photo, title, fullName, startDate, endDate, selectTitle, selectPerson } = props;
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }
  return (
    <View style={[styles.itemContainer, { marginVertical: 15 }]}>
      <Image
        style={{ width: 45, height: 45, borderRadius: 22 }}
        resizMode="center"
        source={{
          uri: `https://schoenstatt-fathers.link${photo}`,
        }}
      />
      <View style={styles.itemTextContainer}>
        <TouchableComp onPress={() => selectTitle()}>
          <Text style={styles.itemTextTitle}>{title}</Text>
        </TouchableComp>
        <TouchableComp onPress={() => selectPerson()}>
          <Text style={styles.itemText}>{fullName}</Text>
        </TouchableComp>

        {(startDate || endDate) && (
          <Text style={styles.itemText}>{`${startDate ? moment.utc(startDate).format('Do MMMM YYYY') : ''} - ${
            endDate ? moment.utc(endDate).format('Do MMMM YYYY') : ''
          }`}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {},
  tabsGroup: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent:'space-between'
  },
  tabButtonSelected: {
    flexGrow: 0.25,
    borderColor: Colors.primaryColor,
    borderWidth: 2,
    borderRadius: 5,
    paddingVertical: 5,
    marginHorizontal: 5,
    backgroundColor: Colors.primaryColor,
    padding:10
  },
  tabButton: {
    padding:10,
    flexGrow: 0.25,
    borderColor: Colors.primaryColor,
    borderWidth: 2,
    borderRadius: 5,
    paddingVertical: 5,
    backgroundColor: 'white',
    marginHorizontal: 5,
  },
  tabButtonTextSelected: {
    textAlign: 'center',
    color: 'white',
    fontSize: 12,
    fontFamily: 'work-sans-bold',
    textTransform: 'uppercase',
  },
  tabButtonText: {
    textAlign: 'center',
    color: Colors.primaryColor,
    fontSize: 12,
    fontFamily: 'work-sans-bold',
    textTransform: 'uppercase',
  },
  header: {
    fontSize: 15,
    color: Colors.onSurfaceColorPrimary,
    fontFamily: 'work-sans-medium',

    marginVertical: 10,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemContainer: {
    backgroundColor: Colors.surfaceColorSecondary,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTextContainer: {
    flexDirection: 'column',
    maxWidth: '80%',
  },
  itemText: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    fontFamily: 'work-sans',
    color: Colors.onSurfaceColorPrimary,
  },
  itemTextTitle: {
    fontSize: 18,
    paddingHorizontal: 10,
    fontFamily: 'work-sans-semibold',
    color: Colors.primaryColor,
  },
  scrollContainer: {
    paddingBottom: 80,
  },
});

export default AssignmentsScreen;
