import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  AsyncStorage,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import InputWithFormik from '../components/InputWithFormik';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { pathHasError } from '../utils/form-utils';
import * as Network from 'expo-network';
import axios from '../../axios-instance';
import i18n from 'i18n-js';
import { jwtDecode } from '../utils/jwt-utils';
import jwt from 'jwt-decode'; // import dependency
import Constants from 'expo-constants';
import { Snackbar } from 'react-native-paper';
import Colors from '../constants/Colors';
import { NavigationEvents } from 'react-navigation';

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
    width: '45%',
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
  },
});

class FatherFormScreen extends Component {
  state = {
    father: {},
    loading: true,
    updateFields: [],
  };
  async componentDidMount() {
    this.setState({ loading: true });
    await this.loadPerson();
  }

  loadInterfaceData = async (father) => {
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected == true) {
      axios.get(`${i18n.locale}/api/v1/interface-data`).then((response) => {
        console.log('father', father);
        const viewPermRole = father.viewPermissionForCurrentUser;
        const updatePermRole = father.updatePermissionForCurrentUser;

        const personFieldsByViewPermission = response.data.result.personFieldsByViewPermission;
        const personFieldsByUpdatePermission = response.data.result.personFieldsByUpdatePermission;

        let updateRoles = Object.keys(personFieldsByUpdatePermission);

        const arrayOfRoles = updateRoles.map((rol) => {
          return personFieldsByUpdatePermission[rol];
        });
        console.log(arrayOfRoles);

        const accumulatedFieldsPerRol = arrayOfRoles.map((rol, index) => {
          /* let accu = [];
          arrayOfRoles.forEach((el,i) => {
            if (i<=index) {
              accu = accu.concat(el);
            }
          }) */
          return rol;
        });

        let index = updateRoles.indexOf(updatePermRole);
        const updateFields = accumulatedFieldsPerRol[index];

        this.setState({ updateFields });

        console.log('final', accumulatedFieldsPerRol);
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
          //twitterUserRegex:response.data.result.twitterUserRegex && response.data.result.twitterUserRegex.substring(1,response.data.result.twitterUserRegex.length -1),
        };
        this.setState({ fieldsPerm: accumulatedFieldsPerRol, regex: regex, loading: false });
      });
    }
  };

  loadPerson = async () => {
    this.setState({ loading: true });
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected === true) {
      const fatherId = this.props.navigation.getParam('fatherId');
      if (fatherId) {
        axios
          .get(
            `${i18n.locale}/api/v1/persons/${fatherId}?fields=all&authorized=true&$key=${Constants.manifest.extra.secretkey}`,
          )
          .then((response) => {
            const father = response.data.result;
            this.setState({ father });

            this.loadInterfaceData(response.data.result);
          });
      } else {
        let decode = await AsyncStorage.getItem('token');
        decode = JSON.parse(decode);
        decode = jwt(decode.jwt).sub;
        axios.get(`${i18n.locale}/api/v1/persons?userId=${decode}`).then(
          (response) => {
            const fatherId = !!response.data.result && response.data.result[0].personId;
            axios
              .get(
                `${i18n.locale}/api/v1/persons/${fatherId}?fields=all&authorized=true&key=${Constants.manifest.extra.secretkey}`,
              )
              .then(
                (response) => {
                  const father = response.data.result;
                  this.setState({ father });
                  this.loadInterfaceData(father);
                },
                (error) => {
                  this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false });
                },
              );
          },
          (error) => {
            this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false });
          },
        );
      }
    } else {
      this.setState({ loading: false, visible: true, snackMsg: i18n.t('GENERAL.NO_INTERNET') });
    }
  };

  render() {
    let TouchableComp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
      TouchableComp = TouchableNativeFeedback;
    }

    const { father, updateFields, regex, loading } = this.state;
    let { navigation } = this.props;
    let validationSchema;
    if (regex) {
      validationSchema = Yup.object().shape({
        ...(updateFields.indexOf('slackUser') != -1 ? { slackUser: Yup.string().matches(regex.slackUserRegex) } : null),
        ...(updateFields.indexOf('instagramUser') != -1
          ? { instagramUser: Yup.string().matches(regex.instagramUserRegex) }
          : null),
        ...(updateFields.indexOf('twitterUser') != -1
          ? { twitterUser: Yup.string().matches(regex.twitterUserRegex) }
          : null),
        ...(updateFields.indexOf('skypeUser') != -1 ? { skypeUser: Yup.string().matches(regex.skypeUserRegex) } : null),
        ...(updateFields.indexOf('phone1') != -1 ? { phone1: Yup.string().matches(regex.phoneNumberRegex) } : null),
        ...(updateFields.indexOf('phone2') != -1 ? { phone2: Yup.string().matches(regex.phoneNumberRegex) } : null),
        ...(updateFields.indexOf('facebookUrl') != -1
          ? { facebookUrl: Yup.string().matches(regex.facebookUrlRegex) }
          : null),
      });
    }

    return (
      <>
        <NavigationEvents
          onDidFocus={async () => {
            console.log('DidFocus');
            await this.loadPerson();
          }}
        />
        {!loading ? (
          <>
            <SafeAreaView style={styles.screen}>
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
                    // email: (!!father.email && father.email) || null,
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
                    ...(updateFields.indexOf('phone1') != -1 && !!father.phones.length > 0
                      ? { phone1: father.phones[0].number }
                      : { phone1: null }),
                    ...(updateFields.indexOf('phone2') != -1 && !!father.phones.length & !!father.phones[1]
                      ? { phone2: father.phones[1].number }
                      : { phone2: null }),
                  }}
                  onSubmit={(values) => {
                    this.setState({ loading: true });
                    console.log(values);
                    //this.setState({loading:true})
                    axios.put(`${i18n.locale}/api/v1/persons/${this.state.father.personId}`, values).then(
                      (response) => {
                        this.loadPerson();
                        this.setState(this.setState({ snackMsg: i18n.t('GENERAL.EDIT_SUCCESS'), visible: true }));
                      },
                      (err) => {
                        this.setState(
                          this.setState({ snackMsg: i18n.t('GENERAL.ERROR'), visible: true, loading: false }),
                        );
                      },
                    );
                  }}
                  enableReinitialize
                  validationSchema={validationSchema}
                >
                  {({ handleChange, handleBlur, handleSubmit, values }) => (
                    <Fragment>
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
                        hasPerm={updateFields.indexOf('twitterUSer') != -1}
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
                      />
                      <InputWithFormik
                        hasPerm={updateFields.indexOf('phone1') != -1}
                        label={i18n.t('FATHER_EDIT.PHONE1')}
                        placeholder={'+1 262 473-4782'}
                        name="phone1"
                        mode="outlined"
                        selectionColor={Colors.primaryColor}
                      />
                      <InputWithFormik
                        hasPerm={updateFields.indexOf('phone2') != -1}
                        label={i18n.t('FATHER_EDIT.PHONE2')}
                        placeholder={'+1 262 473-4782'}
                        name="phone2"
                        mode="outlined"
                        underlineColor={Colors.primaryColor}
                      />
                      {/* //<InputWithFormik hasPerm={updateFields.indexOf('') != -1} label={i18n.t("FATHER_EDIT.FACEBOOK")} placeholder = {'https://www.facebook.com/'} name = "facebookUrl" /> */}
                      <View style={styles.buttonsContainer}>
                        {/*   { updateFields.indexOf('living')} */}

                        {father && father.allowUpdateLivingSituation && (
                          <TouchableComp
                            onPress={() => {
                              navigation.navigate('LivingSituationForm', {
                                livingSituation: father.activeLivingSituation ? father.activeLivingSituation : null,
                                personId: father ? father.personId : null,
                              });
                            }}
                          >
                            <View style={styles.btnContainer}>
                              <Text style={styles.btnText}>{i18n.t('FATHER_EDIT.EDIT_LIVING')}</Text>
                            </View>
                          </TouchableComp>
                        )}

                        <TouchableComp onPress={handleSubmit}>
                          <View style={styles.btnContainer}>
                            <Text style={styles.btnText}>{i18n.t('FATHER_EDIT.SAVE')}</Text>
                          </View>
                        </TouchableComp>
                      </View>
                    </Fragment>
                  )}
                </Formik>
                <Snackbar
                  visible={this.state.visible}
                  onDismiss={() => this.setState({ visible: false })}
                  style={styles.snackError}
                >
                  {this.state.snackMsg}
                </Snackbar>
              </ScrollView>
            </SafeAreaView>
          </>
        ) : (
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        )}
      </>
    );
  }
}

FatherFormScreen.navigationOptions = (navigationData) => {
  console.log('navigationData', navigationData);
  const showMenu = navigationData.navigation.isFirstRouteInParent();

  if (showMenu) {
    return {
      headerTitle: '',
      headerLeft: (
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
    };
  }
};

export default FatherFormScreen;
