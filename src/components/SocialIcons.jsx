import React from 'react';
import {
  View, StyleSheet, TouchableNativeFeedback, TouchableOpacity, Platform, Linking,
} from 'react-native';
import { Ionicons } from 'expo-vector-icons';
import PropTypes from 'prop-types';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    margin: 5,
  },
});
const SocialIcons = ({
  wa, fb, slack, tw, ig, skype, size,
}) => {
  let TouchableComp = TouchableOpacity;
  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableComp = TouchableNativeFeedback;
  }

  return (
    <View style={styles.container}>
      {wa && (
        <TouchableComp
          onPress={() => {
            Linking.openURL(`http://api.whatsapp.com/send?phone=${wa}`);
          }}
        >
          <Ionicons name="logo-whatsapp" style={styles.icon} size={size} color={Colors.primaryColor} />
        </TouchableComp>
      )}
      {slack && (
        <TouchableComp
          onPress={() => {
            Linking.openURL(`https://schoenstatt-fathers.slack.com/messages/${slack}/`);
          }}
        >
          <Ionicons name="logo-slack" style={styles.icon} size={size} color={Colors.primaryColor} />
        </TouchableComp>
      )}

      {fb && (
        <TouchableComp
          onPress={() => {
            Linking.openURL(`${fb}`);
          }}
        >
          <Ionicons name="logo-facebook" style={styles.icon} size={size} color={Colors.primaryColor} />
        </TouchableComp>
      )}

      {tw && (
        <TouchableComp
          onPress={() => {
            Linking.openURL(`https://twitter.com/${tw}/`);
          }}
        >
          <Ionicons name="logo-twitter" style={styles.icon} size={size} color={Colors.primaryColor} />
        </TouchableComp>
      )}

      {ig && (
        <TouchableComp
          onPress={() => {
            Linking.openURL(`https://www.instagram.com/${ig}`);
          }}
        >
          <Ionicons name="logo-instagram" style={styles.icon} size={size} color={Colors.primaryColor} />
        </TouchableComp>
      )}

      {skype && (
        <TouchableComp
          onPress={() => {
            Linking.openURL(`skype:${skype}?call`);
          }}
        >
          <Ionicons name="logo-skype" style={styles.icon} size={size} color={Colors.primaryColor} />
        </TouchableComp>
      )}
    </View>
  );
};

SocialIcons.propTypes = {
  wa: PropTypes.string,
  tw: PropTypes.string,
  slack: PropTypes.string,
  ig: PropTypes.string,
  skype: PropTypes.string,
  fb: PropTypes.string,
  size: PropTypes.number,
};

SocialIcons.defaultProps = {
  wa: '',
  tw: '',
  slack: '',
  ig: '',
  skype: '',
  fb: '',
  size: 24,
};

export default SocialIcons;
