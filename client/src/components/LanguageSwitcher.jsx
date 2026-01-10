import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language;

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-gray-600" />
      <select
        value={currentLanguage}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-transparent border-none text-gray-600 text-sm cursor-pointer focus:outline-none"
      >
        <option value="en">EN</option>
        <option value="pt-BR">PT</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
