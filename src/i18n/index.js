import { createI18n } from 'vue-i18n';
import en from './en.json';
import es from './es.json';
import zh from './zh.json';
import pt from './pt.json';
import fr from './fr.json';
import ar from './ar.json';
const locale = window.navigator.language ? window.navigator.language.substring(0, 2) : ' en ';
const i18n = createI18n({
  locale,
  fallbackLocale: 'en',
  messages: {
    en,
    es,
    zh,
    pt,
    fr,
    ar,
  },
});
export default i18n;
