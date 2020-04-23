import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Image,
} from 'react-native';
import { Flag } from 'react-native-svg-flagkit';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';

const DelegationDetailScreen = () => {
  return (
    <View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Paraguay</Text>
        <Flag id="PY" size={0.2} />
      </View>
      <View>
        <Text style={styles.sectionHeader}>{i18n.t('TERRITORY_INFO')}</Text>
        <View style={styles.listItem}>
          <Text style={styles.listItemTitle}>{i18n.t('TERRITORY_CHARGE')}</Text>
          <Text style={styles.listItemBody}>Region del Padre</Text>
        </View>
        <View style={styles.listItem}>
          <Text style={styles.listItemTitle}>{i18n.t('CELEBRATION_DATE')}</Text>
          <Text style={styles.listItemBody}>20/12</Text>
        </View>
        <View style={[styles.listItem]}>
          <Text style={styles.listItemTitle}>{i18n.t('SUPERIOR')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 20 }}>
            <Image
              source={{ uri: 'https://cdn0.iconfinder.com/data/icons/professions-47/64/16-512.png' }}
              style={{ width: 60, height: 60 }}
            />
            <Text style={styles.listItemBody}>Kühlcke, Pedro (2017-2020)</Text>
          </View>

        </View>
      </View>
    </View>
  );
};

DelegationDetailScreen.navigationOptions = (navigationData) => ({
  headerTitle: 'Delegation',
});


const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.surfaceColorPrimary,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 38,

  },
  title: {
    fontFamily: 'work-sans-semibold',
    fontSize: 27,
    color: Colors.primaryColor,
  },
  sectionHeader: {
    fontFamily: 'work-sans-medium',
    color: Colors.onSurfaceColorPrimary,
    fontSize: 11,
    padding: 15,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  listItem: {
    backgroundColor: Colors.surfaceColorSecondary,
    padding: 15,
  },
  listItemTitle: {
    fontFamily: 'work-sans-semibold',
    fontSize: 18,
    color: Colors.onSurfaceColorPrimary,
  },
  listItemBody: {
    fontFamily: 'work-sans',
    fontSize: 15,
    color: Colors.onSurfaceColorPrimary,
  },
});

export default DelegationDetailScreen;
