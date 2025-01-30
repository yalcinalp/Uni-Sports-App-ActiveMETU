import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import en from 'Translations/en.json';
import tr from 'Translations/tr.json';

const i18n = new I18n({
  en,
  tr,
});

i18n.defaultLocale = 'en';
i18n.locale = getLocales()[0].languageCode;
i18n.enableFallback = true;
export default i18n;
