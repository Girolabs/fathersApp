import React, { Component } from 'react';
import { AsyncStorage, ActivityIndicator, View, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

class StartupScreen extends Component {
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StartupScreen;
