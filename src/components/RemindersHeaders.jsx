import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import i18n from 'i18n-js';

import { Ionicons } from 'expo-vector-icons';
import moment from 'moment';
import Colors from '../constants/Colors';
import Button from './Button';

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
  },
});

const RemindersHeaders = ({ reminders, selectedHeader, onChangeSelectedHeader }) => {
  const handleShowReminders = (index) => {
    if (selectedHeader === index) {
      onChangeSelectedHeader(null);
    } else {
      onChangeSelectedHeader(index);
    }
  };

  return (
    <View>
      <Text style={styles.title}>{i18n.t('HOME_SCREEN.REMINDERS')}</Text>
      {reminders && reminders.length > 0 ? (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.entityId}
          renderItem={({ item, index }) => {
            const date = moment.utc(item[0].date).format('dddd, Do MMMM YYYY');
            const importantReminder = item[0].isImportant;
            return (
              <Button style={styles.buttonContainer} onPress={() => handleShowReminders(index)}>
                <>
                  {importantReminder ? (
                    <View style={styles.remindersImportantHeader}>
                      <View style={styles.leftReminderContainer}>
                        <Ionicons name="ios-calendar" size={23} color={Colors.surfaceColorPrimary} />
                      </View>
                    </View>
                  ) : null}
                </>
              </Button>
            );
          }}
        />
      ) : null}
    </View>
  );
};

export default RemindersHeaders;
