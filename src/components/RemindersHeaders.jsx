import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import i18n from 'i18n-js';
import DateTimePicker from '@react-native-community/datetimepicker';
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

const RemindersHeaders = ({ reminders, selectedHeader, onChangeSelectedHeader, navigation }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const today = new Date(); // Fecha actual

  // Calcular la fecha mínima (6 meses antes de hoy)
  const minDate = new Date(today);
  minDate.setMonth(today.getMonth() - 6); // Restar 6 meses

  // Calcular la fecha máxima (6 meses después de hoy)
  const maxDate = new Date(today);
  maxDate.setMonth(today.getMonth() + 6); // Sumar 6 meses

  // Función para determinar si un año es bisiesto
  function isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  }

  // Obtener el año actual
  const currentYear = today.getFullYear();

  // Verificar si el año actual es bisiesto
  const isCurrentYearLeap = isLeapYear(currentYear);

  // Si el año actual es bisiesto, restar un día al maxDate
  if (isCurrentYearLeap) {
    maxDate.setDate(maxDate.getDate() - 1); // Restar un día
  }

  // Ahora puedes usar minDate y maxDate en tu selector de fecha

  const dateFormatByLocale = getDateFormatByLocale(moment.locale());

  const handleShowReminders = (index) => {
    if (selectedHeader === index) {
      onChangeSelectedHeader(null);
    } else {
      onChangeSelectedHeader(index);
    }
  };

  const onDateChange = (event, date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  // Filtra los recordatorios según la fecha seleccionada
  const filteredReminders = reminders.filter(
    (item) => moment.utc(item.date).isSame(moment(selectedDate), 'day') && item.memorialEvents.length > 0,
  );

  return (
    <View style={{ paddingHorizontal: 15 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
        <Text style={styles.title}>{i18n.t('HOME_SCREEN.REMINDERS')}</Text>

        <Pressable
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 15,
            backgroundColor: Colors.surfaceColorSecondary,
            borderColor: Colors.primaryColor,
            borderWidth: 2,
            //height: 50,
            width: 170,
          }}
          onPress={() => setShowPicker(true)}
        >
          <Text
            style={{
              fontSize: 12,
              fontFamily: 'work-sans-medium',
              fontWeight: '700',
              color: Colors.primaryColor,
            }}
          >
            {/*moment.utc(selectedDate).format(dateFormatByLocale)*/ i18n.t('HOME_SCREEN.SELECT_DATE')}
          </Text>
          <Ionicons name="ios-calendar" size={23} color={Colors.primaryColor} />
        </Pressable>
      </View>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={minDate}
          maximumDate={maxDate}
        />
      )}

      {filteredReminders && filteredReminders.length > 0 ? (
        <FlatList
          data={filteredReminders}
          key={(item) => item.memorialEvents[0]?.entityObject.eventId}
          renderItem={({ item, index }) => {
            const date = moment.utc(item.date).format(dateFormatByLocale);
            const importantReminder = item.memorialEvents[0]?.isImportant;
            const importantTitle =
              importantReminder && item.memorialEvents[0]?.importantText
                ? `${item.memorialEvents[0]?.text} ${item.memorialEvents[0]?.importantText.replace(
                    '%s',
                    item.memorialEvents[0]?.yearsAgo,
                  )}`
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
                {selectedHeader === index && <Reminders reminders={item.memorialEvents} navigation={navigation} />}
              </View>
            );
          }}
        />
      ) : (
        <Text
          style={{
            color: Colors.primaryColor,
            fontFamily: 'work-sans-semibold',
            marginTop: 5,
            textAlign: 'center',
          }}
        >
          {i18n.t('HOME_SCREEN.NO_REMINDERS_FOR_DATE')}
        </Text>
      )}
    </View>
  );
};

export default RemindersHeaders;
