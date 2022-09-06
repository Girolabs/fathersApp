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
  Image,
  Pressable,
  Alert,
} from 'react-native';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import Button from '../components/Button';
import * as _ from 'lodash';
import { Ionicons } from 'expo-vector-icons';
import { TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

const GalleryScreen = () => {
  const [photo, setPhoto] = useState(null);
  const [description, setDesciption] = useState('');

  const handleChoosePhoto = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setPhoto(result.uri);
    }
  };

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F3FF',
        //marginVertical: 20,
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
        Gallery
      </Text>
      <Pressable
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '80%',
          marginVertical: 10,
          borderRadius: 8,
          backgroundColor: '#eeeeee',
          paddingHorizontal: 10,
          paddingVertical: 10,
          backgroundColor: '#FFFFFF',
        }}
        onPress={handleChoosePhoto}
      >
        <Text
          style={{
            fontSize: 15,
            color: Colors.onSurfaceColorSecondary,
          }}
        >
          Choose a photo
        </Text>
        <Ionicons name="ios-images" size={23} color={Colors.primaryColor} />
      </Pressable>
      <Image
        source={{ uri: photo }}
        style={{ width: '80%', height: 150, backgroundColor: '#292929', borderRadius: 8 }}
      />
      <TextInput
        value={description}
        onChange={(value) => setDesciption(value)}
        maxLength={120}
        multiline={true}
        textAlignVertical="top"
        style={{
          width: '80%',
          height: 110,
          marginVertical: 10,
          borderRadius: 8,
          backgroundColor: '#FFFFFF',
        }}
        theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent' } }}
        placeholderTextColor="gray"
        label="Description"
        required
        autoCapitalize="none"
      />
      <Button>
        <View
          style={{
            width: '80%',
            marginVertical: 10,
            borderRadius: 8,
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
            placeholderTextColor={Colors.onSurfaceColorSecondary}
          >
            {i18n.t('FATHER_EDIT.SAVE')}
          </Text>
        </View>
      </Button>
    </View>
  );
};

GalleryScreen.navigationOptions = (navigationData) => ({
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

export default GalleryScreen;
