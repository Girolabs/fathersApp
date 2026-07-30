import React from 'react';
import { View, Text, Pressable, SafeAreaView, Image } from 'react-native';
import styles from '../constants/styles';
import { Ionicons } from 'expo-vector-icons';
import Colors from '../constants/Colors';
import { url } from '../api';
import i18n from 'i18n-js';

const CarouselItem = ({ item, navigation }) => {
  if (!item || !item.pathThumbnail800) {
    // Evita crash si el item no es válido o está vacío
    return null;
  }

  const imageUri = `${url}${item.pathThumbnail800}`;
  const caption = item.caption || '';

  return (
    <Pressable
      onPress={() => {
        if (item.galleryPhotoId) {
          navigation.navigate('Photo', { galleryPhotoId: item.galleryPhotoId });
        }
      }}
    >
      <SafeAreaView style={styles.item}>
        <Image source={{ uri: imageUri }} style={[styles.imageContainer, styles.image]} />
        {!!caption && (
          <Text style={styles.title} numberOfLines={2}>
            {caption}
          </Text>
        )}
      </SafeAreaView>
    </Pressable>
  );
};

export default CarouselItem;
