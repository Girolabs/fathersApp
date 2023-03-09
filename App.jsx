import React, { useRef } from 'react';

import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import PatresNavigator from './src/navigator/PatresNavigator';
import I18nProvider from './src/context/I18nProvider';
import AuthProvider from './src/context/AuthProvider';
import BulletinCheckProvider from './src/context/BulletinCheckProvider';
import { NavigationActions } from 'react-navigation';
import { addResponseInterceptor } from './src/api';

export default function App() {
  const navigation = useRef();

  const [fontsLoaded] = useFonts({
    'work-sans': require('./assets/fonts/WorkSans-Regular.ttf'),
    'work-sans-medium': require('./assets/fonts/WorkSans-Medium.ttf'),
    'work-sans-semibold': require('./assets/fonts/WorkSans-SemiBold.ttf'),
    'work-sans-bold': require('./assets/fonts/WorkSans-Bold.ttf'),
  });

  const responseInterceptor = async (response) => {
    console.log('ejecutando interceptor');
    if (response.status == 401) {
      //logout
      try {
        await AsyncStorage.removeItem('token');
        navigation.current.dispatch(NavigationActions.navigate({ routeName: 'Auth' }));
      } catch (e) {
        console.error(e);
      }
      return response;
    }
    return response;
  };

  addResponseInterceptor(responseInterceptor);

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <AuthProvider>
      <I18nProvider>
        <BulletinCheckProvider>
          <PatresNavigator ref={(nav) => (navigation.current = nav)} />
        </BulletinCheckProvider>
      </I18nProvider>
    </AuthProvider>
  );
}
