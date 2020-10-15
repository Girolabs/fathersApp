import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import InputWithFormik from '../components/InputWithFormik';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import * as Network from 'expo-network';
import i18n from 'i18n-js';
import SnackBar from '../components/SnackBar';
import Colors from '../constants/Colors';
import { NavigationEvents } from 'react-navigation';
import { getPerson, getInterfaceData, updateFatherForm } from '../api';
import Button from '../components/Button';
import SwitchWithFormik from '../components/SwitchWithFormik';
import Select from '../components/Select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as _ from 'lodash';
import { Ionicons } from 'expo-vector-icons';
import RNPickerSelect from 'react-native-picker-select';

const widthBtn = Platform.OS == 'android' ? '45%' : '100%';
const styles = StyleSheet.create({
  snackError: {
    backgroundColor: Colors.secondaryColor,
  },
  btnContainer: {
    backgroundColor: 'white',
    borderColor: Colors.primaryColor,
    borderRadius: 5,
    borderWidth: 2,
    paddingHorizontal: 10,
    width: widthBtn,
    height: 50,
    marginHorizontal: 15,
    justifyContent: 'center',
    marginVertical: 10,
  },
  btnText: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'work-sans-bold',
    textTransform: 'uppercase',
    color: Colors.primaryColor,
  },
  buttonsContainer: {
    flexDirection: 'row',
    paddingRight: 20,
    justifyContent: 'space-between',
  },
  screen: {
    backgroundColor: Colors.surfaceColorPrimary,
    flex: 1,
    justifyContent: 'center',
  },
  select: {
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  selectAndroid: {
    width: '92%',
    borderRadius: 5,
    height: 55,
    backgroundColor: '#f6f6f6',
    borderColor: '#313142',
    borderWidth: 1,
    marginLeft: 15,
  },
  selectIos: {
    width: '92%',
    height: 50,
    backgroundColor: '#f6f6f6',
    borderColor: '#313142',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginLeft: 15,
    borderRadius: 5,
  },
  selectContainer: {
    backgroundColor: Colors.surfaceColorSecondary,
    borderRadius: 5,
    marginVertical: 5,
    padding: 0,
  },
  label: {
    fontFamily: 'work-sans-semibold',
    fontSize: 18,
    color: Colors.primaryColor,
    paddingHorizontal: 15,
  },
  inputContainer: {
    width: '93%',
    height: 50,
    backgroundColor: '#f1f2f7',
    borderColor: Colors.onSurfaceColorPrimary,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginLeft: 15,
    borderRadius: 5,
  },
  inputDatePicker: {
    width: '80%',
  },
  dateContainer: {
    paddingVertical: 15,
  },
});

const stylePicker = {
  inputAndroid: {
    backgroundColor: Colors.surfaceColorSecondary,
    borderRadius: 10,
  },
  inputIOS: {
    width: '92%',
    height: 50,
    backgroundColor: '#f6f6f6',
    borderColor: '#313142',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginLeft: 15,
    borderRadius: 5,
  },
  iconContainer: {
    top: 17,
    right: 35,
  },
};
class FatherFormScreen extends Component {
  state = {
    father: {},
    loading: true,
    updateFields: [],
    keyboardAV: '',
    phoneLabels: [],
    personEmergencyOptions: [],
    openDeaconDate: false,
    openPriestDate: false,
    openBishopDate: false,
    openDeathDate: false,
    openLeaveDate: false,
  };
  async componentDidMount() {
    this.setState({ loading: true });
    await this.loadPerson();
  }

