import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import { EN } from './src/i18n/en';
import { ES } from './src/i18n/es';
import { PT } from './src/i18n/pt';
import { DE } from './src/i18n/de';

import PatresNavigator from './src/navigator/PatresNavigator';
import I18nProvider from './src/context/I18nProvider';
import AuthProvider from './src/context/AuthProvider';
import BulletinCheckProvider from './src/context/BulletinCheckProvider';
import { addResponseInterceptor } from './src/api';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const [fontsLoaded] = useFonts({
    'work-sans': require('./assets/fonts/WorkSans-Regular.ttf'),
    'work-sans-medium': require('./assets/fonts/WorkSans-Medium.ttf'),
    'work-sans-semibold': require('./assets/fonts/WorkSans-SemiBold.ttf'),
    'work-sans-bold': require('./assets/fonts/WorkSans-Bold.ttf'),
  });

  const [langReady, setLangReady] = useState(false);
  const navigationRef = useNavigationContainerRef();

  // Inicializar idioma ANTES de renderizar
  useEffect(() => {
    const initLang = async () => {
      i18n.translations = { en: EN, es: ES, de: DE, pt: PT };
      i18n.fallbacks = true;

      const storageLang = await AsyncStorage.getItem('lang');
      const systemLang = String(Localization.locale).split('-')[0];
      const selectedLang = storageLang || systemLang || 'en';

      i18n.locale = selectedLang;
      if (!storageLang) await AsyncStorage.setItem('lang', selectedLang);

      console.log('[i18n initialized]:', i18n.locale);
      setLangReady(true);
    };

    initLang();
  }, []);

  // Interceptor de respuesta
  const responseInterceptor = async (response) => {
    if (response.status === 401) {
      try {
        await AsyncStorage.removeItem('token');
        if (navigationRef.isReady()) {
          navigationRef.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    return response;
  };

  useEffect(() => {
    addResponseInterceptor(responseInterceptor);
  }, []);

  if (!fontsLoaded || !langReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <I18nProvider>
          <BulletinCheckProvider>
            <NavigationContainer ref={navigationRef}>
              <PatresNavigator />
            </NavigationContainer>
          </BulletinCheckProvider>
        </I18nProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
