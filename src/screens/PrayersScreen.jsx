import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TouchableNativeFeedback, Platform,
} from 'react-native';
import { Ionicons } from 'expo-vector-icons';
import { PRAYERS } from '../data/prayers';
import Colors from '../constants/Colors';

const PrayersScreen = ({ navigation }) => {
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  return (

    <View style={styles.screen}>
      <FlatList
        data={PRAYERS}
        renderItem={({ item, index }) => (
          <TouchableComp
            onPress={() => {
              navigation.navigate('Prayer', { pray: item });
            }}
          >
            <View style={styles.listItem}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="md-book" size={25} color={Colors.primaryColor} />
                <Text numberOfLines={2} style={styles.listItemTitle}>{item.title}</Text>
              </View>
              <Ionicons name="ios-arrow-forward" size={25} color={Colors.primaryColor} />
            </View>
          </TouchableComp>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    padding: 15,
    backgroundColor: Colors.surfaceColorPrimary,
  },
  listItem: {
    backgroundColor: Colors.surfaceColorSecondary,
    borderBottomColor: Colors.surfaceColorPrimary,
    borderBottomWidth: 2,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemTitle: {
    fontSize: 18,
    fontFamily: 'work-sans-semibold',
    color: Colors.primaryColor,
    paddingHorizontal: 15,
    width: '80%',
  },
});

export default PrayersScreen;
