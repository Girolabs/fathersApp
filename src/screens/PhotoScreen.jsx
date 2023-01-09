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
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import { useEffect } from 'react';
import heart from '../../assets/heart.png';
import heartActive from '../../assets/heartActive.png';
import comments from '../../assets/message-circle.png';
import * as ScreenOrientation from 'expo-screen-orientation';
import { NavigationEvents } from 'react-navigation';
import { useState, useRef } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import {
  getPersonByUser,
  getPersons,
  getPhoto,
  url,
  likePhoto,
  unlikePhoto,
  commentPhoto,
  deletePhoto,
  deleteComment,
  updateComment,
  updateCaption,
  errorHandler,
} from '../api';
import icon from '../../assets/img/icon_app.png';
import { Ionicons } from 'expo-vector-icons';
import pencil from '../../assets/editpencil.png';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';

const PhotoScreen = ({ navigation }) => {
  const photoID = navigation.getParam('galleryPhotoId');
  const [loading, setLoading] = useState(true);
  const [like, setLike] = useState(false);
  const [totalComments, setTotalComments] = useState([]);
  const [openComment, setOpenComment] = useState(false);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(true);
  const [photo, setPhoto] = useState({});
  //const [user, setUser] = useState({});
  //const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [warning, setWarning] = useState(false);
  const [editComment, setEditComment] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const [caption, setCaption] = useState(null);
  const [editCaption, setEditCaption] = useState(false);

  const loadPhoto = () => {
    setLoading(true);
    getPhoto(photoID).then((res) => {
      setPhoto(res.data.result);
      setLike(res.data.result.hasCurrentUserLiked ? true : false);
      const commentsArray = res.data.result.comments;
      setTotalComments(commentsArray);
      setCaption(res.data.result.caption);
      setLoading(false);
    });
  };

  /*const getEmail = async () => {
    const identity = await AsyncStorage.getItem('email');
    setEmail(identity);
  };*/

  /*const loadPerson = () => {
    if (email !== '') {
      getPersons().then((res) => {
        const data = res.data.result;
        const dataFil = data.filter((f) => f.email === email);
        setUserId(dataFil[0].personId);
      });
      console.log(userId);
    }
  };*/

  /*const loadUser = () => {
    if (userId)
      getPersonByUser(userId).then((res) => {
        setUser({
          fullName: res.data.result.fullName,
          photo: res.data.result.photo,
        });
      });
  };*/

  const saveLike = async () => {
    await likePhoto(photoID).then(
      (res) => {
        setLike(true);
        loadPhoto();
      },
      (err) => {
        errorHandler(err);
      },
    );
  };

  const saveUnlike = async () => {
    await unlikePhoto(photoID).then(
      (res) => {
        setLike(false);
        loadPhoto();
      },
      (err) => {
        errorHandler(err);
      },
    );
  };

  const saveComment = () => {
    const commentValue = {
      comment: comment,
    };
    commentPhoto(photoID, commentValue).then(
      (res) => {
        setComment('');
        loadPhoto();
      },
      (err) => {
        errorHandler(err);
      },
    );
  };

  const saveDeletePhoto = () => {
    deletePhoto(photoID).then(
      (res) => {
        navigation.popToTop();
      },
      (err) => {
        errorHandler(err);
      },
    );
  };

  const saveUpdateCaption = () => {
    const captionValue = {
      caption: caption,
    };
    if (caption) {
      updateCaption(photoID, captionValue).then(
        (res) => {
          loadPhoto();
          setEditCaption(false);
        },
        (err) => {
          errorHandler(err);
        },
      );
    }
  };

  useEffect(() => {
    //getEmail();
    loadPhoto();
    async function orientationBack() {
      // Restric orientation PORTRAIT_UP screen
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
    return () => {
      orientationBack();
    };
  }, []);

  /*useEffect(() => {
    loadUser();
  }, [userId]);*/

  /*useEffect(() => {
    loadPerson();
  }, [email]);*/

  const windowHeight = useWindowDimensions().height;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS == 'android' ? 30 : 100}
      style={{ flex: 1 }}
    >
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
              <ImageZoom
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'black',
                }}
                uri={url + photo.pathThumbnail2048}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 10,
                  left: '90%',
                }}
              >
                {photo.canUserDeletePhoto ? (
                  <Pressable onPress={() => setWarning(true)}>
                    <Ionicons name="md-close-circle" size={28} color="#CD5C5C" />
                  </Pressable>
                ) : null}

                {warning
                  ? Alert.alert(i18n.t('GALLERY.DELETE_PHOTO_TITLE'), i18n.t('GALLERY.DELETE_PHOTO_BODY'), [
                      {
                        text: 'Cancel',
                        onPress: () => {
                          setWarning(false);
                        },
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        onPress: () => {
                          saveDeletePhoto();
                        },
                      },
                    ])
                  : null}
              </View>
            </View>
            {!editCaption ? (
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
                    paddingRight: 30,
                  }}
                >
                  {/*data[0].title*/ photo.caption}
                </Text>
                {photo.canUserUpdatePhoto ? (
                  <Pressable
                    onPress={() => {
                      setEditCaption(true);
                      setOpenComment(false);
                      loadPhoto();
                    }}
                    style={{
                      position: 'absolute',
                      left: '93%',
                      padding: 5,
                    }}
                  >
                    <Image source={pencil} />
                  </Pressable>
                ) : null}
              </View>
            ) : (
              <View
                style={{
                  width: '90%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  zIndex: 10,
                }}
              >
                <TextInput
                  style={{
                    height: 'auto',
                    marginVertical: 15,
                    borderRadius: 5,
                    backgroundColor: '#FFFFFF',
                    padding: 10,
                    paddingRight: '12%',
                    paddingLeft: '12%',
                  }}
                  autoFocus={true}
                  theme={{ colors: { primary: '#0104AC', underlineColor: 'transparent' } }}
                  required
                  value={caption}
                  autoCapitalize="none"
                  placeholderTextColor={Colors.onSurfaceColorSecondary}
                  placeholder="Caption"
                  onChangeText={(value) => setCaption(value)}
                />
                <Pressable
                  onPress={() => {
                    saveUpdateCaption();
                  }}
                  style={{
                    position: 'absolute',
                    top: '29%',
                    left: '90%',
                    padding: 5,
                  }}
                >
                  <Ionicons name="md-send" size={25} color={Colors.primaryColor} />
                </Pressable>
                <Pressable
                  onPress={() => {
                    setEditCaption(false);
                  }}
                  style={{
                    position: 'absolute',
                    top: '35%',
                    left: '3%',
                  }}
                >
                  <Ionicons name="md-arrow-back" size={25} color={Colors.primaryColor} />
                </Pressable>
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 20,
                marginVertical: 5,
                justifyContent: 'flex-start',
                alignItems: 'center',
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
                  source={photo.createdByPersonPhotoPath ? { uri: url + photo.createdByPersonPhotoPath } : icon}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </View>
              <Text
                style={{
                  marginRight: 10,
                  fontFamily: 'work-sans',
                  fontWeight: '700',
                  fontSize: 15,
                }}
              >
                {photo.createdByPersonFullFriendlyName ? photo.createdByPersonFullFriendlyName : 'Guest'}
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
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  if (!like) {
                    saveLike();
                  } else {
                    saveUnlike();
                  }
                }}
              >
                {like ? <Image source={heartActive} /> : <Image source={heart} />}

                <Text
                  style={{
                    marginRight: 130,
                  }}
                >
                  {/*totalLikes + " likes"*/ ' ' + photo.likesCount + ' ' + i18n.t('GALLERY.LIKES')}
                </Text>
              </Pressable>
              <Pressable
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => {
                  setComment('');
                  setOpenComment(!openComment);
                }}
              >
                <Image source={comments} />

                <Text>
                  {/*20 comments*/}
                  {' ' + photo.commentsCount + ' ' + i18n.t('GALLERY.COMMENTS')}
                </Text>
              </Pressable>
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
                    autoFocus={true}
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
                      if (comment && !editComment) {
                        saveComment();
                        setOpenComment(false);
                        setShowComments(true);
                      } else if (comment) {
                        const commentValue = {
                          comment: comment,
                        };
                        updateComment(photo.galleryPhotoId, commentId, commentValue).then(
                          (res) => {
                            loadPhoto();
                            setLoading(false);
                            setOpenComment(false);
                            setEditComment(false);
                          },
                          (err) => {
                            setLoading(false);
                            errorHandler(err);
                          },
                        );
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
              {totalComments.map((c) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: 21,
                    marginVertical: 15,
                    height: 'auto',
                  }}
                  key={c.commentId}
                >
                  {c.canUserDeleteComment ? (
                    <Pressable
                      onPress={() => {
                        Alert.alert(i18n.t('GALLERY.DELETE_COMMENT_TITLE'), i18n.t('GALLERY.DELETE_COMMENT_BODY'), [
                          {
                            text: 'Cancel',
                            onPress: () => {
                              console.log('Cancel Pressed');
                            },
                            style: 'cancel',
                          },
                          {
                            text: 'OK',
                            onPress: () => {
                              setLoading(true);
                              deleteComment(photo.galleryPhotoId, c.commentId).then(
                                (res) => {
                                  loadPhoto();
                                  setLoading(false);
                                },
                                (err) => {
                                  setLoading(false);
                                  errorHandler(err);
                                },
                              );
                              console.log('OK Pressed');
                            },
                          },
                        ]);
                      }}
                      style={{
                        position: 'absolute',
                        left: '95%',
                      }}
                    >
                      <Ionicons name="md-close" size={20} color={Colors.primaryColor} />
                    </Pressable>
                  ) : null}
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
                      source={c.createdByPersonPhotoPath ? { uri: url + c.createdByPersonPhotoPath } : icon}
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
                    {c.createdByPersonFullFriendlyName ? c.createdByPersonFullFriendlyName : 'Guest'}
                  </Text>
                  <Text
                    style={{
                      color: '#292929',
                      fontFamily: 'work-sans',
                      fontWeight: '500',
                      fontSize: 15,
                      width: '45%',
                      height: 'auto',
                    }}
                  >
                    {c.comment}
                  </Text>
                  {c.canUserUpdateComment ? (
                    <Pressable
                      onPress={() => {
                        setOpenComment(true);
                        setEditComment(true);
                        setComment(c.comment);
                        setCommentId(c.commentId);
                      }}
                      style={{
                        position: 'absolute',
                        top: '95%',
                        left: '11.5%',
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.primaryColor,
                          fontFamily: 'work-sans',
                          fontWeight: '500',
                          fontSize: 15,
                        }}
                      >
                        {i18n.t('GALLERY.EDIT')}
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
              ))}
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
    </KeyboardAvoidingView>
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
