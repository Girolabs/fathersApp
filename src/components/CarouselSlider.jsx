import React from 'react';
import { View, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import CarouselItem from './CarouselItem';
import styles from '../constants/styles';

const { width } = Dimensions.get('window');

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
        sliderWidth={width}
        itemWidth={width - 230}
        renderItem={({ item, index }) => (
          <CarouselItem key={item?.galleryPhotoId ?? index} item={item} navigation={navigation} />
        )}
        inactiveSlideOpacity={0.8}
        firstItem={0}
      />
    </View>
  );
};
