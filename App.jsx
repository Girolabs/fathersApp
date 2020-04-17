import React, { useState, useEffect } from 'react';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import { useFonts } from '@use-expo/font';
import { AppLoading } from 'expo';
import PatresNavigator from './src/navigator/PatresNavigator';

export default function App() {
    const [fontsLoaded] = useFonts({
        'work-sans': require('./assets/fonts/WorkSans-Regular.ttf'),
        'work-sans-medium': require('./assets/fonts/WorkSans-Medium.ttf'),
        'work-sans-semibold': require('./assets/fonts/WorkSans-SemiBold.ttf'),
        'work-sans-bold': require('./assets/fonts/WorkSans-Bold.ttf'),
    });

    const [lang, setLang] = useState(Localization.locale);
    i18n.translations = {
        es: { welcome: 'Bienvenido', spanish: 'español', english: 'ingles' },
        en: { welcome: 'Welcome', spanish: 'spanish', english: 'english' },
    };
    useEffect(() => {
        i18n.locale = lang;
    }, [lang]);

    i18n.locale = lang;
    i18n.fallbacks = true;

    if (!fontsLoaded) {
        return <AppLoading />;
    } else {
        return <PatresNavigator />;
    }
}
