import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import i18n from 'i18n-js';

import { Ionicons } from 'expo-vector-icons';
import moment from 'moment';
import PropTypes from 'prop-types';
import Colors from '../constants/Colors';
import Button from './Button';
import Reminders from './Reminders';
import { getDateFormatByLocale } from '../utils/date-utils';

const styles = StyleSheet.create({
  title: {
    color: Colors.primaryColor,
    fontFamily: 'work-sans-semibold',
    fontSize: 28,
    marginTop: 5,
    padding: 20,
  },
  buttonContainer: {
    flex: 1,
    marginBottom: 15,
  },
  remindersImportantHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.secondaryColor,
    borderRadius: 15,
    marginTop: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  reminderHeader: {
    backgroundColor: Colors.primaryColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 5,
    borderRadius: 15,
  },
  leftReminderContainer: {
    flexDirection: 'row',
  },
  reminderHeaderTitle: {
    color: Colors.surfaceColorPrimary,
    fontSize: 15,
    fontFamily: 'work-sans-medium',
    marginLeft: 10,
    width: '90%',
  },
  rightReminderContainer: {},
});

const RemindersHeaders = ({ reminders, selectedHeader, onChangeSelectedHeader }) => {
  const dateFormatByLocale = getDateFormatByLocale(moment.locale());
  const handleShowReminders = (index) => {
    if (selectedHeader === index) {
      onChangeSelectedHeader(null);
    } else {
      onChangeSelectedHeader(index);
    }
  };
  console.log(dateFormatByLocale);

  return (
    <View>
      <Text style={styles.title}>{i18n.t('HOME_SCREEN.REMINDERS')}</Text>
      {reminders && reminders.length > 0 ? (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.entityId}
          renderItem={({ item, index }) => {
            const date = moment.utc(item[0].date).format(dateFormatByLocale);
            const importantReminder = item[0].isImportant;
            const importantTitle =
              importantReminder && item[0].importantText
                ? `${item[0].text} ${item[0].importantText.replace('%s', item[0].yearsAgo)}`
                : null;
            return (
              <View>
                <Button style={styles.buttonContainer} onPress={() => handleShowReminders(index)}>
                  {importantReminder ? (
                    <View style={styles.remindersImportantHeader}>
                      <View style={styles.leftReminderContainer}>
                        <Ionicons name="ios-calendar" size={23} color={Colors.surfaceColorPrimary} />
                        <Text style={styles.reminderHeaderTitle}>{importantTitle}</Text>
                      </View>
                      <View style={styles.rightReminderContainer}>
                        {selectedHeader === index ? (
                          <Ionicons name="md-arrow-dropup" size={23} color={Colors.surfaceColorPrimary} />
                        ) : (
                          <Ionicons name="md-arrow-dropdown" size={23} color={Colors.surfaceColorPrimary} />
                        )}
                      </View>
                    </View>
                  ) : (
                    <View style={styles.reminderHeader}>
                      <View style={styles.leftReminderContainer}>
                        <Ionicons name="ios-calendar" size={23} color={Colors.surfaceColorPrimary} />
                        <Text style={styles.reminderHeaderTitle}>{date}</Text>
                      </View>
                      <View style={styles.rightReminderContainer}>
                        {selectedHeader === index ? (
                          <Ionicons name="md-arrow-dropup" size={23} color={Colors.surfaceColorPrimary} />
                        ) : (
                          <Ionicons name="md-arrow-dropdown" size={23} color={Colors.surfaceColorPrimary} />
                        )}
                      </View>
                    </View>
                  )}
                </Button>
                {selectedHeader === index && <Reminders reminders={item} />}
              </View>
            );
          }}
        />
      ) : null}
    </View>
  );
};

RemindersHeaders.propTypes = {
  onChangeSelectedHeader: PropTypes.func.isRequired,
  selectedHeader: PropTypes.number.isRequired,
  reminders: PropTypes.arrayOf(PropTypes.array).isRequired,
};

export default RemindersHeaders;
