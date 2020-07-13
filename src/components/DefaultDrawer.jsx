import React from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  Image,
  Text,
  ScrollView,
  View,
  Platform,
  TouchableNativeFeedback,
  StyleSheet,
} from 'react-native';
import i18n from 'i18n-js';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const DefaultDrawer = (props) => {
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }
  const routes = [
    {
      path: 'HomeSearch',
      label: i18n.t('GENERAL.HOME'),
    },
    {
      path: 'Profile',
      label: i18n.t('GENERAL.PROFILE'),
    },
    {
      path: 'Community',
      label: i18n.t('GENERAL.GENERAL_COMMUNITY'),
    },
    {
      path: 'FreeCommunity',
      label: i18n.t('GENERAL.FREE_COMMUNITY'),
    },
    {
      path: 'Assignments',
      label: i18n.t('GENERAL.ASSIGNMENTS'),
    },
    {
      path: 'Settings',
      label: i18n.t('GENERAL.SETTINGS'),
    },
  ];
  const { navigation } = props;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <TouchableOpacity
          style={{ margin: 15, padding: 15 }}
          onPress={() => {
            props.navigation.toggleDrawer();
          }}
        >
          <Ionicons name="md-close" size={36} color={Colors.surfaceColorPrimary} />
        </TouchableOpacity>
        <ScrollView
          contentContainerStyle={{
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            height: '100%',
            padding: 15,
          }}
        >
          <View style={styles(props).banner}>
            <Image source={require('../../assets/img/icon.png')} style={styles(props).image} />
            <Text
              numberOfLines={2}
              style={styles(props).title}
            >
              {i18n.t('GENERAL.FATHERS')}
            </Text>
          </View>
          {routes.map((route) => {
            return (
              <TouchableComp key={route.path} onPress={() => navigation.navigate(route.path)}>
                <View style={styles(props).listItemContainer}>
                  <Text
                    style={[
                      styles(props).listItem,
                      props.activeItemKey == route.path
                        ? { color: props.activeTintColor }
                        : { color: props.inactiveTintColor },
                    ]}
                  >
                    {route.label}
                  </Text>
                </View>
              </TouchableComp>
            );
          })}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = (props) =>
  StyleSheet.create({
    banner:{
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 15
    },
    title:{
      width: '70%',
      fontSize: 18,
      fontFamily: 'work-sans-semibold',
      color: 'white',
      paddingHorizontal: 15,
    },
    image:{
      marginLeft: 10,
      width: 88, 
      height: 88
    },
    listItemContainer: {
      marginLeft: 15,
      marginVertical: 10,
    },
    listItem: {
      ...props.labelStyle,
    },
  });

export default DefaultDrawer;
