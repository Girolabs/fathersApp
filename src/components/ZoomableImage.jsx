import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
  },
});

const clamp = (value, lowerBound, upperBound) => {
  'worklet';

  return Math.min(Math.max(value, lowerBound), upperBound);
};

function ZoomableImage({
  uri,
  style,
  minScale = 1,
  maxScale = 5,
}) {
  const [loading, setLoading] = useState(true);
  const centerX = useSharedValue(0);
  const centerY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const resetTransform = () => {
    'worklet';

    scale.value = withTiming(1);
    focalX.value = withTiming(0);
    focalY.value = withTiming(0);
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
  };

  const pinch = Gesture.Pinch()
    .onUpdate((event) => {
      const nextScale = clamp(event.scale, minScale, maxScale);
      scale.value = nextScale;
      focalX.value = (centerX.value - event.focalX) * (nextScale - 1);
      focalY.value = (centerY.value - event.focalY) * (nextScale - 1);
    })
    .onFinalize(resetTransform);

  const pan = Gesture.Pan()
    .minPointers(2)
    .maxPointers(2)
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onFinalize(resetTransform);

  const gesture = Gesture.Simultaneous(pinch, pan);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value + focalX.value },
      { translateY: translateY.value + focalY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View
      style={styles.container}
      onLayout={({ nativeEvent: { layout } }) => {
        centerX.value = layout.width / 2;
        centerY.value = layout.height / 2;
      }}
    >
      <GestureDetector gesture={gesture}>
        <AnimatedImage
          source={{ uri }}
          resizeMode="contain"
          style={[styles.image, style, animatedStyle]}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      </GestureDetector>
      {loading ? (
        <ActivityIndicator
          pointerEvents="none"
          size="small"
          color="dimgrey"
          style={styles.loader}
        />
      ) : null}
    </View>
  );
}

ZoomableImage.propTypes = {
  uri: PropTypes.string.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  minScale: PropTypes.number,
  maxScale: PropTypes.number,
};

ZoomableImage.defaultProps = {
  style: {},
  minScale: 1,
  maxScale: 5,
};

export default ZoomableImage;
