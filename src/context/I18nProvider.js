import React, { createContext, Component, Fragment } from 'react';
import i18n from '../i18n';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const I18nContext = createContext();

class I18nProvider extends Component {
  state = { lang: null, ready: false };

  async componentDidMount() {

    const storageLang = await AsyncStorage.getItem('lang');
    const defaultLang = Localization.getLocales()[0]?.languageCode || 'en';
    const lang = storageLang || defaultLang;

    i18n.locale = lang;
    this.setState({ lang, ready: true });

    if (!storageLang) {
      await AsyncStorage.setItem('lang', lang);
    }
  }

  changeLang = async (newLang) => {
    i18n.locale = newLang;
    await AsyncStorage.setItem('lang', newLang);
    this.setState({ lang: newLang });
  };

  render() {
    if (!this.state.ready) return null; // Espera a que el idioma esté listo
    return (
      <I18nContext.Provider
        value={{
          lang: this.state.lang,
          changeLang: this.changeLang,
        }}
      >
        {this.props.children}
      </I18nContext.Provider>
    );
  }
}

export default I18nProvider;
