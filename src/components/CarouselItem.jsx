import React, { useState } from 'react';
import { ParallaxImage } from 'react-native-snap-carousel';
import { View, Text, Pressable, SafeAreaView, Image } from 'react-native';
import styles from '../constants/styles';
import { Modal } from 'react-native';
import { Ionicons } from 'expo-vector-icons';
import Colors from '../constants/Colors';

const CarouselItem = ({ item, index }, parallaxProps) => {
  return (
    <>
      <Pressable
        onPress={() => {
          console.log('press');
        }}
      >
        <SafeAreaView style={styles.item}>
          <ParallaxImage
            source={{ uri: item.source }} /* the source of the image */
            containerStyle={styles.imageContainer}
            style={styles.image}
            {...parallaxProps} /* pass in the necessary props */
          />
          <View
            style={{
              backgroundColor: 'black',
              width: '100%',
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}
          >
            <Text style={styles.title} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </SafeAreaView>
      </Pressable>
    </>
  );
};

export default CarouselItem;
