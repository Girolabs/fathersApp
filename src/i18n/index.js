import { I18n } from '.';

import { EN } from './en';
import { ES } from './es';
import { PT } from './pt';
import { DE } from './de';

const i18n = new I18n({ en: EN, es: ES, de: DE, pt: PT }, { defaultLocale: 'en', enableFallback: true });

export default i18n;
