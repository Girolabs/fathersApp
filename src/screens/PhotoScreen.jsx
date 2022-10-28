import { View, Text, Image, StyleSheet, ScrollView, Pressable, Platform, ActivityIndicator } from 'react-native';
import React from 'react';
import data from '../data/data';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import { useEffect } from 'react';
import heart from '../../assets/heart.png';
import comments from '../../assets/message-circle.png';
import * as ScreenOrientation from 'expo-screen-orientation';
import { NavigationEvents } from 'react-navigation';
import { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { getPhoto, url } from '../api';

const PhotoScreen = ({ navigation }) => {
  const photoID = navigation.getParam('photoGalleryId');
  const [loading, setLoading] = useState(false);
  const [like, setLike] = useState(false);
  const [totalLikes, setTotalLikes] = useState(245);
  const [totalComments, setTotalComments] = useState([]);
  const [openComment, setOpenComment] = useState(false);
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState({});

  const loadPhoto = () => {
    setLoading(true);
    getPhoto(photoID).then((res) => {
      setPhoto(res.data.result);
      setLoading(false);
      console.log(photo);
    });
  };

  useEffect(() => {
    loadPhoto();
    console.log('ID: ', photoID);
    async function orientationBack() {
      // Restric orientation PORTRAIT_UP screen
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
    return () => {
      orientationBack();
    };
  }, []);
  return (
    <ScrollView>
      <NavigationEvents
        onDidFocus={async () => {
          // Unlock landscape orentation
          await ScreenOrientation.unlockAsync();
        }}
      />
      {!loading ? (
        <View
          style={{
            backgroundColor: '#F2F3FF',
            width: '100%',
            height: '100%',
          }}
        >
          <View
            style={{
              width: '100%',
              height: 400,
            }}
          >
            <Image
              resizeMode="cover"
              source={{ uri: /*data[0].source*/ url + photo.url }}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </View>
          <View
            style={{
              marginHorizontal: 20,
              marginVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'work-sans',
                fontWeight: '500',
                color: '#292929',
              }}
            >
              {/*data[0].title*/ photo.caption}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 20,
              marginVertical: 10,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Pressable
              onPress={() => {
                setLike(!like);
                console.log(like);
                if (like) {
                  setTotalLikes(totalLikes - 1);
                } else {
                  setTotalLikes(totalLikes + 1);
                }
              }}
            >
              <Image
                source={heart}
                style={{
                  width: 25,
                  height: 25,
                  tintColor: like ? 'red' : '#B6B6D9',
                }}
              />
            </Pressable>
            <Text
              style={{
                marginRight: 130,
              }}
            >
              {/*totalLikes + " likes"*/ photo.likesCount + ' ' + i18n.t('GALLERY.LIKES')}
            </Text>
            <Pressable onPress={() => setOpenComment(!openComment)}>
              <Image
                source={comments}
                style={{
                  width: 25,
                  height: 25,
                }}
              />
            </Pressable>
            <Text>
              {/*20 comments*/}
              {photo.commentsCount + ' ' + i18n.t('GALLERY.COMMENTS')}
            </Text>
          </View>
          <View
            style={{
              borderBottomColor: '#fff',
              marginLeft: 'auto',
              marginRight: 'auto',
              borderBottomWidth: StyleSheet.hairlineWidth,
              width: '90%',
            }}
          />
          <View
            style={{
              margin: 20,
              marginTop: 0,
            }}
          >
            {openComment ? (
              <View
                style={{
                  marginVertical: 20,
                }}
              >
                <TextInput
                  style={{
                    height: 50,
                    marginVertical: 10,
                    borderRadius: 5,
                    backgroundColor: '#FFFFFF',
                    padding: 10,
                  }}
                  theme={{ colors: { primary: '#0104AC', underlineColor: 'transparent' } }}
                  required
                  value={comment}
                  autoCapitalize="none"
                  placeholderTextColor={Colors.onSurfaceColorSecondary}
                  placeholder="Comment"
                  onChangeText={(value) => setComment(value)}
                />
                <Pressable
                  onPress={() => {
                    setTotalComments((ant) => [
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          marginTop: 21,
                          marginVertical: 8,
                        }}
                      >
                        <View
                          style={{
                            borderRadius: 50,
                            backgroundColor: '#fff',
                            width: 30,
                            height: 30,
                            marginRight: 10,
                            overflow: 'hidden',
                            borderStyle: 'solid',
                            borderColor: '#292929',
                            borderWidth: 2,
                          }}
                        >
                          <Image
                            source={{ uri: data[0].source }}
                            style={{
                              width: '100%',
                              height: '100%',
                            }}
                          />
                        </View>
                        <Text
                          style={{
                            marginRight: 10,
                            color: '#0104AC',
                            fontFamily: 'work-sans',
                            fontWeight: '700',
                            fontSize: 15,
                          }}
                        >
                          Usuario
                        </Text>
                        <Text
                          style={{
                            color: '#292929',
                            fontFamily: 'work-sans',
                            fontWeight: '500',
                            fontSize: 15,
                          }}
                        >
                          {comment}
                        </Text>
                      </View>,
                      ...ant,
                    ]);
                  }}
                  style={{
                    position: 'absolute',
                    top: '80%',
                    left: '70%',
                    backgroundColor: Colors.primaryColor,
                    borderRadius: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    width: '30%',
                    height: 'auto',
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
                      color: 'white',
                    }}
                  >
                    Comentar
                  </Text>
                </Pressable>
              </View>
            ) : null}
            {totalComments}
          </View>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            padding: 15,
            backgroundColor: Colors.surfaceColorPrimary,
            justifyContent: 'center',
          }}
        >
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      )}
    </ScrollView>
  );
};

PhotoScreen.navigationOptions = (navigationData) => ({
  headerTitle: i18n.t('GALLERY.PHOTO'),
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

export default PhotoScreen;
