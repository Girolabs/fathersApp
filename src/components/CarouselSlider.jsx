import React from 'react';
import { View, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import CarouselItem from './CarouselItem';
import styles from '../constants/styles';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 230;
const ITEM_HEIGHT = 213;

export const CustomSlider = ({ data = [], navigation }) => {
  // Evita crash si data no es array
  const validData = Array.isArray(data) ? data : [];

  // Si no hay datos, devuelve un contenedor vacío (sin error)
  if (validData.length === 0) {
    return <View style={[styles.container, { minHeight: 150 }]} />;
  }

  return (
    <View style={styles.container}>
      <Carousel
        data={validData}
        width={ITEM_WIDTH}
        height={ITEM_HEIGHT}
        style={{ width }}
        loop={false}
        defaultIndex={0}
        renderItem={({ item, index }) => (
          <CarouselItem key={item?.galleryPhotoId ?? index} item={item} navigation={navigation} />
        )}
      />
    </View>
  );
};
