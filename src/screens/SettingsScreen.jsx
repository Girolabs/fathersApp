import React from 'react';
import { View, Text, StyleSheet,Platform, SafeAreaView, AsyncStorage, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
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
  let TouchableComp = TouchableOpacity;
    if (Platform.OS == 'android' && Platform.Version >= 21) {
      TouchableComp = TouchableNativeFeedback;
    }
  return (
    
    <I18nContext.Consumer>
      {(value) => {
        moment.locale(value.lang);
        return (
          <SafeAreaView style={styles.screen}>
            <Select style={styles.select} elements={lng} value={value.lang} valueChange={value.changeLang} />
            <View style={styles.textContainer}>
              <Text style={styles.text}>{i18n.t('SETTINGS.LOGOUT')}</Text>
              <TouchableComp onPress={async () => {
                  try{
                    await AsyncStorage.removeItem('token');
                    props.navigation.navigate('Auth');
                  }catch(e) {
                    console.log(e)
                  }
               
              }}>
              <Ionicons
                name="md-close-circle"
                size={23}
                color={Colors.primaryColor}
              />
              </TouchableComp>
              
            </View>
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
    width: '100%',
    borderRadius: 5,
    paddingHorizontal:10,
  },
  textContainer : {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'space-between',
    borderRadius: 5,
    paddingHorizontal:20,
    paddingVertical:15,
    backgroundColor:Colors.surfaceColorSecondary,
    width:'100%'
  },
  text: {
    fontFamily:'work-sans-bold',
    fontSize: 18,
    lineHeight: 21,
    color: Colors.primaryColor
  }
});
