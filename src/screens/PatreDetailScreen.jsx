import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  TouchableNativeFeedback,
  Linking,
} from 'react-native';
import moment from 'moment';
import i18n from 'i18n-js';
import 'moment/min/locales';
import countries from 'i18n-iso-countries';
import * as Contacts from 'expo-contacts';
import * as Network from 'expo-network';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { NavigationEvents } from 'react-navigation';
import SnackBar from '../components/SnackBar';
import { I18nContext } from '../context/I18nProvider';
import Colors from '../constants/Colors';
import HeaderButton from '../components/HeaderButton';
import DefaultItem from '../components/FatherDetailItem';
import FatherContactInfo from '../components/FatherContactInfo';
import { getInterfaceData, getPerson } from '../api';
import { getDateFormatByLocale, getMonthFormatByLocale } from '../utils/date-utils';
import PastLivingSituations from '../components/PastLivingSituations';
import ModalProfilePicture from '../components/ModalProfilePicture';
import { MaterialIcons } from '@expo/vector-icons';
countries.registerLocale(require('i18n-iso-countries/langs/en.json'));
countries.registerLocale(require('i18n-iso-countries/langs/es.json'));
countries.registerLocale(require('i18n-iso-countries/langs/de.json'));
countries.registerLocale(require('i18n-iso-countries/langs/pt.json'));

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 0,
    backgroundColor: Colors.surfaceColorPrimary,
    justifyContent: 'center',
  },
  sectionHeader: {
    fontFamily: 'work-sans-medium',
    color: Colors.onSurfaceColorPrimary,
    fontSize: 11,
    padding: 15,
    textAlign: 'left',
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
    fontFamily: 'work-sans-bold',
    fontSize: 15,
    color: Colors.onSurfaceColorPrimary,
  },
  snackError: {
    backgroundColor: Colors.onSurfaceColorPrimary,
  },
});

