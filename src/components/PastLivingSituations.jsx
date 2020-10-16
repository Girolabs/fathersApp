import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import i18n from 'i18n-js';
import { withNavigation } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import DefaultItem from './FatherDetailItem';
import Colors from '../constants/Colors';
import Button from './Button';

const PastLivingSituations = ({
  livingSituations,
  statusLabels,
  viewFields,
  navigation,
  lang,
  allowUpdate,
  father,
}) => {
  return (
    <>
      {livingSituations && (
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.sectionHeader}>{i18n.t('FATHER_DETAIL.PAST_HOMES')}</Text>
            <Button
              onPress={() => {
                navigation.navigate('LivingSituationForm', {
                  personId: father.personId,
                });
              }}
            >
              <Ionicons name="md-add" size={24} color={Colors.primaryColor} />
            </Button>
          </View>

          {livingSituations.map((pastHome) => (
            <View>
              <View style={styles.headerContainer}>
                <Text style={styles.sectionHeader}>
                  {`${pastHome.filiationName}-${
                    pastHome.startDate && pastHome.startDate.split('-')[0]
                  }`}

                </Text>
                <Button
                  onPress={() => {
                    navigation.navigate('LivingSituationForm', {
                      personId: father.personId,
                      livingSituation: pastHome,
                    });
                  }}
                >
                  <Ionicons name="md-create" size={23} color={Colors.primaryColor} />
                </Button>
              </View>
              <DefaultItem
                show={viewFields.indexOf('livingSituations') !== -1}
                title="FATHER_DETAIL.FILIATION"
                body={pastHome.filiationName}
                img={pastHome.filiationCountry}
                badge={pastHome.status !== 'intern' && statusLabels ? statusLabels[pastHome.status] : null}
                selected={() => {
                  navigation.navigate('FiliationDetail', { filiationId: pastHome.filiationId });
                }}
              />
              <DefaultItem
                show={viewFields.indexOf('livingSituations') !== -1}
                title="FATHER_DETAIL.HOME"
                body={pastHome.houseName}
                img={pastHome.houseCountry}
                selected={() => {
                  navigation.navigate('HouseDetail', { houseId: pastHome.houseId });
                }}
              />
              <DefaultItem
                show={viewFields.indexOf('livingSituations') !== -1}
                title="FATHER_DETAIL.RESPONSIBLE_TERRITORY"
                body={pastHome.responsibleTerritoryName}
                selected={() => {
                  navigation.push('DelegationDetail', {
                    delegationId: pastHome.responsibleTerritoryId,
                  });
                }}
              />
              <DefaultItem
                show={viewFields.indexOf('livingSituations') !== -1}
                title="FATHER_DETAIL.START_DATE"
                date={pastHome.startDate}
                lang={lang}
              />
              <DefaultItem
                title="FATHER_DETAIL.END_DATE"
                show={viewFields.indexOf('livingSituations') !== -1}
                date={pastHome.endDate}
                lang={lang}
              />
            </View>
          ))}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    fontFamily: 'work-sans-medium',
    color: Colors.onSurfaceColorPrimary,
    fontSize: 11,
    padding: 15,
    textAlign: 'left',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
  },
});

export default withNavigation(PastLivingSituations);
