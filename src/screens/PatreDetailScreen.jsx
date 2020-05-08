import React, { useEffect, useState, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  TouchableNativeFeedback,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { Flag } from 'react-native-svg-flagkit';
import moment from 'moment';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import 'moment/min/locales';
import { Ionicons } from 'expo-vector-icons';
import { I18nContext } from '../context/I18nProvider';
import Constants from 'expo-constants';
import countries from "i18n-iso-countries";
import axios from 'axios';
import * as Contacts from "expo-contacts";


countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
countries.registerLocale(require("i18n-iso-countries/langs/es.json"));

const PatreDetailScreen = ({ navigation }) => {
  const [father, setFather] = useState(null);
  const [showSaveContact, setShowSaveContact] = useState(false);

  let TouchableComp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  const handleSaveContact = async (father) => {
    try {
      const contact = {
        [Contacts.Fields.FirstName]: father.friendlyFirstName,
        [Contacts.Fields.LastName]: father.friendlyLastName,
        [Contacts.Fields.PhoneNumbers]: [{
          label: 'mobile',
          number: father.phones ? father.phones[0].number : null,
        }],
        [Contacts.Fields.Emails]: [{
          email: father.email ? father.email : null
        }]
      }
      console.log('contact', contact)
      console.log('spanshot', contact)
      const contactId = await Contacts.addContactAsync(contact);

      if (contactId) {
       /*  Alert.alert(
          "Contact Saved.",
          "My Alert Msg",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        ); */
      }
      else {
      /*   Alert.alert(
          "Contact not saved.",
          "My Alert Msg",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () => console.log("OK Pressed") }
          ],
          { cancelable: false }
        ); */

      }
    }
    catch (err) {
     /*  Alert.alert(
        "Contact not Saved.problem",
        "My Alert Msg",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => console.log("OK Pressed") }
        ],
        { cancelable: false }
      ); */
    }

    const contactId = await Contacts.addContactAsync(contact);
    console.log(contactId)

  }

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        setShowSaveContact(true)
      }
    })()
    const fatherId = navigation.getParam('fatherId');
    axios.get(`https://schoenstatt-fathers.link/en/api/v1/persons/${fatherId}?fields=all&key=${Constants.manifest.extra.secretKey}`).then(response => {
      console.log('[PatreDetail]', response.data.result)
      const resFather = response.data.result;
      setFather(resFather)

      console.log('father', father)
    })
  }, [])

  return (
    <I18nContext.Consumer>
      {(value) => {
        moment.locale(value.lang)
        return (
          <View style={styles.screen}>
            {father ?
              <ScrollView>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                  <Image
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                    resizMode="center"
                    source={{ uri: `https://schoenstatt-fathers.link${father.photo}` }}
                  />
                  <View style={{ padding: 15 }}>
                    <Text
                      style={{
                        fontFamily: 'work-sans-semibold',
                        fontSize: 18,
                        color: Colors.onSurfaceColorPrimary,
                      }}
                    >
                      {father.fullName}
                    </Text>
                    <View style={{ width: '75%' }}>
                      <Text style={{ color: Colors.onSurfaceColorSecondary, fontFamily: 'work-sans' }}>

                        {`${i18n.t('FATHER_DETAIL.LAST_UPDATE')}:${
                          father.personalInfoUpdatedOn ?
                            moment.utc(father.personalInfoUpdatedOn).format('Do MMMM YYYY')
                            : null
                          }`}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.sectionHeader}>{i18n.t('FATHER_DETAIL.CONTACT_INFO')}</Text>
                <DefaultItem title="EMAIL" body={father.email} />
                <DefaultItem title="MAIN_CELL_PHONE" body={father.phones[0].number} />
                <DefaultItem title="HOME" body={father.phones[1] != undefined ? father.phones[1].number : ''} />

                <View style={{ flexDirection: 'row', width: '100%', marginVertical: 10 }}>
                  {showSaveContact &&
                    <TouchableComp onPress={
                      () => {
                        handleSaveContact(father)
                      }
                    }>
                      <View
                        style={{
                          backgroundColor: 'white',
                          borderColor: Colors.primaryColor,

                          borderRadius: 5,
                          borderWidth: 2,
                          paddingHorizontal: 10,
                          width: '45%',
                          height: 50,
                          marginHorizontal: 15,
                          justifyContent: 'center',
                        }}
                      >
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: 12,
                            fontFamily: 'work-sans-bold',
                            textTransform: 'uppercase',
                            color: Colors.primaryColor,
                          }}
                        >
                          {i18n.t('FATHER_DETAIL.SAVE_CONTACT')}
                        </Text>
                      </View>
                    </TouchableComp>
                  }

                  {father.phones[0].whatsApp === true && (
                    <TouchableComp
                      onPress={() => {
                        Linking.openURL(`http://api.whatsapp.com/send?phone=${father.phones[0].number}`);
                      }}
                    >
                      <Ionicons
                        name="logo-whatsapp"
                        style={{ paddingHorizontal: 20 }}
                        size={46}
                        color={Colors.primaryColor}
                      />
                    </TouchableComp>
                  )}
                </View>

                <Text style={styles.sectionHeader}>{i18n.t('FATHER_DETAIL.CURRENT_HOME')}</Text>
                <DefaultItem
                  title="FILIATION"
                  body={father.activeLivingSituation.filiationName}
                  img={father.activeLivingSituation.filiationCountry}
                  selected={() => { navigation.navigate('FiliationDetail', { filiationId: father.activeLivingSituation.filiationId }) }} />

                <DefaultItem
                  title="HOME"
                  body={father.activeLivingSituation.houseName}
                  img={father.activeLivingSituation.houseCountry}
                  selected={() => {
                    navigation.navigate('HouseDetail', { houseId: father.activeLivingSituation.houseId })
                  }} />
                <DefaultItem
                  title="RESPONSIBLE_TERRITORY"
                  body={father.activeLivingSituation.responsibleTerritoryName}
                  selected={() => {
                    navigation.navigate('DelegationDetail', { delegationId: father.activeLivingSituation.responsibleTerritoryId })
                  }} />

                <Text style={styles.sectionHeader}>{i18n.t('FATHER_DETAIL.PERSONAL_INFO')}</Text>

                <DefaultItem title="HOME_COUNTRY" img={father.country} country_code={father.country} lang={value.lang} />

                <DefaultItem
                  title="HOME_TERRITORY"
                  body={father.homeTerritoryName}
                  selected={() => {
                    navigation.navigate('DelegationDetail', { delegationId: father.activeLivingSituation.homeTerritoryId })
                  }} />
                <DefaultItem
                  title="COURSE"
                  body={father.courseName}
                  selected={() => {
                    navigation.navigate('CourseDetail', { courseId: father.courseId })
                  }} />

                <DefaultItem
                  title="GENERATION"
                  body={father.generationName}
                  selected={() => {
                    navigation.navigate('GenerationDetail', { generationId: father.generationId })
                  }}
                />
                <DefaultItem
                  title="BIRTHDAY"
                  body={father.birthDate ? moment.utc(father.birthDate).format('Do MMMM YYYY') : null}
                />
                <DefaultItem
                  title="NAMEDAY"
                  body={father.nameDay ? moment.utc(father.nameDay).format('Do MMMM YYYY') : null}
                />
                <DefaultItem
                  title="BAPTISM"
                  body={father.baptismDate ? moment.utc(father.baptismDate).format('Do MMMM YYYY') : null}
                />
                <DefaultItem
                  title="POSTULANCY_ADMITTANCE"
                  body={father.postulancyDate ? moment.utc(father.postulancyDate).format('Do MMMM YYYY') : null}
                />
                <DefaultItem
                  title="NOVITIATE_START"
                  body={father.novitiateDate ? moment.utc(father.novitiateDate).format('Do MMMM YYYY') : null}
                />
                <DefaultItem
                  title="COMMUNITY_MEMBERSHIP"
                  body={
                    father.communityMembershipDate
                      ? moment.utc(father.communityMembershipDate).format('Do MMMM YYYY')
                      : null
                  }
                />
                <DefaultItem
                  title="PERPETUAL_CONTRACT"
                  body={
                    father.perpetualContractDate
                      ? moment.utc(father.perpetualContractDate).format('Do MMMM YYYY')
                      : null
                  }
                />
                <DefaultItem
                  title="DIACONATE_ORDINATION"
                  body={father.deaconDate ? moment.utc(father.deaconDate).format('Do MMMM YYYY') : null}
                />
                <DefaultItem
                  title="PRIESTLY_ORDINATION"
                  body={father.priestDate ? moment.utc(father.priestDate).format('Do MMMM YYYY') : null}
                />
                {father.livingSituations &&
                  <Fragment>
                    <Text style={styles.sectionHeader}>{i18n.t('FATHER_DETAIL.PAST_HOMES')}</Text>
                    {profile.livingSituations.map((pastHomes) => (
                      <View>
                        <DefaultItem title="FILIATION" body={pastHomes.filiationName} img={pastHomes.filiationCountry} />
                        <DefaultItem title="HOME" body={pastHomes.houseName} img={pastHomes.houseCountry} />
                        <DefaultItem title="RESPONSIBLE_TERRITORY" body={pastHomes.responsibleTerritoryName} />
                        <DefaultItem title="START_DATE" date={pastHomes.startDate} lang={value.lang} />
                        <DefaultItem title="END_DATE" date={pastHomes.endDate} lang={value.lang} />
                        <Text style={styles.sectionHeader}></Text>
                      </View>
                    ))}
                  </Fragment>

                }


              </ScrollView>
              : <ActivityIndicator size="large" color={Colors.primaryColor} />}
          </View>



        )
      }
      }
    </I18nContext.Consumer>


  );
};

