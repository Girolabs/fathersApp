import React, { createContext, Component, Fragment } from 'react';
import i18n from 'i18n-js';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { EN } from '../i18n/en';
import { ES } from '../i18n/es';
import { PT } from '../i18n/pt';
import { DE } from '../i18n/de';

const I18nContext = createContext();

class I18nProvider extends Component {
  state = { lang: null };

  async componentDidMount() {
    i18n.translations = { en: EN, es: ES, de: DE, pt: PT };
    i18n.fallbacks = true;

    const storageLang = await AsyncStorage.getItem('lang');
    const defaultLang = String(Localization.locale).split('-')[0];

    const lang = storageLang || defaultLang;
    i18n.locale = lang;

    this.setState({ lang });
    if (!storageLang) {
      await AsyncStorage.setItem('lang', lang);
    }
  }

  async componentDidUpdate(_, prevState) {
    if (prevState.lang !== this.state.lang) {
      i18n.locale = this.state.lang;
    }
  }

  changeLang = async (newLang) => {
    i18n.locale = newLang;
    await AsyncStorage.setItem('lang', newLang);
    this.setState({ lang: newLang });
  };

  render() {
    console.log('[Rendering]: I18nProvider');
    return (
      <Fragment>
        {this.state.lang ? (
          <I18nContext.Provider
            value={{
              lang: this.state.lang,
              changeLang: this.changeLang,
            }}
          >
            {this.props.children}
          </I18nContext.Provider>
        ) : null}
      </Fragment>
    );
  }
}

export default I18nProvider;
export { I18nContext };
