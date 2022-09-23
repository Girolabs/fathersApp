import React, { useState } from 'react';
import { ParallaxImage } from 'react-native-snap-carousel';
import { View, Text, Pressable, SafeAreaView, Image, Modal } from 'react-native';
import styles from '../constants/styles';
import { Ionicons } from 'expo-vector-icons';
import Colors from '../constants/Colors';

const CarouselItem = ({ item, index }, parallaxProps) => {
  return (
    <>
      <Pressable
        onPress={() => {
          alert(item.title);
        }}
      >
        <SafeAreaView style={styles.item}>
          <ParallaxImage
            source={{ uri: item.source }} /* the source of the image */
            containerStyle={styles.imageContainer}
            style={styles.image}
            {...parallaxProps} /* pass in the necessary props */
          />
          <Text style={styles.title} numberOfLines={2}>
            {item.description}
          </Text>
        </SafeAreaView>
      </Pressable>
    </>
  );
};

export default CarouselItem;
