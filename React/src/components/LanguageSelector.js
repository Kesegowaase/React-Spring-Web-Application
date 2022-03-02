import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../api/apiCalls';

const LanguageSelector = (props) => {

    const {i18n} = useTranslation();
    const onChangeLanguage = language => {
        i18n.changeLanguage(language);
        changeLanguage(language);
    }

    return (
        <div className='container'>
            <img src="https://countryflagsapi.com/png/turkey" width="24" height="16" alt="Turkey"
                onClick={() => onChangeLanguage('tr')} style={{ cursor: "pointer" }}></img>
            &nbsp;
            <img src="https://countryflagsapi.com/png/great britain" width="24" height="16" alt="UK"
                onClick={() => onChangeLanguage('en')} style={{ cursor: "pointer" }}></img>
        </div>
    );
};

export default LanguageSelector;