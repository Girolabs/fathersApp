import { View, Text, ScrollView, Image } from 'react-native';
import React from 'react';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import PhotoScreen from './PhotoScreen';
import data from '../data/data';
import like from '../../assets/heart-white.png';
import comments from '../../assets/message-circle-white.png';
import search from '../../assets/search.png';
import { Pressable } from 'react-native';

const PhotosScreen = ({ navigation }) => {
  return (
    <ScrollView>
      <View
        style={{
          backgroundColor: '#F2F3FF',
          width: '100%',
          height: '100%',
          alignItems: 'center',
          marginTop: 10,
        }}
      >
        <Pressable
          onPress={() => navigation.navigate('Photo', { photoGalleryId: 3 })}
          style={{
            width: '90%',
            height: 444,
            backgroundColor: 'red',
            borderRadius: 10,
            overflow: 'hidden',
            marginVertical: 10,
          }}
        >
          <Image
            resizeMode="cover"
            source={{ uri: data[0].source }}
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
              style={{
                fontSize: 15,
                fontFamily: 'work-sans',
                fontWeight: '400',
                color: '#fff',
                paddingLeft: 17,
              }}
            >
              {data[0].title}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'absolute',
              top: 402,
            }}
          >
            <Text
              style={{
                color: '#fff',
                marginHorizontal: 17,
              }}
            >
              <Image source={like} /> {'  '}245 likes
            </Text>

            <Text
              style={{
                color: '#fff',
                marginHorizontal: 17,
              }}
            >
              <Image source={comments} />
              {'  '}20 comments
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('Photo', { photoGalleryId: 1 })}
          style={{
            width: '90%',
            height: 444,
            backgroundColor: 'red',
            borderRadius: 10,
            overflow: 'hidden',
            marginVertical: 10,
          }}
        >
          <Image
            resizeMode="cover"
            source={{ uri: data[2].source }}
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
              style={{
                fontSize: 15,
                fontFamily: 'work-sans',
                fontWeight: '400',
                color: '#fff',
                paddingLeft: 17,
              }}
            >
              {data[2].title}
            </Text>
          </View>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'absolute',
              top: 402,
            }}
          >
            <Text
              style={{
                color: '#fff',
                marginHorizontal: 17,
              }}
            >
              <Image source={like} /> {'  '}245 likes
            </Text>

            <Text
              style={{
                color: '#fff',
                marginHorizontal: 17,
              }}
            >
              <Image source={comments} />
              {'  '}20 comments
            </Text>
          </View>
        </Pressable>
      </View>
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
