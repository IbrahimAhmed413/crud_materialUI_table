// src/utils/cookieManager.js
import Cookies from 'js-cookie';

export const saveToCookies = (key, data) => {
    Cookies.set(key, JSON.stringify(data), { expires: 7 });
};

export const getFromCookies = (key) => {
    const data = Cookies.get(key);
    return data ? JSON.parse(data) : null;
};

export const clearCookies = (key) => {
    Cookies.remove(key);
};
