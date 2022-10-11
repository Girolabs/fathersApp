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
  Button,
} from 'react-native';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
//import Button from '../components/Button';
import * as _ from 'lodash';
import { Ionicons } from 'expo-vector-icons';
import { TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import imageIcon from '../../assets/imageIcon.png';
import pencil from '../../assets/editpencil.png';

const GalleryScreen = () => {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');

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
        alignItems: 'center',
        backgroundColor: '#F2F3FF',
        //marginVertical: 20,
      }}
    >
      {!photo ? (
        <Pressable
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: 258,
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
              color: Colors.onSurfaceColorPrimary,
              marginRight: 10,
              fontFamily: 'work-sans',
              fontStyle: 'normal',
              fontWeight: '500',
            }}
          >
            Choose a photo
          </Text>
          <Image source={imageIcon} />
        </Pressable>
      ) : (
        <>
          <Pressable
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '10%',
              marginVertical: 10,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
            onPress={handleChoosePhoto}
          >
            <Text
              style={{
                fontSize: 15,
                color: Colors.onSurfaceColorPrimary,
                marginRight: 10,
                fontFamily: 'work-sans',
                fontStyle: 'normal',
                fontWeight: '500',
              }}
            >
              Choose another photo
            </Text>
            <Image source={imageIcon} />
          </Pressable>
          <Pressable style={{ width: '100%', height: 258 }}>
            <Image source={{ uri: photo }} style={{ width: '100%', height: '100%' }} />
          </Pressable>
        </>
      )}

      <TextInput
        value={description}
        onChangeText={(value) => setDescription(value)}
        maxLength={120}
        multiline={true}
        textAlignVertical="top"
        style={{
          width: '90%',
          height: 92,
          marginVertical: 10,
          borderRadius: 8,
          backgroundColor: '#FFFFFF',
        }}
        theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent' } }}
        placeholderTextColor="gray"
        label={
          <>
            <Image source={pencil} />
            <View
              style={{
                width: 10,
              }}
            ></View>
            <Text>Caption</Text>
          </>
        }
        required
        autoCapitalize="none"
      />
      <View
        style={{
          borderRadius: 5,
          width: '90%',
          //height: 46,
          justifyContent: 'center',
          marginTop: photo ? 64 : 144,
          backgroundColor: '#0104AC',
        }}
      >
        <Button
          title="S u b i r  f o t o"
          disabled={photo && description !== '' ? false : true}
          color={Platform.OS === 'android' ? '#0104AC' : 'white'}
        />
      </View>
    </View>
  );
};

GalleryScreen.navigationOptions = (navigationData) => ({
  headerTitle: 'Post photo',
  headerTintColor: Colors.primaryColor,
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
