import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  AsyncStorage,
  useWindowDimensions,
  Alert,
} from 'react-native';
import React from 'react';
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
import { getPersonByUser, getPersons, getPhoto, url, likePhoto, unlikePhoto, commentPhoto, deletePhoto } from '../api';
import icon from '../../assets/img/icon_app.png';
import { Ionicons } from 'expo-vector-icons';

const PhotoScreen = ({ navigation }) => {
  const photoID = navigation.getParam('galleryPhotoId');
  const [loading, setLoading] = useState(true);
  const [like, setLike] = useState(false);
  const [totalLikes, setTotalLikes] = useState(245);
  const [commentsCount, setCommentsCount] = useState(0);
  const [totalComments, setTotalComments] = useState([]);
  const [openComment, setOpenComment] = useState(false);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(true);
  const [photo, setPhoto] = useState({});
  const [user, setUser] = useState({});
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [warning, setWarning] = useState(false);

  const loadPhoto = () => {
    setLoading(true);
    getPhoto(photoID).then((res) => {
      setPhoto(res.data.result);
      setLoading(false);
      console.log('foto', photo);
      //setTotalLikes(res.data.result.likesCount);
      //setCommentsCount(res.data.result.commentsCount);
    });
  };

  const getEmail = async () => {
    const identity = await AsyncStorage.getItem('email');
    console.log(identity);
    setEmail(identity);
  };

  const loadPerson = () => {
    if (email !== '') {
      getPersons().then((res) => {
        const data = res.data.result;
        const dataFil = data.filter((f) => f.email === email);
        setUserId(dataFil[0].personId);
      });
      console.log(userId);
    }
  };

  const loadUser = () => {
    if (userId)
      getPersonByUser(userId).then((res) => {
        setUser({
          fullName: res.data.result.fullName,
          photo: res.data.result.photo,
        });
      });
  };

  const saveLike = async () => {
    await likePhoto(photoID).then(
      (res) => {
        console.log('works! like!', res);
        setLike(true);
      },
      (err) => {
        console.log('ERROR: ', err);
        alert(err);
      },
    );
  };

  const saveUnlike = async () => {
    await unlikePhoto(photoID).then(
      (res) => {
        console.log('works! unlike!', res);
        setLike(false);
      },
      (err) => {
        console.log('ERROR: ', err);
        alert(err);
      },
    );
  };

  const saveComment = () => {
    const commentValue = {
      comment: comment,
    };
    commentPhoto(photoID, commentValue).then(
      (res) => {
        console.log('works comment!', res);
        setComment('');
      },
      (err) => {
        console.log(err);
        alert(err);
      },
    );
  };

  const saveDeletePhoto = () => {
    deletePhoto(photoID).then(
      (res) => {
        console.log('works delete photo!', res);
        navigation.goBack();
      },
      (err) => {
        console.log(err);
        alert(err);
      },
    );
  };

  useEffect(() => {
    getEmail();
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

  useEffect(() => {
    loadUser();
  }, [userId]);

  useEffect(() => {
    loadPerson();
  }, [email]);

  /*useEffect(() => {
    loadPhoto();
  }, [like]);*/

  const windowHeight = useWindowDimensions().height;

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
              source={{ uri: /*data[0].source*/ url + photo.pathThumbnail2048 }}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: 10,
                left: '90%',
              }}
            >
              {photo.createdByPersonId == userId ? (
                <Pressable onPress={() => setWarning(true)}>
                  <Ionicons name="md-close-circle" size={28} color={Colors.primaryColor} />
                </Pressable>
              ) : null}

              {warning
                ? Alert.alert('Warning', i18n.t('GALLERY.WARNING'), [
                    {
                      text: 'Cancel',
                      onPress: () => {
                        console.log('Cancel Pressed');
                        setWarning(false);
                      },
                      style: 'cancel',
                    },
                    {
                      text: 'OK',
                      onPress: () => {
                        saveDeletePhoto();
                        console.log('OK Pressed');
                      },
                    },
                  ])
                : null}
            </View>
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
                if (!like) {
                  saveLike();
                } else {
                  saveUnlike();
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
            <Text onPress={() => setShowComments(!showComments)}>
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
                  marginBottom: 20,
                }}
              >
                <TextInput
                  style={{
                    height: 50,
                    marginVertical: 15,
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
                    if (comment) {
                      saveComment();
                      setShowComments(true);
                    }
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
                    {i18n.t('GALLERY.COMMENT')}
                  </Text>
                </Pressable>
              </View>
            ) : null}
            {showComments ? photo.comments : null}
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
          <ActivityIndicator
            style={{
              height: windowHeight,
            }}
            size="large"
            color={Colors.primaryColor}
          />
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
