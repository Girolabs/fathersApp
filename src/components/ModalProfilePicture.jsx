import { Ionicons } from 'expo-vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, View, Image, Linking, Text } from 'react-native';
import Button from './Button';
import Colors from '../constants/Colors';
import i18n from 'i18n-js';
import countries from 'i18n-iso-countries';
import { MaterialIcons } from '@expo/vector-icons';

countries.registerLocale(require('i18n-iso-countries/langs/en.json'));
countries.registerLocale(require('i18n-iso-countries/langs/es.json'));
countries.registerLocale(require('i18n-iso-countries/langs/de.json'));
countries.registerLocale(require('i18n-iso-countries/langs/pt.json'));

const ModalProfilePicture = (props) => {
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={props.modalVisible}
        presentationStyle="fullScreen"
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
      >
        <View style={styles.topButtons}>
          <Button
            onPress={() => {
              props.Close();
            }}
          >
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="ios-arrow-back" size={24} color={Colors.primaryColor} />
              <Text style={{ marginLeft: 10 }}>{i18n.t('GENERAL.BACK')}</Text>
            </View>
          </Button>
          <Button
            onPress={() => {
              let mail = 'webmaster@schoenstatt-fathers.link';
              let subject = `Photo update for person ${props.fatherId}`;
              let body = `Dear webmaster, please update the photo for ${props.fullName} with the one I will attach to this email. Thanks!`;
              Linking.openURL(`mailto:${mail}?subject=${subject}&body=${body}`);
            }}
          >
            <Ionicons name="md-create" size={24} color={Colors.primaryColor} />
          </Button>
        </View>

        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {props.photo ? (
              <Image
                style={{ width: 300, height: 400, borderRadius: 10 }}
                resizMode="center"
                source={{ uri: `https://schoenstatt-fathers.link${props.photo}` }}
              />
            ) : (
              <Button
                onPress={() => {
                  let mail = 'webmaster@schoenstatt-fathers.link';
                  let subject = `Photo update for person ${props.fatherId}`;
                  let body = `Dear webmaster, please update the photo for ${props.fullName} with the one I will attach to this email. Thanks!`;
                  Linking.openURL(`mailto:${mail}?subject=${subject}&body=${body}`);
                }}
              >
                <MaterialIcons name="add-a-photo" size={300} color="white" />
              </Button>
            )}
          </View>
        </View>
      </Modal>

      {/* <TouchableHighlight
        style={styles.openButton}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <Text style={styles.textStyle}>Show Modal</Text>
      </TouchableHighlight> */}
    </View>
  );
};

const styles = StyleSheet.create({
  topButtons: {
    margin: 20,
    marginTop: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22
  },
  modalView: {
    // margin: 20,
    backgroundColor: Colors.primaryColor,
    borderRadius: 10,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ModalProfilePicture;
