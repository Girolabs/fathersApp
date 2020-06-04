import React, { Component, createContext } from 'react';
import axios from '../../axios-instance';
import { AsyncStorage } from 'react-native';

const AuthContext = createContext();

class AuthProvider extends Component {
  state = {
    jwt: '',
    expiration: '',
  };
/* 
  handleLogin = (user, password, navigation) => {
    const data = {};
    axios.get(`users/login?identity=${user}&credential=${encodeURIComponent(password)}`, { data: null }).then((res) => {
      const data = res.result;
      console.log('data', res);
      AsyncStorage.setItem('token', data);
      navigation.navigate('Drawer');
    });
  }; */

/*   handleIdentity = ( identity ) => {
    const data = {};
    axios.get(`users/request-verification-token?identity=${encodeURIComponent(identity)}`,{ data:null })
      .then((res) => {
        const status = res.status;
        if (status == "OK") {

        }
      })
  } */


  

  render() {
    const { children } = this.props;
    return (
      <AuthContext.Provider
        value={{
          handleLogin: (user, password, navigation) => this.handleLogin(user, password, navigation),
          storeJwt: (token) => this.storeJwt(token)
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;
export { AuthContext };
