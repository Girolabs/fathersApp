import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Flag } from 'react-native-svg-flagkit';
import Colors from '../constants/Colors';
import Button from './Button';

const styles = StyleSheet.create({
  innerText: {
    fontSize: 15,
    fontFamily: 'work-sans',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

const Reminders = ({ reminders }) => {
  const getIcon = (dateType) => {
    let icon = null;
    switch (dateType) {
      case 'nameDay':
        icon = <MaterialCommunityIcons name="alpha-n-box" size={24} color={Colors.primaryColor} />;
        break;
      case 'birthDate':
        icon = <FontAwesome5 name="birthday-cake" size={24} color={Colors.primaryColor} />;
        break;
      case 'priestDate':
        icon = <FontAwesome5 name="wine-glass-alt" size={24} color={Colors.primaryColor} />;
        break;
      case 'deathDate':
        icon = <FontAwesome5 name="cross" size={24} color={Colors.primaryColor} />;
        break;
      default:
        icon = <Ionicons name="ios-calendar" size={24} color={Colors.primaryColor} />;
        break;
    }
    return icon;
  };

  const getPath = (objectKind) => {};

  const getParams = (objectKind, param) => {};

  return (
    <FlatList
      data={reminders}
      renderItem={({ item }) => {
        const IconComp = getIcon(item.dateType);
        return (
          <View>
            <View style={styles.container}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <View style={{ minWidth: '8%', alignItems: 'center' }}>{IconComp}</View>
                <View style={{ marginLeft: 5 }}>
                  {item.entityCountry != null ? (
                    <Flag id={item.entityCountry} size={0.15} />
                  ) : (
                    <Ionicons name="ios-flag" size={23} color={Colors.primaryColor} />
                  )}
                </View>
              </View>

              <View style={{ marginLeft: 15, maxWidth: '60%' }}>
                {item.isImportant ? (
                  <Text style={styles.innerText}>nada</Text>
                ) : (
                  <Text style={styles.innerText}>{item.entityName}</Text>
                )}
              </View>
            </View>
          </View>
        );
      }}
    />
  );
};

export default Reminders;
