import { View, Text, ScrollView, Image, ActivityIndicator, Pressable, useWindowDimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import data from '../data/data';
import like from '../../assets/heart-white.png';
import comments from '../../assets/message-circle-white.png';
import search from '../../assets/search.png';
import { getPhotos, url } from '../api';

const PhotosScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const loadPhotos = () => {
    setLoading(true);
    getPhotos().then(
      (res) => {
        setPhotos(res.data.result);
        setLoading(false);
      },
      (err) => {
        console.log(err);
        setLoading(false);
        alert(err);
      },
    );
    console.log('FOTOS', photos);
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  /*useEffect(() => {
    getPhotos().then(
      (res) => {
        setPhotos(res.data.result);
        setLoading(false);
      },
      (err) => {
        console.log(err);
        alert(err);
      },
    );
  }, [photos]);*/

  const windowHeight = useWindowDimensions().height;

  return (
    <ScrollView>
      {!loading ? (
        <View
          style={{
            backgroundColor: '#F2F3FF',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
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
                  resizeMode="cover"
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
                    top: '85%',
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
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'absolute',
                    top: 405,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    paddingVertical: 5,
                    paddingHorizontal: 17,
                  }}
                >
                  <Image source={like} />
                  <Text
                    style={{
                      position: 'absolute',
                      left: '13%',
                      color: '#fff',
                      //marginHorizontal: 17,
                    }}
                  >
                    {'  ' + p.likesCount + ' ' + i18n.t('GALLERY.LIKES')}
                  </Text>
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
