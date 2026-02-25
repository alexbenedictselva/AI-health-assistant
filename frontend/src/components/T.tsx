import React, { useState, useEffect } from 'react';
import { translateText } from '../services/translationService';

interface TProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  [key: string]: any;
}

export const T: React.FC<TProps> = ({ children, as: Component = 'span', ...props }) => {
  const [text, setText] = useState(children);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    const syncLanguage = () => setLanguage(localStorage.getItem('language') || 'en');
    window.addEventListener('storage', syncLanguage);
    window.addEventListener('language:changed', syncLanguage as EventListener);
    return () => {
      window.removeEventListener('storage', syncLanguage);
      window.removeEventListener('language:changed', syncLanguage as EventListener);
    };
  }, []);

  useEffect(() => {
    if (language === 'en') {
      setText(children);
      return;
    }

    translateText(children, language).then(setText);
  }, [children, language]);

  return React.createElement(Component, props, text);
};
