import React from 'react';
import { View, Text, StyleSheet, Platform, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import 'moment/min/locales';
import i18n from 'i18n-js';

import { Ionicons } from 'expo-vector-icons';
import Constants from 'expo-constants';
import Colors from '../constants/Colors';

import { I18nContext } from '../context/I18nProvider';
import Select from '../components/Select';
import Button from '../components/Button';
import { lng } from '../constants/Langs';

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    backgroundColor: Colors.surfaceColorPrimary,
    flex: 1,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.surfaceColorSecondary,
    width: '100%',
  },
  text: {
    fontFamily: 'work-sans-medium',
    fontSize: 18,
    lineHeight: 21,
    color: Colors.primaryColor,
  },
  logoutContainer: {
    backgroundColor: Colors.surfaceColorSecondary,
    width: '100%',
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: Colors.surfaceColorSecondary,
    marginVertical: 5,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 5,
    fontFamily: 'work-sans-medium',
    fontSize: 18,
    lineHeight: 21,
    color: Colors.primaryColor,
  },
  pickerContainerAndroid: {
    width: '100%',
    backgroundColor: Colors.surfaceColorSecondary,
    marginVertical: 5,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    paddingLeft: 20,
    paddingVertical: 5,
    fontFamily: 'work-sans-medium',
    fontSize: 18,
    lineHeight: 21,
    color: Colors.primaryColor,
  },
  selectContainer: {
    backgroundColor: Colors.surfaceColorSecondary,
    borderRadius: 5,
    marginVertical: 5,
  },
  selectAndroid: {
    width: '50%',
    // justifyContent:'flex-end'
  },
  text2: {
    fontFamily: 'work-sans',
    fontSize: 18,
    lineHeight: 21,
    // color: Colors.primaryColor,
  },
});

const SettingsScreen = (props) => {
  const onPress = async () => {
    try {
      await AsyncStorage.removeItem('token');
      props.navigation.navigate('Auth');
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <I18nContext.Consumer>
      {(value) => {
        moment.locale(value.lang);
        return (
          <SafeAreaView style={styles.screen}>
            <View style={styles.textContainer}>
              <Text style={styles.text}>{i18n.t('SETTINGS.VERSION')}</Text>

              <Text style={styles.text2}>{Constants.expoConfig.version}</Text>
            </View>
            {Platform.OS === 'android' ? (
              <View style={styles.pickerContainerAndroid}>
                <Text style={styles.text}>{i18n.t('SETTINGS.LANGUAGE')}</Text>
                <Select
                  // containerStyle={styles.selectContainer}
                  style={styles.selectAndroid}
                  elements={lng}
                  value={lng.some((l) => l.value === value.lang) ? value.lang : 'en'}
                  valueChange={value.changeLang}
                />
              </View>
            ) : (
              <View style={styles.pickerContainer}>
                <Text style={styles.text}>{i18n.t('SETTINGS.LANGUAGE')}</Text>
                <Select
                  style={styles.select}
                  elements={lng}
                  value={lng.some((l) => l.value === value.lang) ? value.lang : 'en'}
                  valueChange={value.changeLang}
                />
              </View>
            )}
            {Platform.OS === 'android' ? (
              <Button onPress={onPress}>
                <View style={styles.textContainer}>
                  <Text style={styles.text}>{i18n.t('SETTINGS.LOGOUT')}</Text>
                  <Ionicons name="md-close-circle" size={23} />
                </View>
              </Button>
            ) : (
              <Button onPress={onPress} style={styles.logoutContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.text}>{i18n.t('SETTINGS.LOGOUT')}</Text>
                  <Ionicons name="md-close-circle" size={23} />
                </View>
              </Button>
            )}
          </SafeAreaView>
        );
      }}
    </I18nContext.Consumer>
  );
};

export default SettingsScreen;
