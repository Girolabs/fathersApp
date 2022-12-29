import { View, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import CarouselItem from './CarouselItem';
import styles from '../constants/styles';

const { width } = Dimensions.get('window');
export const CustomSlider = ({ data, navigation }) => {
  const settings = {
    sliderWidth: width,
    sliderHeight: width,
    itemWidth: width - 230,
    data: data,
    renderItem: ({ item }, parallaxProps) => {
      return <CarouselItem item={item} navigation={navigation} parallaxProps={parallaxProps} />;
    },
    hasParallaxImages: true,
  };
  return (
    <View style={styles.container}>
      <Carousel {...settings} firstItem={1} />
    </View>
  );
};
