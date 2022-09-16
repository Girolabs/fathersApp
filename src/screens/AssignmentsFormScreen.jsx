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
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

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

const entities = [
  { name: 'Entity 1', value: 1 },
  { name: 'Entity 2', value: 2 },
  { name: 'Entity 3', value: 3 },
  { name: 'Entity 4', value: 4 },
];

const roles = [
  { name: 'Role 1', value: 1 },
  { name: 'Role 2', value: 2 },
  { name: 'Role 3', value: 3 },
  { name: 'Role 4', value: 4 },
];

const EditableDateItem = function (props) {
  const [show, setShow] = useState(false);

  let editableItemStyle = StyleSheet.create({
    item: {
      width: '90%',
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
  const [entity, setEntity] = useState('');
  const [role, setRole] = useState('');
  const [person, setPerson] = useState(null);
  const [publicNotes, setPublicNotes] = useState('');
  const [startDate, setStartDate] = useState(todayString);
  const [endDate, setEndDate] = useState(todayString);
  const [isCreate, setIsCreate] = useState(true);
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
      {isCreate ? (
        <Text
          style={{
            fontFamily: 'work-sans-semibold',
            color: Colors.primaryColor,
            fontSize: 20,
            textAlign: 'left',
            letterSpacing: 2.5,
            //textTransform: 'uppercase',
            //margin: 10,
            padding: 20,
          }}
        >
          Formulario de Asignaciones
        </Text>
      ) : (
        <Text
          style={{
            fontFamily: 'work-sans-semibold',
            color: Colors.primaryColor,
            fontSize: 20,
            textAlign: 'left',
            letterSpacing: 2.5,
            //textTransform: 'uppercase',
            //margin: 10,
            padding: 20,
          }}
        >
          Editar {i18n.t('GENERAL.ASSIGNMENTS')}
        </Text>
      )}
      {/*
          <View
            style={{
              width: '90%',
            }}
          >
            <Text
              style={{
                color: Colors.onSurfaceColorSecondary,
                //color: Colors.onSurfaceColorPrimary,
                fontWeight: 'bold',
                //textAlign: 'center',
              }}
              required
            >
              Lista de Entidades
            </Text>
            <Select
              style={{
                backgroundColor: Colors.surfaceColorSecondary,
                height: 50,
                marginVertical: 10,
                borderRadius: 5,
              }}
              elements={entities}
              value={entity}
              valueChange={(value) => setEntity(value)}
            />
          </View>
            */}
      {
        <View
          style={{
            width: '90%',
          }}
        >
          <Text
            style={{
              //color: Colors.onSurfaceColorSecondary,
              //color: Colors.onSurfaceColorPrimary,
              fontWeight: 'bold',
              //textAlign: 'center',
              fontFamily: 'work-sans-semibold',
              color: Colors.primaryColor,
            }}
            required
          >
            Lista de {i18n.t('GENERAL.ASSIGNMENTS')}
          </Text>
          <Select
            style={{
              backgroundColor: Colors.surfaceColorSecondary,
              height: 50,
              marginVertical: 10,
              borderRadius: 5,
            }}
            elements={roles}
            value={role}
            valueChange={(value) => setRole(value)}
          />
        </View>
      }
      {
        <View
          style={{
            width: '90%',
          }}
        >
          <Text
            style={{
              //color: Colors.onSurfaceColorSecondary,
              //color: Colors.onSurfaceColorPrimary,
              fontWeight: 'bold',
              //textAlign: 'center',
              fontFamily: 'work-sans-semibold',
              color: Colors.primaryColor,
            }}
            required
          >
            Lista de Personas
          </Text>
          <AutocompleteDropdown
            containerStyle={{ marginVertical: 10 }}
            clearOnFocus={false}
            closeOnSubmit={false}
            initialValue={{ id: '2' }}
            onSelectItem={setPerson}
            dataSet={[
              { id: '1', title: 'Person1' },
              { id: '2', title: 'Person2' },
              { id: '3', title: 'Person3' },
            ]}
          />
          {/*<Text
              style={{
                color: Colors.onSurfaceColorSecondary,
                //color: Colors.onSurfaceColorPrimary,
                fontWeight: 'bold',
                //textAlign: 'center',
              }}
              required
            >
              Lista de Personas
            </Text>
            <Select
              style={{
                backgroundColor: Colors.surfaceColorSecondary,
                height: 50,
                marginVertical: 10,
                borderRadius: 5,
              }}
              elements={persons}
              value={person}
              valueChange={(value) => setPerson(value)}
            />*/}
        </View>
      }
      <View
        style={{
          width: '90%',
        }}
      >
        <Text
          style={{
            //color: Colors.onSurfaceColorSecondary,
            //color: Colors.onSurfaceColorPrimary,
            fontWeight: 'bold',
            //textAlign: 'center',
            fontFamily: 'work-sans-semibold',
            color: Colors.primaryColor,
          }}
        >
          {i18n.t('FATHER_DETAIL.START_DATE')}
        </Text>
      </View>
      <EditableDateItem
        date={startDate}
        onDateChange={(value) => {
          setStartDate(value);
        }}
        disabled={true}
      />
      <View
        style={{
          width: '90%',
        }}
      >
        <Text
          style={{
            //color: Colors.onSurfaceColorSecondary,
            //color: Colors.onSurfaceColorPrimary,
            fontWeight: 'bold',
            //textAlign: 'center',
            fontFamily: 'work-sans-semibold',
            color: Colors.primaryColor,
          }}
        >
          {i18n.t('FATHER_DETAIL.END_DATE')}
        </Text>
      </View>
      <EditableDateItem
        date={endDate}
        onDateChange={(value) => {
          setEndDate(value);
        }}
        disabled={true}
      />
      <View
        style={{
          width: '90%',
        }}
      >
        <Text
          style={{
            //color: Colors.onSurfaceColorSecondary,
            //color: Colors.onSurfaceColorPrimary,
            fontWeight: 'bold',
            //textAlign: 'center',
            fontFamily: 'work-sans-semibold',
            color: Colors.primaryColor,
          }}
        >
          {i18n.t('LIVING_SITUATION.PUBLIC_NOTES')}
        </Text>
        <TextInput
          style={{
            height: 50,
            marginVertical: 10,
            borderRadius: 5,
            backgroundColor: '#FFFFFF',
          }}
          theme={{ colors: { primary: '#0104AC', underlineColor: 'transparent' } }}
          //label={i18n.t('LIVING_SITUATION.PUBLIC_NOTES')}
          required
          autoCapitalize="none"
          placeholderTextColor={Colors.onSurfaceColorSecondary}
          value={publicNotes}
          onChange={(value) => setPublicNotes(value)}
        />
      </View>
      <Button>
        <View
          style={{
            backgroundColor: 'white',
            borderColor: Colors.primaryColor,
            borderRadius: 5,
            borderWidth: 2,
            paddingHorizontal: 10,
            width: '90%',
            height: 50,
            justifyContent: 'center',
            marginVertical: 10,
          }}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: 12,
              width: '100%',
              fontFamily: 'work-sans-bold',
              textTransform: 'uppercase',
              color: Colors.primaryColor,
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
