import { View, Text, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
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

const PhotoScreen = () => {
  const [like, setLike] = useState(false);
  const [totalLikes, setTotalLikes] = useState(245);
  useEffect(() => {
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
            source={{ uri: data[0].source }}
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
            {data[0].title}
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
            {totalLikes} likes
          </Text>
          <Pressable onPress={() => alert('DEJAR COMENTARIO')}>
            <Image
              source={comments}
              style={{
                width: 25,
                height: 25,
              }}
            />
          </Pressable>
          <Text>20 comments</Text>
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
              Comentario
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
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
              Comentario
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
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
              Comentario
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
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
              Comentario
            </Text>
          </View>
        </View>
      </View>
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
