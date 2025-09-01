import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import PatresNavigator from './src/navigator/PatresNavigator';
import I18nProvider from './src/context/I18nProvider';
import AuthProvider from './src/context/AuthProvider';
import BulletinCheckProvider from './src/context/BulletinCheckProvider';
import { useNavigationContainerRef } from '@react-navigation/native';
import { addResponseInterceptor } from './src/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [fontsLoaded] = useFonts({
    'work-sans': require('./assets/fonts/WorkSans-Regular.ttf'),
    'work-sans-medium': require('./assets/fonts/WorkSans-Medium.ttf'),
    'work-sans-semibold': require('./assets/fonts/WorkSans-SemiBold.ttf'),
    'work-sans-bold': require('./assets/fonts/WorkSans-Bold.ttf'),
  });

  const navigationRef = useNavigationContainerRef();

  const responseInterceptor = async (response) => {
    console.log('ejecutando interceptor');
    if (response.status === 401) {
      // Logout
      try {
        await AsyncStorage.removeItem('token');
        if (navigationRef.isReady()) {
          navigationRef.navigate('Auth');
        }
      } catch (e) {
        console.error(e);
      }
      return response;
    }
    return response;
  };

  addResponseInterceptor(responseInterceptor);

  if (!fontsLoaded) {
    // reemplazo de AppLoading
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <I18nProvider>
        <BulletinCheckProvider>
          <NavigationContainer ref={navigationRef}>
            <PatresNavigator />
          </NavigationContainer>
        </BulletinCheckProvider>
      </I18nProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
