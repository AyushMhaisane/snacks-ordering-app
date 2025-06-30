import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  return (
    <select
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      value={i18n.language}
      className="border p-2 rounded text-sm"
    >
      <option value="en">English</option>
      <option value="mr">मराठी</option>
      <option value="hi">हिंदी</option>
    </select>
  );
};

export default LanguageSelector;
