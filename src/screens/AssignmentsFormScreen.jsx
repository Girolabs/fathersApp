import React, { Component, Fragment, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import InputWithFormik from '../components/InputWithFormik';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import * as Network from 'expo-network';
import i18n from 'i18n-js';
import SnackBar from '../components/SnackBar';
import Colors from '../constants/Colors';
import { NavigationEvents } from 'react-navigation';
import { getPerson, getInterfaceData, updateFatherForm } from '../api';
import Button from '../components/Button';
import SwitchWithFormik from '../components/SwitchWithFormik';
import Select from '../components/Select';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as _ from 'lodash';
import { Ionicons } from 'expo-vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import Input from '../components/Input';
import { TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

function toIsoString(date) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? '+' : '-',
    pad = function (num) {
      return (num < 10 ? '0' : '') + num;
    };

  return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()); /* +
          'T' + pad(date.getHours()) +
          ':' + pad(date.getMinutes()) +
          ':' + pad(date.getSeconds()) +
          dif + pad(Math.floor(Math.abs(tzo) / 60)) +
          ':' + pad(Math.abs(tzo) % 60);*/
}
const today = new Date();
const todayString = toIsoString(today);

const EditableDateItem = function (props) {
  //const [showPicker, setShowPicker] = useState(false);
  const [show, setShow] = useState(false);

  let editableItemStyle = StyleSheet.create({
    item: {
      width: '80%',
      height: 50,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingVertical: 5,
      borderRadius: 10,
      marginTop: 10,
      marginBottom: 7,
      backgroundColor: '#FFFFFF',
    },
  });

  return (
    <View style={editableItemStyle.item}>
      {show && (
        <DateTimePicker
          value={new Date(props.date)}
          onChange={(event, val) => {
            setShow(false);
            const pickedDate = toIsoString(val);
            if (event.type === 'set') {
              props.onDateChange(pickedDate);
            }
          }}
          disabled={props.disabled}
        />
      )}

      <Text>{props.label}</Text>
      <Text
        style={{
          color: Colors.onSurfaceColorPrimary,
          fontSize: 16,
        }}
      >
        {props.date}
      </Text>

      <Pressable
        style={{
          marginLeft: 'auto',
        }}
        onPress={() => {
          setShow(true);
          if (!props.disabled) {
            setShow(false);
          }
        }}
      >
        <Ionicons name="ios-calendar" size={23} color={Colors.primaryColor} />
      </Pressable>
      <View />
    </View>
  );
};

const AssigmentsFormScreen = () => {
  const [rol, setRol] = useState('');
  const [person, setPerson] = useState('');
  const [publicNotes, setPublicNotes] = useState('');
  const [startDate, setStartDate] = useState(todayString);
  const [endDate, setEndDate] = useState(todayString);
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F3FF',
      }}
    >
      <Text
        style={{
          fontFamily: 'work-sans-semibold',
          color: Colors.primaryColor,
          fontSize: 20,
          textAlign: 'left',
          letterSpacing: 2.5,
          textTransform: 'uppercase',
        }}
      >
        {i18n.t('GENERAL.ASSIGNMENTS')}
      </Text>
      <TextInput
        style={{
          width: '80%',
          height: 50,
          marginVertical: 10,
          borderRadius: 5,
          backgroundColor: '#FFFFFF',
        }}
        theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent' } }}
        label="Role ID"
        required
        autoCapitalize="none"
        placeholderTextColor={Colors.onSurfaceColorSecondary}
        value={rol}
        onChange={(value) => setRol(value)}
      />
      <TextInput
        style={{
          width: '80%',
          height: 50,
          marginVertical: 10,
          borderRadius: 5,
          backgroundColor: '#FFFFFF',
        }}
        theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent' } }}
        label="Person ID"
        required
        autoCapitalize="none"
        placeholderTextColor={Colors.onSurfaceColorSecondary}
        value={person}
        onChange={(value) => setPerson(value)}
      />
      <Text
        style={{
          color: Colors.onSurfaceColorPrimary,
          fontWeight: 'bold',
        }}
      >
        {i18n.t('FATHER_DETAIL.START_DATE')}
      </Text>
      <EditableDateItem
        date={startDate}
        onDateChange={(value) => {
          setStartDate(value);
        }}
        disabled={true}
      />
      <Text
        style={{
          color: Colors.onSurfaceColorPrimary,
          fontWeight: 'bold',
        }}
      >
        {i18n.t('FATHER_DETAIL.END_DATE')}
      </Text>
      <EditableDateItem
        date={endDate}
        onDateChange={(value) => {
          setEndDate(value);
        }}
        disabled={true}
      />
      <TextInput
        style={{
          width: '80%',
          height: 50,
          marginVertical: 10,
          borderRadius: 5,
          backgroundColor: '#FFFFFF',
        }}
        theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent' } }}
        label={i18n.t('LIVING_SITUATION.PUBLIC_NOTES')}
        required
        autoCapitalize="none"
        placeholderTextColor={Colors.onSurfaceColorSecondary}
        value={publicNotes}
        onChange={(value) => setPublicNotes(value)}
      />
      <Button>
        <View
          style={{
            width: '80%',
            marginVertical: 10,
            borderRadius: 8,
            backgroundColor: 'gray',
            backgroundColor: Colors.primaryColor,
            paddingHorizontal: 5,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              textTransform: 'uppercase',
              fontFamily: 'work-sans-bold',
            }}
          >
            {i18n.t('FATHER_EDIT.SAVE')}
          </Text>
        </View>
      </Button>
    </View>
  );
};
AssigmentsFormScreen.navigationOptions = (navigationData) => ({
  headerTitle: '',
  headerRight: () => (
    <HeaderButtons HeaderButtonComponent={HeaderButton}>
      <Item
        title="Menu"
        iconName="md-menu"
        onPress={() => {
          navigationData.navigation.toggleDrawer();
        }}
      />
    </HeaderButtons>
  ),
  headerBackTitle: i18n.t('GENERAL.BACK'),
});

export default AssigmentsFormScreen;
