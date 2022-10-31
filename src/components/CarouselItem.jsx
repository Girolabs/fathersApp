import React, { useState } from 'react';
import { ParallaxImage } from 'react-native-snap-carousel';
import { View, Text, Pressable, SafeAreaView, Image, Modal } from 'react-native';
import styles from '../constants/styles';
import { Ionicons } from 'expo-vector-icons';
import Colors from '../constants/Colors';
import { url } from '../api';
import { Alert } from 'react-native';
import i18n from 'i18n-js';

const CarouselItem = ({ item, index }, parallaxProps) => {
  return (
    <>
      <Pressable
        onPress={() => {
          Alert.alert(i18n.t('GALLERY.CAPTION'), item.caption);
        }}
      >
        <SafeAreaView style={styles.item}>
          <ParallaxImage
            source={{ uri: url + item.url }} /* the source of the image */
            containerStyle={styles.imageContainer}
            style={styles.image}
            {...parallaxProps} /* pass in the necessary props */
          />
          <Text style={styles.title} numberOfLines={2}>
            {item.caption}
          </Text>
        </SafeAreaView>
      </Pressable>
    </>
  );
};

export default CarouselItem;
