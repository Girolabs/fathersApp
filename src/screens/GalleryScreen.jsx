import React, { useState } from 'react';
import {
  View,
  Text,
  Platform,
  Image,
  Pressable,
  Alert,
  Button,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import * as _ from 'lodash';
import { TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import imageIcon from '../../assets/imageIcon.png';
import pencil from '../../assets/editpencil.png';
import { savePhoto } from '../api';

const GalleryScreen = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const windowHeight = useWindowDimensions().height;

  const handleChoosePhoto = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      //aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    //console.log('foto', result.uri);

    if (!result.cancelled) {
      setPhoto(result.base64);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    const formValues = {
      caption: description,
      photoBase64Encoded: photo,
    };
    savePhoto(formValues).then(
      (res) => {
        console.log('RESULTADO: ', res);
        setLoading(false);
        Alert.alert(i18n.t('GALLERY.SUCCESS'));
        navigation.goBack();
      },
      (err) => {
        setLoading(false);
        Alert.alert(err.toString());
        console.log(err.response.data);
      },
    );
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
      {loading ? <ActivityIndicator style={{ height: windowHeight }} size="large" color={Colors.primaryColor} /> : null}
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
            {i18n.t('GALLERY.CHOOSE_PHOTO')}
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
              {i18n.t('GALLERY.CHOOSE_ANOTHER_PHOTO')}
            </Text>
            <Image source={imageIcon} />
          </Pressable>
          <Pressable style={{ width: '100%', height: 258 }}>
            <Image source={{ uri: 'data:image/jpeg;base64,' + photo }} style={{ width: '100%', height: '100%' }} />
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
            <Text>{i18n.t('GALLERY.CAPTION')}</Text>
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
          backgroundColor: photo && description !== '' ? '#0104AC' : 'gray',
        }}
      >
        <Button
          onPress={() => {
            handleSubmit();
            console.log(photo, description);
            //Alert.alert('Datos guardados exitosamente');
            //navigation.goBack();
          }}
          title={i18n.t('GALLERY.UPLOAD_PHOTO')}
          disabled={photo && description !== '' ? false : true}
          color={Platform.OS === 'android' ? '#0104AC' : 'white'}
        />
      </View>
    </View>
  );
};

GalleryScreen.navigationOptions = (navigationData) => ({
  headerTitle: i18n.t('GALLERY.POST_PHOTO'),
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
