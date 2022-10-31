import { Dimensions, StyleSheet, Platform } from 'react-native';
import Colors from './Colors';

const { width: screenWidth } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    //paddingTop: 30,
  },
  title: {
    position: 'absolute',
    top: '77%',
    left: '8.75%',
    right: '12.5%',
    bottom: '7.51%',
    fontSize: 15,
    color: 'white',
    padding: 5,
    height: 'auto',
    fontFamily: 'work-sans',
    fontWeight: '400',
    fontSize: 12,
    alignItems: 'flex-end',
    width: '80%',
    height: 40,
  },
  item: {
    width: 160,
    //height: screenWidth - 20, //height will be 20 units less than screen width.
    height: 213,
  },
  imageContainer: {
    flex: 1,
    borderRadius: 15,
    //borderBottomLeftRadius: 0,
    //borderBottomRightRadius: 0,
    //backgroundColor: Colors.onSurfaceColorPrimary,
    marginBottom: Platform.select({ ios: 0, android: 1 }), //handle rendering bug.
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    //resizeMode: 'contain',
  },
  dotContainer: {
    backgroundColor: 'rgb(230,0,0)',
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'black',
  },
  inactiveDotStyle: {
    backgroundColor: 'rgb(255,230,230)',
  },
});
export default styles;