PatreDetailScreen.navigationOptions = (navigationData) => ({

  headerTitle: '',

});


const DefaultItem = ({
  title, body, selected, img, country_code, lang, date, id
}) => {
  let TouchableComp = TouchableOpacity;
  let formatedDate;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  if (date) {
    moment.locale(lang);
    formatedDate = moment.utc(date).format('dddd,  Do MMMM YYYY');
  }


  return (
    <TouchableComp
      onPress={() => {
        console.log('Apretado')
        selected ? selected() : null
      }}
    >
      <View
        style={{
          padding: 15,
          backgroundColor: Colors.surfaceColorSecondary,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View>
          <Text style={styles.listItemTitle}>{i18n.t('FATHER_DETAIL.' + title)}</Text>
          {country_code &&
            <Text style={styles.listItemBody}>{countries.getName(country_code, lang)}</Text>
          }
          {date &&
            <Text style={styles.listItemBody}>{formatedDate}</Text>
          }

          {body &&
            <Text style={styles.listItemBody}>{body}</Text>
          }
        </View>
        {img && (
          <View>
            <Flag id={img} size={0.2} />
          </View>
        )}
      </View>
    </TouchableComp>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 0,
    backgroundColor: Colors.surfaceColorPrimary,
  },
  sectionHeader: {
    fontFamily: 'work-sans-medium',
    color: Colors.onSurfaceColorPrimary,
    fontSize: 11,
    padding: 15,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  listItem: {
    backgroundColor: Colors.surfaceColorPrimary,
    paddingVertical: 15,
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
});

export default PatreDetailScreen;
