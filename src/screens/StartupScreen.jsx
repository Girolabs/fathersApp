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
    this.tryLogin();
  }

  tryLogin = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      // 🔒 Si no hay token o no es string
      if (typeof token !== 'string' || token.trim() === '') {
        await AsyncStorage.removeItem('token');
        this.safeNavigate('Auth');
        return;
      }

      // 🔍 Intentar parsear
      let transformedData = null;
      try {
        transformedData = JSON.parse(token);
      } catch (e) {
        console.log('Token inválido, limpiando...', e);
        await AsyncStorage.removeItem('token');
        this.safeNavigate('Auth');
        return;
      }

      const { jwt, expiration } = transformedData || {};
      if (!jwt || !expiration) {
        await AsyncStorage.removeItem('token');
        this.safeNavigate('Auth');
        return;
      }

      const expirationDate = new Date(expiration);
      if (isNaN(expirationDate.getTime()) || expirationDate <= new Date()) {
        await AsyncStorage.removeItem('token');
        this.safeNavigate('Auth');
        return;
      }

      // ✅ Token válido → ir al Drawer
      this.safeNavigate('Drawer');
    } catch (err) {
      console.log('Error en tryLogin:', err);
      await AsyncStorage.removeItem('token');
      this.safeNavigate('Auth');
    }
  };

  /**
   * 🚧 Navegación segura que evita crash si el componente fue desmontado
   */
  safeNavigate = (route) => {
    if (!this.props?.navigation?.navigate) return;
    try {
      requestAnimationFrame(() => {
        this.props.navigation.navigate(route);
      });
    } catch (e) {
      console.log('Navigation error:', e);
    }
  };

  render() {
    return (
      <View style={styles.screen}>
        <ActivityIndicator size="large" color={Colors.primaryColor} />
      </View>
    );
  }
}

export default StartupScreen;
