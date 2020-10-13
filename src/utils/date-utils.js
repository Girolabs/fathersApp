const DATE_FORMATS_BY_LANG = {
  es: 'D [de] MMMM [de] YYYY',
  en: 'MMMM D, YYYY',
  pt: 'D [de] MMMM [de] YYYY',
  de: 'D[.] MMMM YYYY',
};

const MONTH_FORMATS_BY_LANG = {
  es: 'D [de] MMMM',
  en: 'MMMM D',
  de: 'D[.] MMMM',
  pt: 'D [de] MMMM',
};

const DATE_MASK_BY_LANG = {
  es: 'DD/MM/YYYY',
  en: 'MM/DD/YYYY',
  de: 'DD.MM.YYYY',
  pt: 'DD/MM/YYYY',
};

const getDateFormatByLocale = (lang) => {
  const format = DATE_FORMATS_BY_LANG[lang];
  return format || DATE_FORMATS_BY_LANG.en;
};

const getMonthFormatByLocale = (lang) => {
  const format = MONTH_FORMATS_BY_LANG[lang];
  return format || MONTH_FORMATS_BY_LANG.en;
};

const getDateMaskByLocale = (lang) => {
  const mask = DATE_MASK_BY_LANG[lang];
  return mask || DATE_MASK_BY_LANG.en;
};

export { getDateFormatByLocale, getMonthFormatByLocale, getDateMaskByLocale };
