import React, { Component, Fragment } from 'react';
import { ScrollView, StyleSheet, KeyboardAvoidingView, View, Text, Image, ActivityIndicator } from 'react-native';
import { I18nContext } from '../context/I18nProvider';
import { AuthContext } from '../context/AuthProvider';
import Colors from '../constants/Colors';
import logo from '../../assets/img/fatherIcon.png';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Select from '../components/Select';
import axios from '../../axios-instance';
import SnackBar from '../components/SnackBar';
import 'moment/min/locales';
import i18n from 'i18n-js';
import { AsyncStorage } from 'react-native';
import * as Network from 'expo-network';
import { lng } from '../constants/Fields';
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    padding: 40,
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontFamily: 'work-sans-bold',
    fontSize: 27,
    marginLeft: 10,
  },
  authContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: Colors.surfaceColorPrimary,
    marginVertical: 16,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  btnPrimary: {
    backgroundColor: Colors.primaryColor,
    width: '100%',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  btnSecondary: {
    backgroundColor: Colors.secondaryColor,
    width: '100%',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  btnText: {
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'work-sans-bold',
  },
  snackSuccess: {
    backgroundColor: Colors.secondaryColor,
  },
  snackError: {
    backgroundColor: Colors.secondaryColor,
  },
});

class AuthScreen extends Component {
  state = {
    hasToken: false,
    identity: '',
    token: '',
    visible: false,
    snackMsg: '',
    loading: false,
  };

  static contextType = AuthContext;

  _onToggleSnackBar = () => this.setState({ visible: !this.state.visible });
  _onDismissSnackBar = () => this.setState({ visible: false });

  handleIdentity = (text) => {
    this.setState({ identity: text });
  };
  handleToken = (text) => {
    this.setState({ token: text });
  };

  handleSendIdentity = async () => {
    const data = {};
    const { identity } = this.state;
    this.setState({ loading: true });
    const status = await Network.getNetworkStateAsync();
    if (status.isConnected == true) {
      axios
        .get(`/api/v1/users/request-verification-token?identity=${encodeURIComponent(identity)}`, {
          data: null,
        })
        .then((res) => {
          const status = res.data.status;
          if (status == 'OK') {
            this.setState({
              hasToken: true,
              snackMsg: i18n.t('AUTH_SCREEN.SEND_EMAIL'),
              visible: true,
              loading: false,
            });
          }
        })
        .catch((e) => {
          const error = e.response.data.result.message && e.response.data.result.message;
          this.setState({ snackMsg: error, visible: true, loading: false });
        });
    } else {
      this.setState({ snackMsg: i18n.t('GENERAL.NO_INTERNET'), visible: true, loading: false });
    }
  };
  handleSendToken = async () => {
    const data = {};
    const { identity, token } = this.state;
    this.setState({ loading: true });
    const status = await Network.getNetworkStateAsync();
    console.log(status);
    if (status.isConnected == true) {
      axios
        .get(`/api/v1/users/login-with-verification-token?identity=${encodeURIComponent(identity)}&token=${token}`, {
          data: null,
        })
        .then(async (res) => {
          console.log(res);
          const data = JSON.stringify(res.data.result);

          //await AsyncStorage.setItem('token',res.data.result)
          try {
            await AsyncStorage.setItem('token', data);
          } catch (error) {
            // Error saving data
            console.log('try', error);
          }
          /* this.context.storeJwt(res.data.result); */
          this.setState({ loading: false });
          this.props.navigation.navigate('Drawer');
        })
        .catch((e) => {
          const error = e.response.data.result.message && e.response.data.result.message;
          this.setState({ snackMsg: error, visible: true, loading: false });
        });
    } else {
      this.setState({ snackMsg: i18n.t('GENERAL.NO_INTERNET'), visible: true, loading: false });
    }
  };

