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
} from 'react-native';
import i18n from 'i18n-js';
import { FlatList } from 'react-native-gesture-handler';
import { Flag } from 'react-native-svg-flagkit';
import axios from 'axios';
import Constants from 'expo-constants';
import Colors from '../constants/Colors';
import moment from 'moment';
import 'moment/min/locales';
import { I18nContext } from '../context/I18nProvider';


class DelegationDetailScreen extends Component {
  state = {
    territory: null
  }

  componentDidMount() {
    const { navigation } = this.props;
    const territoryId = navigation.getParam('delegationId');
    axios.get(`https://schoenstatt-fathers.link/en/api/v1/territories/${territoryId}?fields=all&key=${Constants.manifest.extra.secretKey}`)
      .then((res) => {
        this.setState({ territory:res.data.result });
        console.log('[Territory]', res.data.result);
      });
  }



  componentDidUpdate(prevProps) {
    console.log('compoentDidUpdate',prevProps.navigation.getParam('delegationId'), this.props.navigation.getParam('delegationId'))
    
    const { navigation } = this.props;
    const territoryId = navigation.getParam('delegationId');
    if( prevProps.navigation.getParam('delegationId') != this.props.navigation.getParam('delegationId') ) {
      axios.get(`https://schoenstatt-fathers.link/en/api/v1/territories/${territoryId}?fields=all&key=${Constants.manifest.extra.secretKey}`)
      .then((res) => {
        this.setState({ territory:res.data.result });
        console.log('[Territory]', res.data.result);
      });
    }
    
  }
  render() {
    let TouchableComp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
    }
    const { navigation } = this.props; 
    const { territory } = this.state;
    return(
      <I18nContext.Consumer>
      {(value) => {
        moment.locale(value.lang)
        return (
          <SafeAreaView>
            {territory
              ? (
                <ScrollView>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>{territory.name}</Text>
                  </View>
                  <View>
                    <Text style={styles.sectionHeader}>{i18n.t('TERRITORY_INFO')}</Text>
                    {territory.parentTerritory &&
                      <TouchableComp onPress={() => {
                        console.log('apreto')
                        navigation.navigate('DelegationDetail', { delegatioId: territory.parentTerritory.territoryId })
                      }}>
                        <View style={styles.listItem}>
                          <Text style={styles.listItemTitle}>{i18n.t('TERRITORY_CHARGE')}</Text>
                          <Text style={styles.listItemBody}>{territory.parentTerritory.name}</Text>
                        </View>
                      </TouchableComp>
                    }
                    {territory.celebrationDate &&
                      <View style={styles.listItem}>
                        <Text style={styles.listItemTitle}>{i18n.t('CELEBRATION_DATE')}</Text>
                        <Text style={styles.listItemBody}>{moment.utc(territory.celebrationDate).format('Do MMMM YYYY')}</Text>
                      </View>
                    }
                    <View style={[styles.listItem]}>
                      <Text style={styles.listItemTitle}>{i18n.t('SUPERIOR')}</Text>
                      {territory.assignments.map((asg) => {
                        return (
                          <View style={styles.fatherItem}>
                            <Image
                              source={{ uri: `https://schoenstatt-fathers.link${asg.person.photo}` }}
                              style={{ width: 70, height: 70, borderRadius: 35, marginRight: 10 }}
                            />
                            <View style={{ flexDirection: 'column' }}>
                              <Text style={styles.listItemBody}>{asg.roleTitle}</Text>
                              <Text style={styles.listItemBody}>{asg.person.fullName}</Text>
                              <Text style={styles.listItemBody}>
                                {`${moment.utc(asg.startDate).format('Do MMMM YYYY')} ${moment.utc(asg.endDate).format('Do MMMM YYYY')}`}
                              </Text>
                            </View>
                          </View>
                        )
                      })}

                    </View>
                  </View>
                  <View styles={{ marginTop: 10, marginBottom: 5, backgroundColor: Colors.surfaceColorSecondary }}>
                    <Text style={styles.sectionHeader}>{i18n.t('TERRITORY_FILIATION')}</Text>
                    <View>
                      {territory.filiations.map(filiation => {
                        return (
                          <View style={styles.card}>
                            <View style={{ flexDirection: 'row', alignItems: 'center'}} >
                              <Flag id={filiation.country} size={0.1} />
                              <Text style={styles.cardTitle}>{filiation.name}</Text>
                            </View>
                            
                            <View style={styles.cardBody}>
                              <Text style={styles.cardBodyText}>{i18n.t('RECTOR')}</Text>
                              <Text style={styles.cardBodyTextBold}>{filiation.mainAssignment ? filiation.mainAssignment.person.fullName : null}</Text>
                            </View>
                          </View>
                        )

                      })
                      }
                    </View>
                  </View>
                  <Text style={styles.sectionHeader}>{i18n.t('MEMBERS_OF_TERRITORY')}</Text>
                  <FlatList
                    data={
                      [
                        {
                          name: 'Kühlcke, Pedro (2017-2020)',
                        }, {
                          name: 'Miranda, Jose (2017-2020)',
                        },
                        {
                          name: 'Ferrero Arinci, Santiago Nicolás',
                        },
                      ]
                    }
                    renderItem={({ item }) => {
                      return (
                        <View style={{
                          flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceColorSecondary, padding: 15,
                        }}
                        >
                          <Image
                            source={{ uri: 'https://cdn0.iconfinder.com/data/icons/professions-47/64/16-512.png' }}
                            style={{ width: 20, height: 20 }}
                          />
                          <Text style={{ fontSize: 12, color: Colors.primaryColor, fontFamily: 'work-sans-semibold' }}>{item.name}</Text>
                        </View>
                      );
                    }}
                  />
                  <Text style={ styles.statsText }> Total: {territory.statistics.total} </Text>
                  <Text style={ styles.statsText }> {`${i18n.t('PRIESTS')}: ${territory.statistics.livingPerpetual}`} </Text>
                  <Text style={ styles.statsText }> {`${i18n.t('STUDENTS')}: ${territory.statistics.students}`} </Text>
                  <Text style={ styles.statsText }> {`${i18n.t('DECEASED')}: ${territory.statistics.deceased}`} </Text>

                </ScrollView>
              )
              : <ActivityIndicator size="large" color={Colors.primaryColor} />}
          </SafeAreaView>
        )
      }}
    </I18nContext.Consumer>
    ) 
  }
}


DelegationDetailScreen.navigationOptions = (navigationData) => ({

  headerTitle: i18n.t('INFORMATION'),

});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.surfaceColorPrimary,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 16
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
    fontSize: 15,
    color: Colors.onSurfaceColorPrimary,
  },
  card: {
    width: '80%',
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
    marginLeft:10
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
  statsText: {
    marginLeft: 16,
    color: Colors.onSurfaceColorPrimary,
    paddingVertical: 10,
    fontFamily:'work-sans-medium'
  }
});

export default DelegationDetailScreen;
