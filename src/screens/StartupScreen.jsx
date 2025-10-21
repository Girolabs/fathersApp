import React, { Component } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../constants/Colors';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class StartupScreen extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
      replace: PropTypes.func,
    }).isRequired,
  };

  componentDidMount() {
    const tryLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        // 🔒 Si no hay token o está vacío → ir a Auth
        if (!token || token.trim() === '') {
          await AsyncStorage.removeItem('token');
          this.props.navigation.navigate('Auth');
          return;
        }

        // 🔍 Intentar parsear el token
        let transformedData;
        try {
          transformedData = JSON.parse(token);
        } catch (e) {
          console.log('Token inválido, limpiando...', e);
          await AsyncStorage.removeItem('token');
          this.props.navigation.navigate('Auth');
          return;
        }

        const { jwt, expiration } = transformedData || {};
        if (!jwt || !expiration) {
          await AsyncStorage.removeItem('token');
          this.props.navigation.navigate('Auth');
          return;
        }

        const expirationDate = new Date(expiration);
        if (isNaN(expirationDate) || expirationDate <= new Date()) {
          await AsyncStorage.removeItem('token');
          this.props.navigation.navigate('Auth');
          return;
        }

        // ✅ Token válido → ir al Drawer
        this.props.navigation.navigate('Drawer');
      } catch (err) {
        console.log('Error en tryLogin:', err);
        await AsyncStorage.removeItem('token');
        this.props.navigation.navigate('Auth');
      }
    };

    tryLogin();
  }

  render() {
    return (
      <View style={styles.screen}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    );
  }
}

export default StartupScreen;