  render() {
    const { visible, snackMsg } = this.state;

    return (
      <I18nContext.Consumer>
        {(value) => {
          return (
            <AuthContext.Consumer>
              {(authValue) => {
                /* 	moment.locale(value.lang); */
                return (
                  <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : ''} style={styles.screen}>
                    <View style={styles.container}>
                      <View style={styles.titleContainer}>
                        <Image source={logo} style={{ width: 80, height: 80 }} />
                        <Text style={styles.title}>{i18n.t('GENERAL.FATHERS')}</Text>
                      </View>
                      {this.state.hasToken ? (
                        <Card style={styles.authContainer}>
                          {!this.state.loading ? (
                            <Fragment>
                              <Input
                                id="identity"
                                label="Identity"
                                required
                                autoCapitalize="none"
                                placeholder={i18n.t('AUTH_SCREEN.IDENTITY_PLACEHOLDER')}
                                value={this.state.identity}
                                onChange={this.handleIdentity}
                              />

                              <Input
                                id="token"
                                label="Token"
                                required
                                autoCapitalize="none"
                                keyboardType="email-address"
                                placeholder={i18n.t('AUTH_SCREEN.TOKEN_PLACEHOLDER')}
                                value={this.state.token}
                                onChange={this.handleToken}
                              />
                              <Button
                                onPress={() => {
                                  if ((this.state.token != '') & (this.state.identity != '')) {
                                    this.handleSendToken();
                                  } else {
                                    this.setState({ snackMsg: i18n.t('AUTH_SCREEN.EMPTY_FIELDS'), visible: true });
                                  }

                                  //this.props.navigation.navigate('Drawer')
                                }}
                              >
                                <View style={styles.btnPrimary}>
                                  <Text style={styles.btnText}>{i18n.t('AUTH_SCREEN.SEND')}</Text>
                                </View>
                              </Button>
                              <Button
                                onPress={() => {
                                  this.setState({ hasToken: false });
                                }}
                              >
                                <View style={styles.btnSecondary}>
                                  <Text style={styles.btnText}>{i18n.t('AUTH_SCREEN.GO_BACK')}</Text>
                                </View>
                              </Button>
                            </Fragment>
                          ) : (
                            <ActivityIndicator size="large" color={Colors.primaryColor} />
                          )}
                        </Card>
                      ) : (
                        <Card style={styles.authContainer}>
                          {!this.state.loading ? (
                            <Fragment>
                              <Input
                                id="email"
                                label="Email"
                                required
                                email
                                autoCapitalize="none"
                                keyboardType="email-addres"
                                placeholder={i18n.t('AUTH_SCREEN.IDENTITY_PLACEHOLDER')}
                                value={this.state.identity}
                                onChange={this.handleIdentity}
                              />
                              <Select elements={lng} value={value.lang} valueChange={value.changeLang} />
                              <Button
                                onPress={() => {
                                  if (this.state.identity != '') {
                                    this.handleSendIdentity();
                                  } else {
                                    this.setState({ snackMsg: i18n.t('AUTH_SCREEN.EMPTY_IDENTITY'), visible: true });
                                  }

                                  //this.props.navigation.navigate('Drawer')
                                }}
                              >
                                <View style={styles.btnPrimary}>
                                  <Text style={styles.btnText}>{i18n.t('AUTH_SCREEN.NEXT')}</Text>
                                </View>
                              </Button>
                              <Button
                                onPress={() => {
                                  this.setState({ hasToken: true });
                                }}
                              >
                                <View style={styles.btnSecondary}>
                                  <Text style={styles.btnText}>{i18n.t('AUTH_SCREEN.CODE')}</Text>
                                </View>
                              </Button>
                            </Fragment>
                          ) : (
                            <ActivityIndicator size="large" color={Colors.primaryColor} />
                          )}
                        </Card>
                      )}

                      <SnackBar visible={visible} onDismiss={this._onDismissSnackBar}>
                        {snackMsg}
                      </SnackBar>
                    </View>
                  </KeyboardAvoidingView>
                );
              }}
            </AuthContext.Consumer>
          );
        }}
      </I18nContext.Consumer>
    );
  }
}

AuthScreen.navigationOptions = {
  headerShown: false,
};

export default AuthScreen;
