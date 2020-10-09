import React from 'react';
import { View, Text, StyleSheet, Clipboard } from 'react-native';
import i18n from 'i18n-js';
import { withNavigation } from 'react-navigation';
import { Ionicons } from 'expo-vector-icons';
import PropTypes from 'prop-types';
import Colors from '../constants/Colors';
import Button from './Button';
import DefaultItem from './FatherDetailItem';
import SocialIcons from './SocialIcons';

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  headerTitle: {
    fontFamily: 'work-sans-medium',
    color: Colors.onSurfaceColorPrimary,
    fontSize: 11,
    padding: 15,
    textAlign: 'left',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  bottomContainer: { flexDirection: 'row', width: '100%', marginVertical: 10 },
  saveContactContainer: {
    backgroundColor: 'white',
    borderColor: Colors.primaryColor,
    borderRadius: 5,
    borderWidth: 2,
    paddingHorizontal: 10,
    height: 50,
    marginHorizontal: 15,
    justifyContent: 'center',
  },
  saveContactText: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'work-sans-bold',
    textTransform: 'uppercase',
    color: Colors.primaryColor,
  },
});

const FatherContactInfo = ({
  navigation,
  father,
  viewPermissions,
  setSnackBarVisible,
  setSnackMsg,
  handleSaveContact,
}) => {
  return (
    <>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{i18n.t('FATHER_DETAIL.CONTACT_INFO')}</Text>
        <Button
          onPress={() => {
            navigation.navigate('FatherForm', {
              fatherId: father.personId,
            });
          }}
        >
          <Ionicons name="md-create" size={23} color={Colors.primaryColor} />
        </Button>
      </View>
      <DefaultItem
        show={viewPermissions.indexOf('email')}
        title="FATHER_DETAIL.EMAIL"
        body={father.email}
        icon={<Ionicons name="ios-copy" size={23} color={Colors.primaryColor} />}
        selected={() => {
          Clipboard.setString(father.email);
          setSnackBarVisible();
          setSnackMsg(i18n.t('GENERAL.COPY_CLIPBOARD'));
        }}
      />
      {father.phones &&
        father.phones.map((phone) => {
          console.log('phones', phone);
          return (
            <DefaultItem
              show={viewPermissions.indexOf('phones')}
              titleNoI18n={phone.label}
              body={phone.number}
              icon={<Ionicons name="ios-copy" size={23} color={Colors.primaryColor} />}
              selected={() => {
                Clipboard.setString(phone.number);
                setSnackBarVisible();
                setSnackMsg(i18n.t('GENERAL.COPY_CLIPBOARD'));
              }}
            />
          );
        })}
      {(father.emergencyContact1Name || father.emergencyContact2Name) && (
        <Text style={styles.headerTitle}>{i18n.t('FATHER_DETAIL.EMERGENCY_CONTACT')}</Text>
      )}
      {father.emergencyContact1Name && (
        <DefaultItem
          show={viewPermissions.indexOf('phones')}
          titleNoI18n={father.emergencyContact1Name}
          body={father.emergencyContact1Phone}
          icon={<Ionicons name="ios-copy" size={23} color={Colors.primaryColor} />}
          selected={() => {
            Clipboard.setString(father.emergencyContact1Phone);
            setSnackBarVisible();
            setSnackMsg(i18n.t('GENERAL.COPY_CLIPBOARD'));
          }}
        />
      )}
      {father.emergencyContact2Name && (
        <DefaultItem
          show={viewPermissions.indexOf('phones')}
          titleNoI18n={father.emergencyContact2Name}
          body={father.emergencyContact2Phone}
          icon={<Ionicons name="ios-copy" size={23} color={Colors.primaryColor} />}
          selected={() => {
            Clipboard.setString(father.emergencyContact2Phone);
            setSnackBarVisible();
            setSnackMsg(i18n.t('GENERAL.COPY_CLIPBOARD'));
          }}
        />
      )}

      <View style={styles.bottomContainer}>
        <Button
          onPress={() => {
            handleSaveContact();
          }}
        >
          <View style={styles.saveContactContainer}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 12,
                fontFamily: 'work-sans-bold',
                textTransform: 'uppercase',
                color: Colors.primaryColor,
              }}
            >
              {i18n.t('FATHER_DETAIL.SAVE_CONTACT')}
            </Text>
          </View>
        </Button>

        <SocialIcons
          wa={father.phones.length >= 1 && father.phones[0].whatsApp === true ? father.phones[0].number : false}
          fb={father.facebookUrl}
          slack={father.slackUser}
          tw={father.twitterUser}
          ig={father.instagramUser}
          skype={father.skypeUser}
          size={24}
        />
      </View>
    </>
  );
};

FatherContactInfo.defaultProps = {
  viewPermissions: [],
};

FatherContactInfo.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  father: PropTypes.shape({
    personId: PropTypes.number.isRequired,
    email: PropTypes.string,
    phones: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        number: PropTypes.string,
        whatsApp: PropTypes.bool,
      }),
    ),
    facebookUrl: PropTypes.string,
    slackUser: PropTypes.string,
    instagramUser: PropTypes.string,
    skypeUser: PropTypes.string,
    twitterUser: PropTypes.string,
  }).isRequired,
  viewPermissions: PropTypes.arrayOf(PropTypes.string),
  setSnackBarVisible: PropTypes.func.isRequired,
  setSnackMsg: PropTypes.func.isRequired,
  handleSaveContact: PropTypes.func.isRequired,
};

export default withNavigation(FatherContactInfo);