const PatreDetailScreen = ({ navigation }) => {
  const [father, setFather] = useState(null);
  const [showSaveContact, setShowSaveContact] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const [viewFatherFields, setViewFatherFields] = useState([]);
  const [statusLabels, setStatusLabels] = useState({});
  const [modal, setModal] = useState(false);
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
        const contactId = await Contacts.addContactAsync(contact);
        setVisible(true);
        setSnackMsg(i18n.t('FATHER_DETAIL.SAVED_CONTACT'));
      } catch (err) {
        console.log(err);
      }

      /*  const contactId = await Contacts.addContactAsync(contact);
      console.log(contactId); */
    }
  };

  const loadInterfaceData = async (tempFather) => {
    const status = await Network.getNetworkStateAsync();

    if (status.isConnected) {
      getInterfaceData().then((res) => {
        const { livingConditionStatusLabels } = res.data.result;
        const viewPermRole = tempFather.viewPermissionForCurrentUser;
        const { personFieldsByViewPermission } = res.data.result;
        const viewRoles = Object.keys(personFieldsByViewPermission);
        const arrayOfRoles = viewRoles.map((rol) => {
          return personFieldsByViewPermission[rol];
        });
        const accumulatedFieldsPerRol = arrayOfRoles.map((rol) => {
          return rol;
        });

        const index = viewRoles.indexOf(viewPermRole);
        const viewFields = accumulatedFieldsPerRol[index];

        setStatusLabels(livingConditionStatusLabels);
        setViewFatherFields(viewFields);
      });
    }
  };

  useEffect(() => {
    const loadPerson = async () => {
      const status = await Network.getNetworkStateAsync();
      if (status.isConnected === true) {
        const fatherId = navigation.getParam('fatherId');
        getPerson(fatherId, false)
          .then((response) => {
            const resFather = response.data.result;
            setFather(resFather);
            console.log('resFather ', resFather);
            loadInterfaceData(resFather);
            if (navigation.getParam('updated')) {
              setSnackMsg(i18n.t('GENERAL.EDIT_SUCCESS'));
              setVisible(true);
            }
          })
          .catch(() => {
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
  return (
    <I18nContext.Consumer>
      {(value) => {
        moment.locale(value.lang);
        const dateFormatByLocale = getDateFormatByLocale(value.lang);
        const monthFormatByLocale = getMonthFormatByLocale(value.lang);

        return (
          <View style={styles.screen}>
            <ModalProfilePicture
              modalVisible={modal}
              fatherId={father ? father.personId : ''}
              fullName={father ? father.fullName : ''}
              photo={father ? father.photo : ''}
              Close={() => setModal(false)}
            />
            <NavigationEvents
              onDidFocus={() => {
                const loadPerson = async () => {
                  const status = await Network.getNetworkStateAsync();
                  if (status.isConnected === true) {
                    const fatherId = navigation.getParam('fatherId');
                    getPerson(fatherId, false)
                      .then((response) => {
                        const resFather = response.data.result;
                        setFather(resFather);
                        console.log('resFather ', resFather);
                        loadInterfaceData(resFather);
                      })
                      .catch(() => {
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
              }}
            />
            {father ? (
              <ScrollView>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                  <TouchableComp onPress={() => setModal(true)}>
                    {father.photo ? (
                      <Image
                        style={{ width: 100, height: 100, borderRadius: 50 }}
                        resizMode="center"
                        source={{ uri: `https://schoenstatt-fathers.link${father.photo}` }}
                      />
                    ) : (
                      <MaterialIcons name="add-a-photo" size={80} color="black" />
                    )}
                  </TouchableComp>
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
                    {father.personalInfoUpdatedOn && (
                      <View style={{ width: '75%' }}>
                        <Text style={{ color: Colors.onSurfaceColorSecondary, fontFamily: 'work-sans' }}>
                          {`${i18n.t('FATHER_DETAIL.LAST_UPDATE')}`}
                        </Text>
                        <Text style={{ color: Colors.onSurfaceColorSecondary, fontFamily: 'work-sans' }}>
                          {`${moment.utc(father.personalInfoUpdatedOn).format(dateFormatByLocale)}`}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <FatherContactInfo
                  father={father}
                  viewPermissions={viewFatherFields}
                  setSnackBarVisible={() => setVisible(true)}
                  setSnackMsg={(msg) => setSnackMsg(msg)}
                  handleSaveContact={() => {
                    handleSaveContact(father);
                  }}
                />
                {father.activeLivingSituation && (
                  <>
                    <Text style={styles.sectionHeader}>{i18n.t('FATHER_DETAIL.CURRENT_HOME')}</Text>
                    <DefaultItem
                      show={viewFatherFields.indexOf('activeLivingSituation')}
                      title="FATHER_DETAIL.FILIATION"
                      body={father.activeLivingSituation.filiationName}
                      img={father.activeLivingSituation.filiationCountry}
                      badge={
                        father.activeLivingSituation.status !== 'intern' && statusLabels
                          ? statusLabels[father.activeLivingSituation.status]
                          : null
                      }
                      selected={() => {
                        navigation.navigate('FiliationDetail', {
                          filiationId: father.activeLivingSituation.filiationId,
                        });
                      }}
                    />

                    <DefaultItem
                      show={viewFatherFields.indexOf('activeLivingSituation') !== -1}
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
                {father.assignments.length ? (
                  <Text style={styles.sectionHeader}>{i18n.t('FATHER_DETAIL.ASSIGNMENTS')}</Text>
                ) : (
                  <></>
                )}
                {father.assignments.map((e) => {
                  return (
                    <DefaultItem
                      show={true}
                      body={e.name}
                      listItemBody={e.isActive ? styles.listItemBody : false}
                      selected={() => {
                        switch (e.entityType) {
                          case 'course':
                            navigation.navigate('CourseDetail', { courseId: e.entityId });
                            break;
                          case 'generation':
                            navigation.navigate('GenerationDetail', { generationId: e.entityId });
                            break;
                          case 'filiation':
                            navigation.navigate('FiliationDetail', { filiationId: e.entityId });
                            break;
                          case 'territory':
                            navigation.navigate('DelegationDetail', { delegationId: e.entityId });
                            break;
                        }
                      }}
                    />
                  );
                })}

                {(father.country ||
                  father.homeTerritoryName ||
                  father.courseName ||
                  father.generationName ||
                  father.birthDate ||
                  father.nameDay ||
                  father.baptismDate ||
                  father.postulancyDate ||
                  father.novitiateDate ||
                  father.communityMembershipDate ||
                  father.perpetualContractDate ||
                  father.deaconDate ||
                  father.priestDate ||
                  father.bishopDate) && (
                  <Text style={styles.sectionHeader}>{i18n.t('FATHER_DETAIL.PERSONAL_INFO')}</Text>
                )}

                <DefaultItem
                  show={viewFatherFields.indexOf('country') !== -1}
                  title="FATHER_DETAIL.HOME_COUNTRY"
                  img={father.country}
                  country_code={father.country}
                  lang={value.lang}
                />

                <DefaultItem
                  show={viewFatherFields.indexOf('homeTerritoyName') !== -1}
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
                  body={father.birthDate ? moment.utc(father.birthDate).format(dateFormatByLocale) : null}
                />
                <DefaultItem
                  show={viewFatherFields.indexOf('nameDay')}
                  title="FATHER_DETAIL.NAMEDAY"
                  body={father.nameDay ? moment.utc(father.nameDay).format(monthFormatByLocale) : null}
                />
                <DefaultItem
                  show={viewFatherFields.indexOf('baptismDate')}
                  title="FATHER_DETAIL.BAPTISM"
                  body={father.baptismDate ? moment.utc(father.baptismDate).format(dateFormatByLocale) : null}
                />
                <DefaultItem
                  show={viewFatherFields.indexOf('postulancyDate') !== -1}
                  title="FATHER_DETAIL.POSTULANCY_ADMITTANCE"
                  body={father.postulancyDate ? moment.utc(father.postulancyDate).format(dateFormatByLocale) : null}
                />
                <DefaultItem
                  show={viewFatherFields.indexOf('novitiateDate') !== -1}
                  title="FATHER_DETAIL.NOVITIATE_START"
                  body={father.novitiateDate ? moment.utc(father.novitiateDate).format(dateFormatByLocale) : null}
                />
                <DefaultItem
                  show={viewFatherFields.indexOf('communityMembershipDate') !== -1}
                  title="FATHER_DETAIL.COMMUNITY_MEMBERSHIP"
                  body={
                    father.communityMembershipDate
                      ? moment.utc(father.communityMembershipDate).format(dateFormatByLocale)
                      : null
                  }
                />
                <DefaultItem
                  show={viewFatherFields.indexOf('perpetualContractDate') !== -1}
                  title="FATHER_DETAIL.PERPETUAL_CONTRACT"
                  body={
                    father.perpetualContractDate
                      ? moment.utc(father.perpetualContractDate).format(dateFormatByLocale)
                      : null
                  }
                />
                <DefaultItem
                  show={viewFatherFields.indexOf('deaconDate') !== -1}
                  title="FATHER_DETAIL.DIACONATE_ORDINATION"
                  body={father.deaconDate ? moment.utc(father.deaconDate).format(dateFormatByLocale) : null}
                />
                <DefaultItem
                  show={viewFatherFields.indexOf('priestYears') !== -1}
                  title="FATHER_DETAIL.PRIESTLY_ORDINATION"
                  body={father.priestDate ? moment.utc(father.priestDate).format(dateFormatByLocale) : null}
                />
                <DefaultItem
                  show={viewFatherFields.indexOf('bishopDate') !== -1}
                  title="FATHER_DETAIL.BISHOP_DATE"
                  body={father.bishopDate ? moment.utc(father.bishopDate).format(dateFormatByLocale) : null}
                />

                <PastLivingSituations
                  livingSituations={father.livingSituations}
                  viewFields={viewFatherFields && viewFatherFields}
                  statusLabels={statusLabels && statusLabels}
                  lang={value.lang}
                  allowUpdate={father && father.allowUpdateLivingSituation}
                  father={father}
                />
              </ScrollView>
            ) : (
              <ActivityIndicator size="large" color={Colors.primaryColor} />
            )}
            <SnackBar visible={visible} onDismiss={() => setVisible(false)}>
              {snackMsg}
            </SnackBar>
          </View>
        );
      }}
    </I18nContext.Consumer>
  );
};

PatreDetailScreen.navigationOptions = (navigationData) => ({
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

export default PatreDetailScreen;
