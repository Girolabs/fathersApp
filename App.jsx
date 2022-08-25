import React from 'react';
// import * as Sentry from 'sentry-expo';
// import {
//   useFonts,
//   WorkSans_400Regular,
//   WorkSans_500Medium,
//   WorkSans_600SemiBold,
//   WorkSans_700Bold,
// } from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import PatresNavigator from './src/navigator/PatresNavigator';
import I18nProvider from './src/context/I18nProvider';
import AuthProvider from './src/context/AuthProvider';
import BulletinCheckProvider from './src/context/BulletinCheckProvider';

// Sentry.init({
//   dsn: 'https://9f3fff92f0324708b8ef98da9c96b5e7@o464423.ingest.sentry.io/5473069',
//   enableInExpoDevelopment: true,
//   debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
// });

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
