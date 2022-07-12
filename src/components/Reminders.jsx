import React from 'react';
import { View, StyleSheet, FlatList, Text, Linking, Image } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Flag } from 'react-native-svg-flagkit';
import { withNavigation } from 'react-navigation';
import moment from 'moment';
import PropTypes from 'prop-types';
import Colors from '../constants/Colors';
import Button from './Button';
import logo from '../../assets/img/iconPriestDate.png';
import bishopLogo from '../../assets/img/bishop.png';

const styles = StyleSheet.create({
  innerText: {
    fontSize: 15,
    fontFamily: 'work-sans',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iconsTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconContainer: {
    minWidth: '8%',
    alignItems: 'center',
  },
  flagContainer: {
    marginLeft: 5,
  },
  textContainer: {
    marginLeft: 15,
    minWidth: '70%',
    maxWidth: '70%',
  },
});

const Reminders = ({ navigation, reminders }) => {
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
        // icon = <FontAwesome5 name="wine-glass-alt" size={24} color={Colors.primaryColor} />;
        icon = (
          <Image
            style={{
              width: 24,
              height: 35,
            }}
            source={logo}
          />
        );
        break;
      case 'deathDate':
        icon = <FontAwesome5 name="cross" size={24} color={Colors.primaryColor} />;
        break;
      case 'bishopDate':
        icon = (
          <Image
            style={{
              width: 24.5,
              height: 27.5,
            }}
            source={bishopLogo}
          />
        );
        break;
      default:
        icon = <Ionicons name="ios-calendar" size={24} color={Colors.primaryColor} />;
        break;
    }
    return icon;
  };

  const getPath = (objectKind) => {
    let path = null;
    switch (objectKind) {
      case 'person':
        path = 'PatreDetail';
        break;
      case 'territory':
        path = 'DelegationDetail';
        break;
      case 'course':
        path = 'CourseDetail';
        break;
      case 'generation':
        path = 'GenerationDetail';
        break;
      default:
        path = 'null';
        break;
    }
    return path;
  };

  const getParams = (objectKind, param) => {
    let params = null;
    switch (objectKind) {
      case 'person':
        params = { fatherId: param.personId };
        break;
      case 'territory':
        params = { delegationId: param.territoryId };
        break;
      case 'course':
        params = { courseId: param.courseId };
        break;
      case 'generation':
        params = { generationId: param.generationId };
        break;
      default:
        params = { fatherId: param.personId };
        break;
    }
    return params;
  };

  return (
    <FlatList
      data={reminders}
      keyExtractor={(item) => item.entityId.toString()}
      renderItem={({ item }) => {
        const IconComp = getIcon(item.dateType);
        const path = getPath(item.kind);
        const params = getParams(item.kind, item.entityObject);
        const date = moment.utc(item.date).format('dddd, Do MMMM YYYY');
        const prefixWa = 'http://api.whatsapp.com/send?phone=';
        return (
          <View>
            <View style={styles.container}>
              <View style={styles.iconsTextContainer}>
                <View style={styles.iconsContainer}>
                  <View style={styles.iconContainer}>{IconComp}</View>
                  <View style={styles.flagContainer}>
                    {item.entityCountry != null ? (
                      <Flag id={item.entityCountry} size={0.15} />
                    ) : (
                      <Ionicons name="ios-flag" size={23} color={Colors.primaryColor} />
                    )}
                  </View>
                </View>

                <View style={styles.textContainer}>
                  <>
                    {item.isImportant ? (
                      <Button
                        onPress={() => {
                          if (path) navigation.navigate(path, params);
                        }}
                      >
                        <View>
                          <Text style={styles.innerText}>{item.entityName}</Text>
                          <Text style={styles.innerText}>{date}</Text>
                        </View>
                      </Button>
                    ) : (
                      <Button
                        onPress={() => {
                          navigation.navigate(path, params);
                        }}
                      >
                        <View style={{ width: '100%' }}>
                          <Text style={styles.innerText}>{item.entityName}</Text>
                          {item.yearsAgoText && (
                            <Text style={styles.reminderHeader}>
                              {`${item.yearsAgoText.replace('%s', item.yearsAgo)} `}
                            </Text>
                          )}
                        </View>
                      </Button>
                    )}
                  </>
                </View>
              </View>
              <View>
                {item.entityObject.phones !== undefined &&
                  item.entityObject.phones.length > 0 &&
                  item.entityObject.phones[0].whatsApp && (
                    <Button
                      onPress={() => {
                        Linking.openURL(`${prefixWa}${item.entityObject.phones[0].number}`);
                      }}
                    >
                      <Ionicons name="logo-whatsapp" size={23} color={Colors.onSurfaceColorSecondary} />
                    </Button>
                  )}
              </View>
            </View>
          </View>
        );
      }}
    />
  );
};

Reminders.defaultProps = {
  reminders: [],
};

Reminders.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  reminders: PropTypes.arrayOf(PropTypes.object),
};

export default withNavigation(Reminders);
