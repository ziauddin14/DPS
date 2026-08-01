import reportEn from './report.en.js';
import reportUr from './report.ur.js';

const translations = {
  en: reportEn,
  ur: reportUr,
};

/**
 * Get report translation object for the given language.
 * Defaults to English if language is not supported or undefined.
 *
 * @param {string} [lang='en'] - Language code ('en' | 'ur')
 * @returns {Object} Translation dictionary
 */
export function getReportTranslation(lang = 'en') {
  return translations[lang] || translations.en;
}

export { reportEn, reportUr };
