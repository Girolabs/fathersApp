import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Image,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Flag } from 'react-native-svg-flagkit';
import i18n from 'i18n-js';
import { FlatList } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';

const DelegationDetailScreen = () => {
  return (
    <SafeAreaView>
      <ScrollView>
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
        <View styles={{ marginTop: 10, marginBottom: 5, backgroundColor: Colors.surfaceColorSecondary }}>
          <Text style={styles.sectionHeader}>{i18n.t('TERRITORY_FILIATION')}</Text>
          <View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Asunción</Text>
              <View style={styles.cardBody}>
                <Text style={styles.cardBodyText}>{i18n.t('RECTOR')}</Text>
                <Text style={styles.cardBodyTextBold}>Kühlcke, Pedro</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardBodyText}>{i18n.t('MAIN_HOUSE')}</Text>
                <Text style={styles.cardBodyTextBold}>Asunción</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardBodyText}>{i18n.t('MEMBERS')}</Text>
                <Text style={styles.cardBodyTextBold}>7</Text>
              </View>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Asunción</Text>
              <View style={styles.cardBody}>
                <Text style={styles.cardBodyText}>{i18n.t('RECTOR')}</Text>
                <Text style={styles.cardBodyTextBold}>Kühlcke, Pedro</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardBodyText}>{i18n.t('MAIN_HOUSE')}</Text>
                <Text style={styles.cardBodyTextBold}>Asunción</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardBodyText}>{i18n.t('MEMBERS')}</Text>
                <Text style={styles.cardBodyTextBold}>7</Text>
              </View>
            </View>
          </View>
        </View>
        <Text style={styles.sectionHeader}>{i18n.t('MEMBERS_OF_TERRITORY')}</Text>
        <FlatList
          data={
            [
              {
                name: 'Kühlcke, Pedro (2017-2020)',
              }, {
                name: 'Miranda, Jose (2017-2020)',
              },
              {
                name: 'Ferrero Arinci, Santiago Nicolás',
              },
            ]
          }
          renderItem={({ item }) => {
            return (
              <View style={{
                flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surfaceColorSecondary, padding: 15,
              }}
              >
                <Image
                  source={{ uri: 'https://cdn0.iconfinder.com/data/icons/professions-47/64/16-512.png' }}
                  style={{ width: 20, height: 20 }}
                />
                <Text style={{ fontSize: 12, color: Colors.primaryColor, fontFamily: 'work-sans-semibold' }}>{item.name}</Text>
              </View>
            );
          }}
        />
        <Text style={{ marginLeft: 16, color: Colors.onSurfaceColorPrimary, paddingVertical: 10 }}>Total: </Text>

      </ScrollView>
    </SafeAreaView>
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
    backgroundColor: Colors.surfaceColorPrimary,
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
  card: {
    width: '80%',
    marginLeft: 15,
    marginVertical: 15,
    padding: 15,
    backgroundColor: Colors.primaryColor,
    borderRadius: 5,
  },
  cardTitle: {
    color: Colors.surfaceColorSecondary,
    fontSize: 18,
    fontFamily: 'work-sans-semibold',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Colors.onSurfaceColorSecondary,
    borderBottomWidth: 0.5,
    paddingVertical: 10,
  },
  cardBodyText: {
    color: Colors.surfaceColorSecondary,
    fontSize: 15,
    fontFamily: 'work-sans',
    width: '50%',

  },
  cardBodyTextBold: {
    color: Colors.surfaceColorSecondary,
    fontSize: 15,
    fontFamily: 'work-sans-semibold',
    textAlign: 'left',
    width: '50%',
  },
});

export default DelegationDetailScreen;
