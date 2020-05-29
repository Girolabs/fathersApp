import React, { createContext, Component, Fragment } from 'react';
import i18n from 'i18n-js';
import * as Localization from 'expo-localization';
import { AsyncStorage } from 'react-native';

import { EN } from '../i18n/en';
import { ES } from '../i18n/es';

const I18nContext = createContext();

class I18nProvider extends Component {
  state = {
    lang: null,
  };
  async componentDidMount() {
    i18n.translations = {
      en: EN,
      es: ES,
    };
    const storageLang = await AsyncStorage.getItem('lang');

    if (storageLang) {
      let transformedStorageLang = storageLang;
      i18n.locale = transformedStorageLang;
      i18n.fallbacks = true;
      this.setState({ lang: transformedStorageLang });
    } else {
      i18n.locale = String(Localization.locale).split('-')[0];
      i18n.fallbacks = true;
      this.setState({ lang: String(Localization.locale).split('-')[0] });
      AsyncStorage.setItem('lang', String(Localization.locale).split('-')[0]);
    }
  }
  componentDidUpdate() {
    console.log('[Provider componentDidUpdate]');
  }

  changeLang = (newLang) => {
    i18n.locale = newLang.lang;
    i18n.fallbacks = true;
    AsyncStorage.setItem('lang', newLang.lang);
    this.setState({ lang: newLang.lang });
  };

  render() {
    return (
      <Fragment>
        {this.state.lang && i18n.translations ? (
          <I18nContext.Provider
            value={{
              lang: this.state.lang,
              changeLang: (newLang) => this.changeLang({ lang: newLang }),
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
