import React from 'react';
import { View, Text, StyleSheet, Platform, SafeAreaView, AsyncStorage } from 'react-native';
import moment from 'moment';
import 'moment/min/locales';
import i18n from 'i18n-js';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Ionicons } from 'expo-vector-icons';
import Constants from 'expo-constants';
import Colors from '../constants/Colors';
import HeaderButton from '../components/HeaderButton';
import { I18nContext } from '../context/I18nProvider';
import Select from '../components/Select';
import Button from '../components/Button';
import { lng } from '../constants/Fields';
const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    backgroundColor: Colors.surfaceColorPrimary,
    flex: 1,
  },
  select: {
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  selectAndroid: {
    width: '100%',
    borderRadius: 5,
    paddingHorizontal: 10,
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

              <Text style={styles.text}>{Constants.manifest.version}</Text>
            </View>
            {Platform.OS === 'android' ? (
              <Select style={styles.selectAndroid} elements={lng} value={value.lang} valueChange={value.changeLang} />
            ) : (
              <View style={styles.pickerContainer}>
                <Text style={styles.text}>{i18n.t('SETTINGS.LANGUAGE')}</Text>
                <Select style={styles.select} elements={lng} value={value.lang} valueChange={value.changeLang} />
              </View>
            )}
            {Platform.OS === 'android' ? (
              <Button onPress={onPress}>
                <View style={styles.textContainer}>
                  <Text style={styles.text}>{i18n.t('SETTINGS.LOGOUT')}</Text>
                  <Ionicons name="md-close-circle" size={23} color={Colors.primaryColor} />
                </View>
              </Button>
            ) : (
              <Button onPress={onPress} style={styles.logoutContainer}>
                <View style={styles.textContainer}>
                  <Text style={styles.text}>{i18n.t('SETTINGS.LOGOUT')}</Text>
                  <Ionicons name="md-close-circle" size={23} color={Colors.primaryColor} />
                </View>
              </Button>
            )}
          </SafeAreaView>
        );
      }}
    </I18nContext.Consumer>
  );
};

SettingsScreen.navigationOptions = (navigationData) => ({
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
});

export default SettingsScreen;
