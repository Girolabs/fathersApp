import React from 'react';

import { useFonts } from '@use-expo/font';
import { AppLoading } from 'expo';
import PatresNavigator from './src/navigator/PatresNavigator';
import I18nProvider from './src/context/I18nProvider';
import AuthProvider from './src/context/AuthProvider';
import BulletinCheckProvider from './src/context/BulletinCheckProvider';

export default function App() {
  const [fontsLoaded] = useFonts({
    'work-sans': require('./assets/fonts/WorkSans-Regular.ttf'),
    'work-sans-medium': require('./assets/fonts/WorkSans-Medium.ttf'),
    'work-sans-semibold': require('./assets/fonts/WorkSans-SemiBold.ttf'),
    'work-sans-bold': require('./assets/fonts/WorkSans-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <AuthProvider>
      <I18nProvider>
        <BulletinCheckProvider>
          <PatresNavigator />
        </BulletinCheckProvider>
      </I18nProvider>
    </AuthProvider>
  );
}
