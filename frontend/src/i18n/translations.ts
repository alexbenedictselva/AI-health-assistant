import { translateText } from '../services/translationService';

export const useTranslation = () => {
  const language = localStorage.getItem('language') || 'en';

  const t = async (text: string): Promise<string> => {
    if (language === 'en') return text;
    return await translateText(text, language);
  };

  return { t, language };
};
