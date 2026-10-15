import React from 'react';
import { View, FlatList, Dimensions } from 'react-native';
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
    <View style={[styles.container, { height: ITEM_HEIGHT }]}>
      <FlatList
        horizontal
        data={validData}
        keyExtractor={(item, index) => String(item?.galleryPhotoId ?? index)}
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <View style={{ width: ITEM_WIDTH }}>
            <CarouselItem item={item} navigation={navigation} />
          </View>
        )}
      />
    </View>
  );
};
