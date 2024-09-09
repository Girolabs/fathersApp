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
    }).isRequired,
  };
  componentDidMount() {
    const tryLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        this.props.navigation.navigate('Auth');
        return;
      }
      const transformedData = JSON.parse(token);
      const { jwt, expiration } = transformedData;

      const expirationDate = new Date(expiration);

      if (expirationDate <= new Date() || !jwt) {
        this.props.navigation.navigate('Auth');
        return;
      }

      this.props.navigation.navigate('Drawer');
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
