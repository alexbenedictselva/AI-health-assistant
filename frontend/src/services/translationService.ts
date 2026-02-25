import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';
const cache: { [key: string]: { [text: string]: string } } = {};

export const translateText = async (text: string, targetLang: string): Promise<string> => {
  if (targetLang === 'en') return text;
  if (cache[targetLang]?.[text]) return cache[targetLang][text];

  try {
    const response = await axios.post(`${API_URL}/translate`, {
      texts: [text],
      target_lang: targetLang
    });
    const translated = response.data.translations[0];
    if (!cache[targetLang]) cache[targetLang] = {};
    cache[targetLang][text] = translated;
    return translated;
  } catch (error) {
    return text;
  }
};

export const translateTexts = async (texts: string[], targetLang: string): Promise<string[]> => {
  if (targetLang === 'en') return texts;

  const toTranslate: string[] = [];
  const indices: number[] = [];
  const result = [...texts];

  texts.forEach((text, i) => {
    if (cache[targetLang]?.[text]) {
      result[i] = cache[targetLang][text];
    } else {
      toTranslate.push(text);
      indices.push(i);
    }
  });

  if (toTranslate.length === 0) return result;

  try {
    const response = await axios.post(`${API_URL}/translate`, {
      texts: toTranslate,
      target_lang: targetLang
    });
    const translations = response.data.translations;
    if (!cache[targetLang]) cache[targetLang] = {};
    translations.forEach((translated: string, i: number) => {
      cache[targetLang][toTranslate[i]] = translated;
      result[indices[i]] = translated;
    });
    return result;
  } catch (error) {
    return texts;
  }
};
