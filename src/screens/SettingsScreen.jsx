import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { I18nContext } from '../context/I18nProvider';
import moment from 'moment';
import 'moment/min/locales';
import i18n from 'i18n-js';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Ionicons } from 'expo-vector-icons';
import Colors from '../constants/Colors';
import HeaderButton from '../components/HeaderButton';

import Select from '../components/Select';

const SettingsScreen = (props) => {
  const lng = [
    { name: 'ES', value: 'es' },
    { name: 'EN', value: 'en' },
  ];
  return (
    <I18nContext.Consumer>
      {(value) => {
        moment.locale(value.lang);
        return (
          <SafeAreaView style={styles.screen}>
            <Select style={styles.select} elements={lng} value={value.lang} valueChange={value.changeLang} />
          </SafeAreaView>
        );
      }}
    </I18nContext.Consumer>
  );
};

SettingsScreen.navigationOptions = (navigationData) => ({
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
});

export default SettingsScreen;

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
  },
  select: {
    width: '90%',
    borderRadius: 5,
    marginVertical: 10,
  },
});
