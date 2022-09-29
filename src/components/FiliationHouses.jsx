import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import i18n from 'i18n-js';
import { Flag } from 'react-native-svg-flagkit';
import { Ionicons } from 'expo-vector-icons';
import { withNavigation } from 'react-navigation';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Button from './Button';

const styles = StyleSheet.create({
  item: {
    backgroundColor: Colors.surfaceColorSecondary,
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontFamily: 'work-sans-semibold',
    color: Colors.primaryColor,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    fontFamily: 'work-sans-medium',
    color: Colors.onSurfaceColorPrimary,
    fontSize: 11,
    padding: 15,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    backgroundColor: Colors.surfaceColorPrimary,
  },
  emptyMessage: {
    color: Colors.onSurfaceColorPrimary,
    fontSize: 11,
    padding: 15,
    letterSpacing: 2.5,
    backgroundColor: Colors.surfaceColorPrimary,
    paddingHorizontal: 15,
  },
});

const FiliationHouses = ({ houses, navigation }) => {
  return (
    <View>
      <Text style={styles.sectionHeader}>{i18n.t('FILIAL_DETAIL.HOUSES')}</Text>
      {houses ? (
        <View>
          {houses.map((house) => {
            return (
              <Button
                key={house.houseId}
                onPress={() => {
                  navigation.navigate('HouseDetail', { houseId: house.houseId });
                }}
              >
                <View style={styles.item}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      width: '80%',
                      alignItems: 'center',
                    }}
                  >
                    <Flag id={house.country} size={0.2} />
                    <Text style={styles.title}>{house.name}</Text>
                    {house.isMainFiliationHouse && <FontAwesome name="star-o" size={24} color={Colors.primaryColor} />}
                  </View>
                  <Ionicons name="ios-arrow-forward" size={23} color={Colors.primaryColor} />
                </View>
              </Button>
            );
          })}
        </View>
      ) : (
        <Text style={styles.emptyMessage}>{i18n.t('FILIAL_DETAIL.NO_HOUSES')}</Text>
      )}
    </View>
  );
};

export default withNavigation(FiliationHouses);
