import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import i18n from 'i18n-js';
import { Ionicons } from 'expo-vector-icons';
import Select from './Select';
import Colors from '../constants/Colors';
import Button from './Button';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    backgroundColor: Colors.surfaceColorSecondary,
  },
  title: {
    fontFamily: 'work-sans-semibold',
    fontSize: 18,
    color: Colors.onSurfaceColorPrimary,
  },
});

const IdealStatement = ({ languages, recommendedLang, entity, navigation }) => {
  const [selectedlang, setSelectedLang] = useState(recommendedLang);

  Object.keys(languages);

  const langs = Object.keys(languages).map((el) => {
    return {
      name: el,
      value: languages[el],
    };
  });

  useEffect(() => {
    console.log('props ', recommendedLang);
    setSelectedLang(recommendedLang);
    console.log('useEffect Ideal');
  }, [recommendedLang]);

  return (
    <>
      {recommendedLang ? (
        <View style={styles.container}>
          <View>
            <View>
              <Text style={styles.title}>{i18n.t('GENERAL.IDEAL')}</Text>
              <Select elements={langs} value={selectedlang} valueChange={(value) => setSelectedLang(value)} />
            </View>
          </View>
          <View style={{ width: '18%' }}>
            <Button
              onPress={() => {
                navigation.navigate('IdealStatementDetail', { content: entity[selectedlang] });
                console.log(entity[selectedlang]);
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  width: '100%',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="ios-arrow-forward" size={28} color={Colors.primaryColor} />
              </View>
            </Button>
          </View>
        </View>
      ) : null}
    </>
  );
};

export default IdealStatement;