  loadInterfaceData = async (father) => {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected == true) {
      getInterfaceData().then((response) => {
        const updatePermRole = father.updatePermissionForCurrentUser;
        const personPhoneLabels = response.data.result.personPhoneLabels;
        const personEmergencyOptions = response.data.result.personEmergencyContactRelationOptions;
        const personFieldsByUpdatePermission = response.data.result.personFieldsByUpdatePermission;
        let updateRoles = Object.keys(personFieldsByUpdatePermission);
        const arrayOfRoles = updateRoles.map((rol) => {
          return personFieldsByUpdatePermission[rol];
        });
        const accumulatedFieldsPerRol = arrayOfRoles.map((rol, index) => {
          return rol;
        });
        let index = updateRoles.indexOf(updatePermRole);
        const updateFields = accumulatedFieldsPerRol[index];
        let temp = Object.entries(personPhoneLabels);
        let arrayOfPhonesLabels = temp.map((e) => ({ label: e[1], value: e[0] }));

        temp = Object.entries(personEmergencyOptions);
        console.log('arrayOfPhonesLabels  ', arrayOfPhonesLabels);
        let arrayOfPersonEmergencyOptions = temp.map((e) => ({ label: e[1], value: e[0] }));
        console.log('arrayOfPersonEmergencyOptions ', arrayOfPersonEmergencyOptions);
        // Object.keys(c).map((key) => {
        //   arrayOfPersonEmergencyOptions.push({ name: personEmergencyOptions[key], value: personEmergencyOptions[key] });
        // });

        const regex = {
          facebookUrlRegex:
            '(?:(?:http|https)://)?(?:www.)?facebook.com/(?:(?:w)*#!/)?(?:pages/)?(?:[?w-]*/)?(?:profile.php?id=(?=d.*))?([w-]*)?',
          instagramUserRegex:
            response.data.result.instagramUserRegex &&
            response.data.result.instagramUserRegex.substring(1, response.data.result.instagramUserRegex.length - 1),
          skypeUserRegex:
            response.data.result.skypeUserRegex &&
            response.data.result.skypeUserRegex.substring(1, response.data.result.skypeUserRegex.length - 1),
          slackUserRegex:
            response.data.result.slackUserRegex &&
            response.data.result.slackUserRegex.substring(1, response.data.result.slackUserRegex.length - 1),
          twitterUserRegex:
            response.data.result.twitterUserRegex &&
            response.data.result.twitterUserRegex.substring(1, response.data.result.twitterUserRegex.length - 1),
          phoneNumberRegex:
            response.data.result.phoneNumberRegex &&
            response.data.result.phoneNumberRegex.substring(1, response.data.result.phoneNumberRegex.length - 1),
        };
        this.setState({
          fieldsPerm: accumulatedFieldsPerRol,
          regex: regex,
          loading: false,
          updateFields,
          phoneLabels: arrayOfPhonesLabels,
          personEmergencyOptions: arrayOfPersonEmergencyOptions,
        });
      });
    }
  };

  loadPerson = async () => {
    this.setState({ loading: true });
    const { navigation } = this.props;
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected === true) {
      let fatherId = this.props.navigation.getParam('fatherId');
      if (!fatherId) {
        fatherId = await AsyncStorage.getItem('fatherId');
        fatherId = JSON.parse(fatherId);
      } else {
        AsyncStorage.setItem('fatherId', JSON.stringify(fatherId));
      }

      if (fatherId) {
        getPerson(fatherId, 'all').then((response) => {
          const father = response.data.result;
          this.setState({ father });

          this.loadInterfaceData(response.data.result);
        });
      }
    } else {
      this.setState({ loading: false, visible: true, snackMsg: i18n.t('GENERAL.NO_INTERNET') });
    }
  };

  formatDate = (selectedDate) => {
    const newDate = new Date();
    newDate.setTime(selectedDate.getTime() + selectedDate.getTimezoneOffset() * 60 * 1000);
    selectedDate = newDate;
    const year = selectedDate.getUTCFullYear();
    const month =
      selectedDate.getUTCMonth() + 1 < 10 ? `0${selectedDate.getUTCMonth() + 1}` : selectedDate.getUTCMonth() + 1;
    const day = selectedDate.getUTCDate();
    const dateString = `${year}-${month}-${day}`;
    return dateString;
  };

  render() {
    const { father, updateFields, regex, loading } = this.state;
    let { navigation } = this.props;
    let validationSchema;
    if (regex) {
      validationSchema = Yup.object().shape({
        ...(updateFields.indexOf('firstName') != -1
          ? { firstName: Yup.string().required().max(50, i18n.t('FATHER_EDIT.LESSTHAN50')) }
          : null),
        ...(updateFields.indexOf('lastName') != -1
          ? { lastName: Yup.string().required().max(50, i18n.t('FATHER_EDIT.LESSTHAN50')) }
          : null),
        ...(updateFields.indexOf('friendlyFirstName') != -1
          ? { friendlyFirstName: Yup.string().required().max(50, i18n.t('FATHER_EDIT.LESSTHAN50')) }
          : null),
        ...(updateFields.indexOf('friendlyLastName') != -1
          ? { friendlyLastName: Yup.string().required().max(50, i18n.t('FATHER_EDIT.LESSTHAN50')) }
          : null),
        ...(updateFields.indexOf('email') != -1
          ? { email: Yup.string().email().max(70, i18n.t('FATHER_EDIT.LESSTHAN70')).nullable() }
          : null),
        ...(updateFields.indexOf('email2') != -1
          ? { email2: Yup.string().email().max(70, i18n.t('FATHER_EDIT.LESSTHAN70')).nullable() }
          : null),
        ...(updateFields.indexOf('cellPhone') != -1
          ? { cellPhone: Yup.string().matches(regex.phoneNumberRegex).nullable() }
          : null),
        ...(updateFields.indexOf('slackUser') != -1
          ? { slackUser: Yup.string().matches(regex.slackUserRegex).nullable() }
          : null),
        ...(updateFields.indexOf('instagramUser') != -1
          ? { instagramUser: Yup.string().matches(regex.instagramUserRegex).nullable() }
          : null),
        ...(updateFields.indexOf('twitterUser') != -1
          ? { twitterUser: Yup.string().matches(regex.twitterUserRegex).nullable() }
          : null),
        ...(updateFields.indexOf('skypeUser') != -1
          ? { skypeUser: Yup.string().matches(regex.skypeUserRegex).nullable() }
          : null),
        ...(updateFields.indexOf('phone1') != -1
          ? { phone1: Yup.string().matches(regex.phoneNumberRegex).nullable() }
          : null),
        ...(updateFields.indexOf('phone2') != -1
          ? { phone2: Yup.string().matches(regex.phoneNumberRegex).nullable() }
          : null),
        ...(updateFields.indexOf('phone3') != -1
          ? { phone2: Yup.string().matches(regex.phoneNumberRegex).nullable() }
          : null),
        ...(updateFields.indexOf('facebookUrl') != -1
          ? { facebookUrl: Yup.string().matches(regex.facebookUrlRegex).nullable() }
          : null),
        ...(updateFields.indexOf('contactNotes') != -1
          ? { contactNotes: Yup.string().max(2000, i18n.t('FATHER_EDIT.LESSTHAN2000')).nullable() }
          : null),
        ...(updateFields.indexOf('emergencyContact1Name') != -1
          ? { emergencyContact1Name: Yup.string().max(255, i18n.t('FATHER_EDIT.LESSTHAN255 ')).nullable() }
          : null),
        ...(updateFields.indexOf('emergencyContact2Name') != -1
          ? { emergencyContact2Name: Yup.string().max(255, i18n.t('FATHER_EDIT.LESSTHAN255 ')).nullable() }
          : null),
        ...(updateFields.indexOf('emergencyContact1Phone') != -1
          ? { emergencyContact1Phone: Yup.string().matches(regex.phoneNumberRegex).nullable() }
          : null),
        ...(updateFields.indexOf('emergencyContact2Phone') != -1
          ? { emergencyContact2Phone: Yup.string().matches(regex.phoneNumberRegex).nullable() }
          : null),
      });
    }

    return (
      <>
        <NavigationEvents
          onDidFocus={async () => {
            await this.loadPerson();
          }}
        />
        <SafeAreaView style={styles.screen}>
          {!loading ? (
            <>
              <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? this.state.keyboardAV : 'height'}>
                <ScrollView>
                  <View style={{ paddingHorizontal: 15, marginVertical: 30, width: '80%' }}>
                    <Text
                      style={{
                        fontFamily: 'work-sans-semibold',
                        fontSize: 24,
                        color: Colors.primaryColor,
                      }}
                    >
                      {i18n.t('FATHER_EDIT.EDIT')}
                    </Text>
                  </View>
                  <Formik
                    initialValues={{
                      ...(updateFields.indexOf('firstName') != -1 && !!father.firstName
                        ? { firstName: father.firstName }
                        : { firstName: null }),
                      ...(updateFields.indexOf('lastName') != -1 && !!father.lastName
                        ? { lastName: father.lastName }
                        : { lastName: null }),
                      ...(updateFields.indexOf('friendlyFirstName') != -1 && !!father.friendlyFirstName
                        ? { friendlyFirstName: father.friendlyFirstName }
                        : { friendlyFirstName: null }),
                      ...(updateFields.indexOf('friendlyLastName') != -1 && !!father.friendlyLastName
                        ? { friendlyLastName: father.friendlyLastName }
                        : { friendlyLastName: null }),
                      ...(updateFields.indexOf('email') != -1 && !!father.email
                        ? { email: father.email }
                        : { email: null }),
                      ...(updateFields.indexOf('email2') != -1 && !!father.email2
                        ? { email2: father.email2 }
                        : { email2: null }),
                      ...(updateFields.indexOf('cellPhone') != -1 && !!father.cellPhone
                        ? { cellPhone: father.cellPhone }
                        : { cellPhone: null }),
                      ...(updateFields.indexOf('cellPhoneHasWhatsApp') != -1 && !!father.cellPhoneHasWhatsApp
                        ? { cellPhoneHasWhatsApp: !!father.cellPhoneHasWhatsApp }
                        : { cellPhoneHasWhatsApp: null }),
                      ...(updateFields.indexOf('slackUser') != -1 && !!father.slackUser
                        ? { slackUser: father.slackUser }
                        : { slackUser: null }),
                      ...(updateFields.indexOf('instagramUser') != -1 && !!father.instagramUser
                        ? { instagramUser: father.instagramUser }
                        : { instagramUser: null }),
                      ...(updateFields.indexOf('twitterUser') != -1 && !!father.twitterUser
                        ? { twitterUser: father.twitterUser }
                        : { twitterUser: null }),
                      ...(updateFields.indexOf('facebookUrl') != -1 && !!father.facebookUrl
                        ? { facebookUrl: father.facebookUrl }
                        : { facebookUrl: null }),
                      ...(updateFields.indexOf('skypeUser') != -1 && !!father.skypeUser
                        ? { skypeUser: father.skypeUser }
                        : { skypeUser: null }),
                      ...(updateFields.indexOf('phone1') != -1 && !!father.phone1
                        ? { phone1: father.phone1 }
                        : { phone1: null }),
                      ...(updateFields.indexOf('phone1Label') != -1 && !!father.phone1Label
                        ? { phone1Label: father.phone1Label }
                        : { phone1Label: null }),
                      ...(updateFields.indexOf('phone2') != -1 && !!father.phone2
                        ? { phone2: father.phone2 }
                        : { phone2: null }),
                      ...(updateFields.indexOf('phone2Label') != -1 && !!father.phone2Label
                        ? { phone2Label: father.phone2Label }
                        : { phone2Label: null }),
                      ...(updateFields.indexOf('phone3') != -1 && !!father.phone2
                        ? { phone3: father.phone3 }
                        : { phone3: null }),
                      ...(updateFields.indexOf('phone3Label') != -1 && !!father.phone3Label
                        ? { phone3Label: father.phone3Label }
                        : { phone3Label: null }),
                      ...(updateFields.indexOf('contactNotes') != -1 && !!father.contactNotes
                        ? { contactNotes: father.contactNotes }
                        : { contactNotes: null }),
                      ...(updateFields.indexOf('deaconDate') != -1 && !!father.deaconDate
                        ? { deaconDate: father.deaconDate.split('T')[0] }
                        : { deaconDate: null }),
                      ...(updateFields.indexOf('priestDate') != -1 && !!father.priestDate
                        ? { priestDate: father.priestDate.split('T')[0] }
                        : { priestDate: null }),
                      ...(updateFields.indexOf('bishopDate') != -1 && !!father.bishopDate
                        ? { bishopDate: father.bishopDate.split('T')[0] }
                        : { bishopDate: null }),
                      ...(updateFields.indexOf('deathDate') != -1 && !!father.deathDate
                        ? { deathDate: father.deathDate.split('T')[0] }
                        : { deathDate: null }),
                      ...(updateFields.indexOf('leaveDate') != -1 && !!father.leaveDate
                        ? { leaveDate: father.leaveDate.split('T')[0] }
                        : { leaveDate: null }),
                      ...(updateFields.indexOf('emergencyContact1Name') != -1 && !!father.emergencyContact1Name
                        ? { emergencyContact1Name: father.emergencyContact1Name }
                        : { emergencyContact1Name: null }),
                      ...(updateFields.indexOf('emergencyContact1Relation') != -1 && !!father.emergencyContact1Relation
                        ? { emergencyContact1Relation: father.emergencyContact1Relation }
                        : { emergencyContact1Relation: null }),
                      ...(updateFields.indexOf('emergencyContact1Phone') != -1 && !!father.emergencyContact1Phone
                        ? { emergencyContact1Phone: father.emergencyContact1Phone }
                        : { emergencyContact1Phone: null }),
                      ...(updateFields.indexOf('emergencyContact2Name') != -1 && !!father.emergencyContact2Name
                        ? { emergencyContact2Name: father.emergencyContact2Name }
                        : { emergencyContact2Name: null }),
                      ...(updateFields.indexOf('emergencyContact2Relation') != -1 && !!father.emergencyContact2Relation
                        ? { emergencyContact2Relation: father.emergencyContact2Relation }
                        : { emergencyContact2Relation: null }),
                      ...(updateFields.indexOf('emergencyContact2Phone') != -1 && !!father.emergencyContact2Phone
                        ? { emergencyContact2Phone: father.emergencyContact2Phone }
                        : { emergencyContact2Phone: null }),
                    }}
                    onSubmit={(values) => {
                      console.log('Submit ', values);
                      this.setState({ loading: true });
                      updateFatherForm(this.state.father.personId, values).then(
                        () => {
                          this.loadPerson();
                          this.setState(this.setState({ snackMsg: i18n.t('GENERAL.EDIT_SUCCESS'), visible: true }));
                        },
                        () => {
                          this.setState(
                            this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false }),
                          );
                        },
                      );
                    }}
                    enableReinitialize
                    validationSchema={validationSchema}
                  >
                    {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
                      <Fragment>
                        <InputWithFormik
                          hasPerm={updateFields.indexOf('firstName') != -1}
                          label={i18n.t('FATHER_EDIT.FIRSTNAME')}
                          name="firstName"
                          mode="outlined"
                          selectionColor={Colors.primaryColor}
                        />
                        <InputWithFormik
                          hasPerm={updateFields.indexOf('lastName') != -1}
                          label={i18n.t('FATHER_EDIT.LASTNAME')}
                          name="lastName"
                          mode="outlined"
                          selectionColor={Colors.primaryColor}
                        />
                        <InputWithFormik
                          hasPerm={updateFields.indexOf('friendlyFirstName') != -1}
                          label={i18n.t('FATHER_EDIT.FRIENDLY_FIRSTNAME')}
                          name="friendlyFirstName"
                          mode="outlined"
                          selectionColor={Colors.primaryColor}
                        />

                        <InputWithFormik
                          hasPerm={updateFields.indexOf('friendlyLastName') != -1}
                          label={i18n.t('FATHER_EDIT.FRIENDLY_LASTNAME')}
                          name="friendlyLastName"
                          mode="outlined"
                          selectionColor={Colors.primaryColor}
                        />

                        <InputWithFormik
                          hasPerm={updateFields.indexOf('email') != -1}
                          label={i18n.t('FATHER_EDIT.EMAIL')}
                          name="email"
                          mode="outlined"
                          selectionColor={Colors.primaryColor}
                        />

                        <InputWithFormik
                          hasPerm={updateFields.indexOf('email2') != -1}
                          label={i18n.t('FATHER_EDIT.EMAIL2')}
                          name="email2"
                          mode="outlined"
                          selectionColor={Colors.primaryColor}
                        />
                        <InputWithFormik
                          hasPerm={updateFields.indexOf('cellPhone') != -1}
                          label={i18n.t('FATHER_EDIT.CELLPHONE')}
                          name="cellPhone"
                          mode="outlined"
                          keyboardType="phone-pad"
                          selectionColor={Colors.primaryColor}
                        />
                        <SwitchWithFormik
                          hasPerm={updateFields.indexOf('cellPhoneHasWhatsApp') != -1}
                          label={i18n.t('FATHER_EDIT.CELLPHONE_HAS_WA')}
                          name="cellPhoneHasWhatsApp"
                          color={Colors.primaryColor}
                        />
                        <InputWithFormik
                          hasPerm={updateFields.indexOf('phone1') != -1}
                          label={i18n.t('FATHER_EDIT.PHONE1')}
                          placeholder={'+1 262 473-4782'}
                          name="phone1"
                          mode="outlined"
                          keyboardType="phone-pad"
                          selectionColor={Colors.primaryColor}
                        />
                        <RNPickerSelect
                          style={stylePicker}
                          onValueChange={(value) => {
                            console.log('value', value);
                            setFieldValue('phone1Label', value);
                          }}
                          items={this.state.phoneLabels}
                          value={values.phone1Label}
                          Icon={() => <Ionicons name="md-arrow-dropdown" size={23} color={Colors.primaryColor} />}
                        />
                        <InputWithFormik
                          hasPerm={updateFields.indexOf('phone2') != -1}
                          label={i18n.t('FATHER_EDIT.PHONE2')}
                          placeholder={'+1 262 473-4782'}
                          name="phone2"
                          mode="outlined"
                          keyboardType="phone-pad"
                          underlineColor={Colors.primaryColor}
                        />
                        <RNPickerSelect
                          style={stylePicker}
                          onValueChange={(value) => {
                            setFieldValue('phone2Label', value);
                          }}
                          items={this.state.phoneLabels}
                          value={values.phone2Label}
                          Icon={() => <Ionicons name="md-arrow-dropdown" size={23} color={Colors.primaryColor} />}
                        />
                        <InputWithFormik
                          hasPerm={updateFields.indexOf('phone3') != -1}
                          label={i18n.t('FATHER_EDIT.PHONE3')}
                          placeholder={'+1 262 473-4782'}
                          name="phone3"
                          mode="outlined"
                          keyboardType="phone-pad"
                          underlineColor={Colors.primaryColor}
                        />
                        <RNPickerSelect
                          style={stylePicker}
                          onValueChange={(value) => {
                            setFieldValue('phone3Label', value);
                          }}
                          items={this.state.phoneLabels}
                          value={values.phone3Label}
                          Icon={() => <Ionicons name="md-arrow-dropdown" size={23} color={Colors.primaryColor} />}
                        />
                        <InputWithFormik
                          hasPerm={updateFields.indexOf('contactNotes') != -1}
                          label={i18n.t('FATHER_EDIT.CONTACT_NOTES')}
                          name={'contactNotes'}
                          numberOfLines={5}
                          mode="outlined"
                          multiline={true}
                          selectionColor={Colors.primaryColor}
                        />
                        <View style={styles.dateContainer}>
                          <Text style={styles.label}>{i18n.t('FATHER_EDIT.DEACON_DATE')}</Text>
                          <Button onPress={() => this.setState({ openDeaconDate: true })}>
                            <View style={styles.inputContainer}>
                              <Text style={styles.inputDatePicker}>{_.get(values, 'deaconDate') || ''}</Text>
                              <Ionicons name="ios-calendar" size={23} color={Colors.primaryColor} />
                            </View>
                          </Button>
                        </View>
                        <DateTimePickerModal
                          isVisible={this.state.openDeaconDate}
                          mode="date"
                          onConfirm={(date) => {
                            this.setState({
                              openDeaconDate: false,
                            });
                            const dateFormated = this.formatDate(date);
                            setFieldValue('deaconDate', dateFormated);
                          }}
                          onCancel={() =>
                            this.setState({
                              openDeaconDate: false,
                            })
                          }
                        />
                        <View style={styles.dateContainer}>
                          <Text style={styles.label}>{i18n.t('FATHER_EDIT.PRIEST_DATE')}</Text>
                          <Button onPress={() => this.setState({ openPriestDate: true })}>
                            <View style={styles.inputContainer}>
                              <Text style={styles.inputDatePicker}>{_.get(values, 'priestDate') || ''}</Text>
                              <Ionicons name="ios-calendar" size={23} color={Colors.primaryColor} />
                            </View>
                          </Button>
                        </View>
                        <DateTimePickerModal
                          isVisible={this.state.openPriestDate}
                          mode="date"
                          onConfirm={(date) => {
                            this.setState({
                              openPriestDate: false,
                            });
                            const dateFormated = this.formatDate(date);
                            setFieldValue('priestDate', dateFormated);
                          }}
                          onCancel={() =>
                            this.setState({
                              openPriestDate: false,
                            })
                          }
                        />

                        <View style={styles.dateContainer}>
                          <Text style={styles.label}>{i18n.t('FATHER_EDIT.BISHOP_DATE')}</Text>
                          <Button onPress={() => this.setState({ openBishopDate: true })}>
                            <View style={styles.inputContainer}>
                              <Text style={styles.inputDatePicker}>{_.get(values, 'bishopDate') || ''}</Text>
                              <Ionicons name="ios-calendar" size={23} color={Colors.primaryColor} />
                            </View>
                          </Button>
                        </View>
                        <DateTimePickerModal
                          isVisible={this.state.openBishopDate}
                          mode="date"
                          onConfirm={(date) => {
                            this.setState({
                              openBishopDate: false,
                            });
                            const dateFormated = this.formatDate(date);
                            setFieldValue('bishopDate', dateFormated);
                          }}
                          onCancel={() =>
                            this.setState({
                              openBishopDate: false,
                            })
                          }
                        />

                        <View style={styles.dateContainer}>
                          <Text style={styles.label}>{i18n.t('FATHER_EDIT.DEATH_DATE')}</Text>
                          <Button onPress={() => this.setState({ openDeathDate: true })}>
                            <View style={styles.inputContainer}>
                              <Text style={styles.inputDatePicker}>{_.get(values, 'deathDate') || ''}</Text>
                              <Ionicons name="ios-calendar" size={23} color={Colors.primaryColor} />
                            </View>
                          </Button>
                        </View>
                        <DateTimePickerModal
                          isVisible={this.state.openDeathDate}
                          mode="date"
                          onConfirm={(date) => {
                            this.setState({
                              openDeathDate: false,
                            });
                            const dateFormated = this.formatDate(date);
                            setFieldValue('deathDate', dateFormated);
                          }}
                          onCancel={() =>
                            this.setState({
                              openDeathDate: false,
                            })
                          }
                        />

                        <View style={styles.dateContainer}>
                          <Text style={styles.label}>{i18n.t('FATHER_EDIT.LEAVE_DATE')}</Text>
                          <Button onPress={() => this.setState({ openLeaveDate: true })}>
                            <View style={styles.inputContainer}>
                              <Text style={styles.inputDatePicker}>{_.get(values, 'leaveDate') || ''}</Text>
                              <Ionicons name="ios-calendar" size={23} color={Colors.primaryColor} />
                            </View>
                          </Button>
                        </View>
                        <DateTimePickerModal
                          isVisible={this.state.openLeaveDate}
                          mode="date"
                          onConfirm={(date) => {
                            this.setState({
                              openLeaveDate: false,
                            });
                            const dateFormated = this.formatDate(date);
                            setFieldValue('leaveDate', dateFormated);
                          }}
                          onCancel={() =>
                            this.setState({
                              openLeaveDate: false,
                            })
                          }
                        />
                        <InputWithFormik
                          hasPerm={updateFields.indexOf('instagramUser') != -1}
                          label={i18n.t('FATHER_EDIT.INSTAGRAM')}
                          name="instagramUser"
                          mode="outlined"
                          selectionColor={Colors.primaryColor}
                        />
                        <InputWithFormik
                          hasPerm={updateFields.indexOf('slackUser') != -1}
                          label={i18n.t('FATHER_EDIT.SLACK')}
                          name="slackUser"
                          mode="outlined"
                          selectionColor={Colors.primaryColor}
                        />
                        <InputWithFormik
                          hasPerm={updateFields.indexOf('twitterUser') != -1}
                          label={i18n.t('FATHER_EDIT.TWITTER')}
                          name="twitterUser"
                          mode="outlined"
                          selectionColor={Colors.primaryColor}
                        />
                        <InputWithFormik
                          hasPerm={updateFields.indexOf('facebookUrl') != -1}
                          label={i18n.t('FATHER_EDIT.FACEBOOK')}
                          placeholder={'https://www.facebook.com/my_name'}
                          name="facebookUrl"
                          mode="outlined"
                          selectionColor={Colors.primaryColor}
                        />
                        <InputWithFormik
                          hasPerm={updateFields.indexOf('skypeUser') != -1}
                          label={i18n.t('FATHER_EDIT.SKYPE')}
                          name="skypeUser"
                          mode="outlined"
                          selectionColor={Colors.primaryColor}
                          onPress
                        />
                        <InputWithFormik
                          hasPerm={updateFields.indexOf('emergencyContact1Name') != -1}
                          label={i18n.t('FATHER_EDIT.EMERGENCY_CONTACT_NAME_1')}
                          name="emergencyContact1Name"
                          mode="outlined"
                          underlineColor={Colors.primaryColor}
                        />
                        <RNPickerSelect
                          style={stylePicker}
                          onValueChange={(value) => {
                            setFieldValue('emergencyContact1Relation', value);
                          }}
                          items={this.state.personEmergencyOptions}
                          value={values.emergencyContact1Relation}
                          Icon={() => <Ionicons name="md-arrow-dropdown" size={23} color={Colors.primaryColor} />}
                        />

                        <InputWithFormik
                          hasPerm={updateFields.indexOf('emergencyContact1Phone') != -1}
                          label={i18n.t('FATHER_EDIT.EMERGENCY_CONTACT_PHONE_1')}
                          placeholder={'+1 262 473-4782'}
                          name="emergencyContact1Phone"
                          mode="outlined"
                          keyboardType="phone-pad"
                          underlineColor={Colors.primaryColor}
                        />
                        <InputWithFormik
                          hasPerm={updateFields.indexOf('emergencyContact2Name') != -1}
                          label={i18n.t('FATHER_EDIT.EMERGENCY_CONTACT_NAME_2')}
                          name="emergencyContact2Name"
                          mode="outlined"
                          underlineColor={Colors.primaryColor}
                        />
                        <RNPickerSelect
                          style={stylePicker}
                          onValueChange={(value) => {
                            setFieldValue('emergencyContact2Relation', value);
                          }}
                          items={this.state.personEmergencyOptions}
                          value={values.emergencyContact2Relation}
                          Icon={() => <Ionicons name="md-arrow-dropdown" size={23} color={Colors.primaryColor} />}
                        />

                        <InputWithFormik
                          hasPerm={updateFields.indexOf('emergencyContact2Phone') != -1}
                          label={i18n.t('FATHER_EDIT.EMERGENCY_CONTACT_PHONE_2')}
                          placeholder={'+1 262 473-4782'}
                          name="emergencyContact2Phone"
                          mode="outlined"
                          keyboardType="phone-pad"
                          underlineColor={Colors.primaryColor}
                        />

                        {/* //<InputWithFormik hasPerm={updateFields.indexOf('') != -1} label={i18n.t("FATHER_EDIT.FACEBOOK")} placeholder = {'https://www.facebook.com/'} name = "facebookUrl" /> */}
                        <View style={styles.buttonsContainer}>
                          {/*   { updateFields.indexOf('living')} */}

                          {father && father.allowUpdateLivingSituation && (
                            <Button
                              onPress={() => {
                                navigation.navigate('LivingSituationForm', {
                                  livingSituation: father.activeLivingSituation ? father.activeLivingSituation : null,
                                  personId: father ? father.personId : null,
                                });
                              }}
                              style={{ width: '45%%' }}
                            >
                              <View style={styles.btnContainer}>
                                <Text style={styles.btnText}>{i18n.t('FATHER_EDIT.EDIT_LIVING')}</Text>
                              </View>
                            </Button>
                          )}

                          <Button
                            onPress={(e) => {
                              //We make old the DateDeadline, so search scren is force to make a request
                              try {
                                let newDateDeadline = new Date();
                                AsyncStorage.setItem('DateDeadline', newDateDeadline);
                              } catch (e) {
                                console.log('Error on saving form screen ', e);
                              }
                              handleSubmit(e);
                            }}
                            style={{ width: '45%%' }}
                          >
                            <View style={styles.btnContainer}>
                              <Text style={styles.btnText}>{i18n.t('FATHER_EDIT.SAVE')}</Text>
                            </View>
                          </Button>
                        </View>
                      </Fragment>
                    )}
                  </Formik>
                  <SnackBar visible={this.state.visible} onDismiss={() => this.setState({ visible: false })}>
                    {this.state.snackMsg}
                  </SnackBar>
                </ScrollView>
              </KeyboardAvoidingView>
            </>
          ) : (
            <ActivityIndicator size="large" color={Colors.primaryColor} />
          )}
        </SafeAreaView>
      </>
    );
  }
}

FatherFormScreen.navigationOptions = (navigationData) => {
  const showMenu = navigationData.navigation.isFirstRouteInParent();
  if (showMenu) {
    return {
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
    };
  } else {
    return {
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
    };
  }
};

export default FatherFormScreen;
