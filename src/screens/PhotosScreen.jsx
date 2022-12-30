import { View, Text, ScrollView, Image, ActivityIndicator, Pressable, useWindowDimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import like from '../../assets/heart-white.png';
import comments from '../../assets/message-circle-white.png';
import search from '../../assets/search.png';
import heartActive from '../../assets/heartActive.png';
import icon from '../../assets/img/icon_app.png';
import { Ionicons } from 'expo-vector-icons';
import { errorHandler, getPhotos, url, likePhoto, unlikePhoto } from '../api';

const PhotosScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [changeLike, setChangelike] = useState(false);
  const loadPhotos = () => {
    setLoading(true);
    getPhotos(limit, offset).then(
      (res) => {
        setPhotos([...photos, ...res.data.result]);
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        errorHandler(err);
      },
    );
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [limit, offset]);

  const loadMore = () => {
    setOffset(offset + limit);
  };

  useEffect(() => {
    if (offset === 0) {
      getPhotos(limit, offset).then(
        (res) => {
          setPhotos(res.data.result);
        },
        (err) => {
          errorHandler(err);
        },
      );
    } else {
      getPhotos().then(
        (res) => {
          setPhotos(res.data.result);
        },
        (err) => {
          errorHandler(err);
        },
      );
    }
  }, [changeLike]);

  const windowHeight = useWindowDimensions().height;

  return (
    <ScrollView>
      {true && (
        <View
          style={{
            backgroundColor: '#F2F3FF',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          {!loading ? (
            <Pressable
              onPress={() => navigation.navigate('Gallery')}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              <Ionicons name="md-add" size={30} color={Colors.primaryColor} fontWeight="700" />
              <Text
                style={{
                  fontFamily: 'work-sans-semibold',
                  fontWeight: '700',
                  fontSize: 18,
                  color: '#0104AC',
                  marginLeft: 10,
                }}
              >
                {i18n.t('GALLERY.NEW')}
              </Text>
            </Pressable>
          ) : null}

          {photos.map((p) => {
            return (
              <Pressable
                key={p.galleryPhotoId}
                onPress={() => navigation.navigate('Photo', { galleryPhotoId: p.galleryPhotoId })}
                style={{
                  width: '90%',
                  height: 444,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  overflow: 'hidden',
                  marginVertical: 10,
                }}
              >
                <Image
                  resizeMode="stretch"
                  source={{ uri: url + p.pathThumbnail2048 }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
                <Image
                  resizeMode="cover"
                  style={{
                    position: 'absolute',
                    left: '90%',
                    top: 17,
                    width: 20,
                    height: 20,
                  }}
                  source={search}
                />
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    position: 'absolute',
                    top: '76.5%',
                  }}
                >
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={{
                      fontSize: 15,
                      fontFamily: 'work-sans',
                      fontWeight: '400',
                      color: '#fff',
                      marginLeft: 17,
                      marginRight: 17,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      padding: 1,
                      borderRadius: 3,
                    }}
                  >
                    {p.caption}
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    position: 'absolute',
                    top: '82.5%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    paddingVertical: 5,
                    paddingHorizontal: 17,
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
                      source={p.createdByPersonPhotoPath ? { uri: url + p.createdByPersonPhotoPath } : icon}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                    />
                  </View>
                  <Text
                    style={{
                      color: '#fff',
                    }}
                  >
                    {p.createdByPersonFullFriendlyName}
                  </Text>
                </View>

                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'absolute',
                    top: 405,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    paddingVertical: 5,
                    paddingHorizontal: 17,
                  }}
                >
                  <Pressable
                    style={{
                      flexDirection: 'row',
                    }}
                    onPress={() => {
                      !p.hasCurrentUserLiked
                        ? likePhoto(p.galleryPhotoId).then(
                            (res) => {
                              setChangelike((ant) => !ant);
                            },
                            (err) => {
                              errorHandler(err);
                            },
                          )
                        : unlikePhoto(p.galleryPhotoId).then(
                            (res) => {
                              setChangelike((ant) => !ant);
                            },
                            (err) => {
                              errorHandler(err);
                            },
                          );
                    }}
                  >
                    {p.hasCurrentUserLiked ? <Image source={heartActive} /> : <Image source={like} />}
                    <Text
                      style={{
                        //position: 'absolute',
                        //left: '13%',
                        color: '#fff',
                        //marginHorizontal: 17,
                      }}
                    >
                      {'  ' + p.likesCount + ' ' + i18n.t('GALLERY.LIKES')}
                    </Text>
                  </Pressable>
                  <Image
                    source={comments}
                    style={{
                      position: 'absolute',
                      left: '63%',
                    }}
                  />
                  <Text
                    style={{
                      position: 'absolute',
                      left: '70%',
                      color: '#fff',
                      //marginHorizontal: 17,
                    }}
                  >
                    {'  ' + p.commentsCount + ' ' + i18n.t('GALLERY.COMMENTS')}
                  </Text>
                </View>
              </Pressable>
            );
          })}
          {!loading && offset <= photos.length ? (
            <Pressable
              onPress={loadMore}
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 28,
                marginBottom: 25,
              }}
            >
              <Text
                style={{
                  fontFamily: 'work-sans-semibold',
                  fontWeight: '600',
                  fontSize: 15,
                  color: '#0104AC',
                  marginRight: 20,
                }}
              >
                {i18n.t('GALLERY.SEE_MORE')}
              </Text>
            </Pressable>
          ) : (
            <View
              style={{
                flex: 1,
                padding: 15,
                backgroundColor: Colors.surfaceColorPrimary,
                justifyContent: 'center',
              }}
            >
              {offset <= photos.length ? <ActivityIndicator size="large" color={Colors.primaryColor} /> : null}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

PhotosScreen.navigationOptions = (navigationData) => ({
  headerTitle: i18n.t('GALLERY.PHOTOS'),
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

export default PhotosScreen;
