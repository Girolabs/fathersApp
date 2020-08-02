import React, { useEffect, useState } from 'react';
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
  Clipboard,
} from 'react-native';
import { Flag } from 'react-native-svg-flagkit';
import moment from 'moment';
import i18n from 'i18n-js';
import 'moment/min/locales';
import Constants from 'expo-constants';
import countries from 'i18n-iso-countries';
import * as Contacts from 'expo-contacts';
import * as Network from 'expo-network';
import { Snackbar } from 'react-native-paper';
import { Ionicons } from 'expo-vector-icons';
import axios from '../../axios-instance';
import { I18nContext } from '../context/I18nProvider';
import Colors from '../constants/Colors';
import SocialIcons from '../components/SocialIcons';

countries.registerLocale(require('i18n-iso-countries/langs/en.json'));
countries.registerLocale(require('i18n-iso-countries/langs/es.json'));
countries.registerLocale(require('i18n-iso-countries/langs/de.json'));
countries.registerLocale(require('i18n-iso-countries/langs/pt.json'));

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
  snackError: {
    backgroundColor: Colors.secondaryColor,
  },
});

const PatreDetailScreen = ({ navigation }) => {
  const [father, setFather] = useState(null);
  const [showSaveContact, setShowSaveContact] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const [viewFatherFields, setViewFatherFields] = useState([]);

  let TouchableComp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  const handleSaveContact = async (father) => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      try {
        const contact = {
          [Contacts.Fields.FirstName]: father.friendlyFirstName,
          [Contacts.Fields.LastName]: father.friendlyLastName,
          [Contacts.Fields.PhoneNumbers]: [
            {
              label: 'mobile',
              number: father.phones ? father.phones[0].number : null,
            },
          ],
          [Contacts.Fields.Emails]: [
            {
              email: father.email ? father.email : null,
            },
          ],
        };
        console.log('contact', contact);
        console.log('spanshot', contact);
        const contactId = await Contacts.addContactAsync(contact);
        setVisible(true);
        setSnackMsg(i18n.t('FATHER_DETAIL.SAVED_CONTACT'));

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
        } else {
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
      } catch (err) {
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

      /*  const contactId = await Contacts.addContactAsync(contact);
      console.log(contactId); */
    } else {
      console.log('no tengo');
    }
  };

  const loadInterfaceData = async (tempFather) => {
    const status = await Network.getNetworkStateAsync();

    if (status.isConnected == true) {
      axios.get(`${i18n.locale}/api/v1/interface-data`).then((response) => {
        const viewPermRole = tempFather.viewPermissionForCurrentUser;
        const { personFieldsByViewPermission } = response.data.result;

        const viewRoles = Object.keys(personFieldsByViewPermission);

        const arrayOfRoles = viewRoles.map((rol) => {
          return personFieldsByViewPermission[rol];
        });

        const accumulatedFieldsPerRol = arrayOfRoles.map((rol, index) => {
          /* let accu = [];
          arrayOfRoles.forEach((el,i) => {
            if(i <= index) {
              accu = accu.concat(el);
            }
          }) */
          return rol;
        });

        const index = viewRoles.indexOf(viewPermRole);

        const viewFields = accumulatedFieldsPerRol[index];

        setViewFatherFields(viewFields);
      });
    }
  };

  useEffect(() => {
    /* (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        setShowSaveContact(true);
      }
    })(); */
    const loadPerson = async () => {
      const status = await Network.getNetworkStateAsync();
      if (status.isConnected === true) {
        const fatherId = navigation.getParam('fatherId');
        axios
          .get(
            `${i18n.locale}/api/v1/persons/${fatherId}?fields=all&authorized=true&key=${Constants.manifest.extra.secretKey}`,
          )
          .then((response) => {
            console.log('[PatreDetail]', response.data.result);
            const resFather = response.data.result;
            setFather(resFather);
            loadInterfaceData(resFather);

            console.log('father', father);
          })
          .catch((err) => {
            setLoading(false);
            setVisible(true);
            setSnackMsg(i18n.t('GENERAL.ERROR'));
          });
      } else {
        setLoading(false);
        setVisible(true);
        setSnackMsg(i18n.t('GENERAL.NO_INTERNET'));
      }
    };
    loadPerson();
  }, []);

  console.log('[PatreDetail]', viewFatherFields);
  return (
    <I18nContext.Consumer>
      {(value) => {
        moment.locale(value.lang);
        return (
          <View style={styles.screen}>
            {father ? (
              <ScrollView>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                  <Image
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                    resizMode="center"
                    source={{ uri: `https://schoenstatt-fathers.link${father.photo}` }}
                  />
                  <View style={{ padding: 15, width: '80%' }}>
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
                          father.personalInfoUpdatedOn
                            ? moment.utc(father.personalInfoUpdatedOn).format('Do MMMM YYYY')
                            : ''
                        }`}
                      </Text>
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                  }}
                >
                  <Text style={styles.sectionHeader}>{i18n.t('FATHER_DETAIL.CONTACT_INFO')}</Text>
                  {father.personId && (
                    <TouchableComp
                      onPress={() => {
                        console.log('go to fatherform');
                        navigation.navigate('FatherForm', {
                          fatherId: father.personId,
                        });
                      }}
                    >
                      <Ionicons name="md-create" size={23} color={Colors.primaryColor} />
                    </TouchableComp>
                  )}
                </View>

                <DefaultItem
                  show={viewFatherFields.indexOf('email')}
                  title="FATHER_DETAIL.EMAIL"
                  body={father.email}
                  icon={<Ionicons name="ios-copy" size={23} color={Colors.primaryColor} />}
                  selected={() => {
                    const value = father.email;
                    Clipboard.setString(value);
                    setVisible(true);
                    setSnackMsg(i18n.t('GENERAL.COPY_CLIPBOARD'));
                  }}
                />
                {father.phones.length >= 1 && (
                  <DefaultItem
                    title="FATHER_DETAIL.MAIN_CELL_PHONE"
                    body={father.phones[0] !== undefined ? father.phones[0].number : null}
                    icon={<Ionicons name="ios-copy" size={23} color={Colors.primaryColor} />}
                    selected={() => {
                      const value = father.phones[0] !== undefined ? father.phones[0].number : null;
                      Clipboard.setString(value);
                      setVisible(true);
                      setSnackMsg(i18n.t('GENERAL.COPY_CLIPBOARD'));
                    }}
                  />
                )}

                {father.phones.length > 1 && (
                  <DefaultItem
                    show={viewFatherFields.indexOf('phones')}
                    title="FATHER_DETAIL.HOME"
                    body={father.phones[1] !== undefined ? father.phones[1].number : ''}
                    icon={<Ionicons name="ios-copy" size={23} color={Colors.primaryColor} />}
                    selected={() => {
                      const value = father.phones[1] !== undefined ? father.phones[1].number : '';
                      Clipboard.setString(value);
                      setVisible(true);
                      setSnackMsg(i18n.t('GENERAL.COPY_CLIPBOARD'));
                    }}
                  />
                )}

                <View style={{ flexDirection: 'row', width: '100%', marginVertical: 10 }}>
                  <TouchableComp
                    onPress={() => {
                      handleSaveContact(father);
                    }}
                  >
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

                  <SocialIcons
                    wa={
                      father.phones.length >= 1 && father.phones[0].whatsApp === true ? father.phones[0].number : false
                    }
                    fb={father.facebookUrl}
                    slack={father.slackUser}
                    tw={father.twitterUser}
                    ig={father.instagramUser}
                    skype={father.skypeUser}
                    size={24}
                  />
                </View>

                <Text style={styles.sectionHeader}>{i18n.t('FATHER_DETAIL.CURRENT_HOME')}</Text>
                {father.activeLivingSituation && (
                  <>
                    <DefaultItem
                      show={viewFatherFields.indexOf('activeLivingSituation')}
                      title="FATHER_DETAIL.FILIATION"
                      body={father.activeLivingSituation.filiationName}
                      img={father.activeLivingSituation.filiationCountry}
                      selected={() => {
                        navigation.navigate('FiliationDetail', {
                          filiationId: father.activeLivingSituation.filiationId,
                        });
                      }}
                    />

                    <DefaultItem
                      show={viewFatherFields.indexOf('activeLivingSituation')}
                      title="FATHER_DETAIL.HOME"
                      body={father.activeLivingSituation.houseName}
                      img={father.activeLivingSituation.houseCountry}
                      selected={() => {
                        navigation.navigate('HouseDetail', { houseId: father.activeLivingSituation.houseId });
                      }}
                    />
                    <DefaultItem
                      show={viewFatherFields.indexOf('activeLivingSituation')}
                      title="FATHER_DETAIL.RESPONSIBLE_TERRITORY"
                      body={father.activeLivingSituation.responsibleTerritoryName}
                      selected={() => {
                        navigation.navigate('DelegationDetail', {
                          delegationId: father.activeLivingSituation.responsibleTerritoryId,
                        });
                      }}
                    />
                  </>
                )}

                <Text style={styles.sectionHeader}>{i18n.t('FATHER_DETAIL.PERSONAL_INFO')}</Text>

                <DefaultItem
                  show={viewFatherFields.indexOf('country')}
                  title="FATHER_DETAIL.HOME_COUNTRY"
                  img={father.country}
                  country_code={father.country}
                  lang={value.lang}
                />

                <DefaultItem
                  show={viewFatherFields.indexOf('homeTerritoyName')}
                  title="FATHER_DETAIL.HOME_TERRITORY"
                  body={father.homeTerritoryName}
                  selected={() => {
                    navigation.navigate('DelegationDetail', {
                      delegationId: father.homeTerritoryId,
                    });
                  }}
                />
                <DefaultItem
                  show={viewFatherFields.indexOf('courseName')}
                  title="FATHER_DETAIL.COURSE"
                  body={father.courseName}
                  selected={() => {
                    navigation.navigate('CourseDetail', { courseId: father.courseId });
                  }}
                />

                <DefaultItem
                  show={viewFatherFields.indexOf('generationName')}
                  title="FATHER_DETAIL.GENERATION"
                  body={father.generationName}
                  selected={() => {
                    navigation.navigate('GenerationDetail', { generationId: father.generationId });
                  }}
                />
                <DefaultItem
                  show={viewFatherFields.indexOf('birthDate')}
                  title="FATHER_DETAIL.BIRTHDAY"
                  body={father.birthDate ? moment.utc(father.birthDate).format('Do MMMM YYYY') : null}
                />
                <DefaultItem
                  show={viewFatherFields.indexOf('nameDay')}
                  title="FATHER_DETAIL.NAMEDAY"
                  body={father.nameDay ? moment.utc(father.nameDay).format('Do MMMM YYYY') : null}
                />
                <DefaultItem
                  show={viewFatherFields.indexOf('baptismDate')}
                  title="FATHER_DETAIL.BAPTISM"
                  body={father.baptismDate ? moment.utc(father.baptismDate).format('Do MMMM YYYY') : null}
                />
                <DefaultItem
                  show={viewFatherFields.indexOf('postulancyDate') !== -1}
                  title="FATHER_DETAIL.POSTULANCY_ADMITTANCE"
                  body={father.postulancyDate ? moment.utc(father.postulancyDate).format('Do MMMM YYYY') : null}
                />
                <DefaultItem
                  show={viewFatherFields.indexOf('novitiateDate') !== -1}
                  title="FATHER_DETAIL.NOVITIATE_START"
                  body={father.novitiateDate ? moment.utc(father.novitiateDate).format('Do MMMM YYYY') : null}
                />
                <DefaultItem
                  show={viewFatherFields.indexOf('communityMembershipDate') !== -1}
                  title="FATHER_DETAIL.COMMUNITY_MEMBERSHIP"
                  body={
                    father.communityMembershipDate
                      ? moment.utc(father.communityMembershipDate).format('Do MMMM YYYY')
                      : null
                  }
                />
                <DefaultItem
                  show={viewFatherFields.indexOf('perpetualContractDate') !== -1}
                  title="FATHER_DETAIL.PERPETUAL_CONTRACT"
                  body={
                    father.perpetualContractDate
                      ? moment.utc(father.perpetualContractDate).format('Do MMMM YYYY')
                      : null
                  }
                />
                <DefaultItem
                  show={viewFatherFields.indexOf('deaconDate') !== -1}
                  title="FATHER_DETAIL.DIACONATE_ORDINATION"
                  body={father.deaconDate ? moment.utc(father.deaconDate).format('Do MMMM YYYY') : null}
                />
                <DefaultItem
                  show={viewFatherFields.indexOf('priestYears') !== -1}
                  title="FATHER_DETAIL.PRIESTLY_ORDINATION"
                  body={father.priestDate ? moment.utc(father.priestDate).format('Do MMMM YYYY') : null}
                />
                {father.livingSituations && (
                  <>
                    <Text style={styles.sectionHeader}>{i18n.t('FATHER_DETAIL.PAST_HOMES')}</Text>
                    {father.livingSituations.map((pastHomes) => (
                      <View>
                        <DefaultItem
                          show={viewFatherFields.indexOf('livingSituations') !== -1}
                          title="FATHER_DETAIL.FILIATION"
                          body={pastHomes.filiationName}
                          img={pastHomes.filiationCountry}
                        />
                        <DefaultItem
                          show={viewFatherFields.indexOf('livingSituations') !== -1}
                          title="FATHER_DETAIL.HOME"
                          body={pastHomes.houseName}
                          img={pastHomes.houseCountry}
                        />
                        <DefaultItem
                          show={viewFatherFields.indexOf('livingSituations') !== -1}
                          title="FATHER_DETAIL.RESPONSIBLE_TERRITORY"
                          body={pastHomes.responsibleTerritoryName}
                        />
                        <DefaultItem
                          show={viewFatherFields.indexOf('livingSituations') !== -1}
                          title="FATHER_DETAIL.START_DATE"
                          date={pastHomes.startDate}
                          lang={value.lang}
                        />
                        <DefaultItem title="FATHER_DETAIL.END_DATE" date={pastHomes.endDate} lang={value.lang} />
                        <Text style={styles.sectionHeader} />
                      </View>
                    ))}
                  </>
                )}
              </ScrollView>
            ) : (
              <ActivityIndicator size="large" color={Colors.primaryColor} />
            )}
            <Snackbar visible={visible} onDismiss={() => setVisible(false)} style={styles.snackError}>
              {snackMsg}
            </Snackbar>
          </View>
        );
      }}
    </I18nContext.Consumer>
  );
};

PatreDetailScreen.navigationOptions = () => ({
  headerTitle: '',
});

const DefaultItem = ({ title, body, selected, img, country_code, lang, date, id, show, icon }) => {
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
    <>
      {show && (
        <>
          {(body || date) && (
            <TouchableComp
              onPress={() => {
                console.log('Apretado');
                selected ? selected() : null;
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
                  {title && <Text style={styles.listItemTitle}>{i18n.t(title)}</Text>}

                  {country_code && <Text style={styles.listItemBody}>{countries.getName(country_code, lang)}</Text>}
                  {date && <Text style={styles.listItemBody}>{formatedDate}</Text>}

                  {body && <Text style={styles.listItemBody}>{body}</Text>}
                </View>
                {img && (
                  <View>
                    <Flag id={img} size={0.2} />
                  </View>
                )}
                {icon && icon}
              </View>
            </TouchableComp>
          )}
        </>
      )}
    </>
  );
};

export default PatreDetailScreen;
