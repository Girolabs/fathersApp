import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Colors from '../constants/Colors';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
const PrayerScreen = ({ navigation }) => {
  const pray = navigation.getParam('pray');
  return (
    <View style={styles.screen}>
      <ScrollView>
        <Text style={styles.title}>{pray.title}</Text>
        <Text style={styles.body}>{pray.data}</Text>
      </ScrollView>
    </View>
  );
};

PrayerScreen.navigationOptions = (navigationData) => {
  const pray = navigationData.navigation.getParam('pray');
  return {
    headerTitle: pray.title,
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
  };
};

const styles = StyleSheet.create({
  screen: {
    padding: 15,
    backgroundColor: Colors.surfaceColorPrimary,
  },
  title: {
    fontSize: 18,
    color: Colors.primaryColor,
    fontFamily: 'work-sans-semibold',
  },
  body: {
    fontSize: 15,
    fontFamily: 'work-sans',
  },
});

export default PrayerScreen;
