import { View, Text, Image, StyleSheet, ScrollView, Pressable } from 'react-native';
import React from 'react';
import data from '../data/data';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import i18n from 'i18n-js';
import Colors from '../constants/Colors';
import { useEffect } from 'react';
import like from '../../assets/heart.png';
import comments from '../../assets/message-circle.png';

const PhotoScreen = () => {
  return (
    <ScrollView>
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
          <Pressable onPress={() => alert('LIKE!')}>
            <Image
              source={like}
              style={{
                width: 25,
                height: 25,
              }}
            />
          </Pressable>
          <Text
            style={{
              marginRight: 130,
            }}
          >
            245 likes
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
  headerTitle: 'Photo',
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
