import React, { createContext, Component,Fragment } from "react";
import i18n from 'i18n-js';
import * as Localization from 'expo-localization';

import { EN } from '../i18n/en';
import { ES } from '../i18n/es';

const I18nContext = createContext();

class I18nProvider extends Component {
    state = {
        lang:String(Localization.locale).split('-')[0],
    }
    componentDidMount(){
        i18n.translations = {
            
            en: EN,
            es: ES,
          };

        i18n.locale = this.state.lang;
        i18n.fallbacks = true;

        i18n.locale = this.state.lang;
    }

   

    render() {
      

        
        
            return(
                <Fragment>

                
                {this.state.lang ?
                <I18nContext.Provider value={{
                    lang:this.state.lang,
                    changeLang: (newLang) => this.setState({lang:newLang})
                }}>
                    {this.props.children}
                </I18nContext.Provider>
                :null}
                </Fragment>
            )
        
      
        
    }


}

export default I18nProvider;
export {I18nContext}
