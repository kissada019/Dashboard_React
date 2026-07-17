/* libs */
import moment from 'moment';
import numeral from 'numeral';
import { AES, enc } from 'crypto-js';
import Utf8 from 'crypto-js/enc-utf8';
/* storage */
import userInfoStorage from "../storage/userInfoStorage";
/* utils */
import dateTime from './dateTime';

const checkSession = () => {
    let result = true;
    let userInfo = userInfoStorage.get();
    if (userInfo?.sessionExpired) {
        let nowDate = moment();
        let expiredDate = moment(userInfo?.sessionExpired);
        if (nowDate.isAfter(expiredDate)) {
            result = false;
        }
    }
    return result;
}

const genUniqueId = (length = 15) => {
    return [...Array(length).keys()].map((elem) => Math.random().toString(36).substr(2, 1)).join("");
}

const displayCurrency = (data, initial = '') => {
    let result = initial;
    if (data && data !== 0) {
        result = numeral(data).format('0,0.00');
    }
    return result;
}

const displayPersent = (data, initial = '') => {
    let result = initial;
    if (data && data !== 0) {
        result = numeral(data).format('0,0.00') + "%";
    }
    return result;
}

const displayInt = (data, initial = '') => {
    let result = initial;
    if (data && data !== 0) {
        result = numeral(data).format('0,0');
    }
    return result;
}

const displayDate = (data, format, leng, initial = '') => {
    let result = initial;
    if (data) {
        result = dateTime.changeFormatDisPlayDate(data, format, leng, initial);
    }
    return result;
}

const displayDateCustomFormat = (data, fromFormat, toFormat, leng, initial = '') => {
    let result = initial;
    if (data) {
        result = dateTime.changeFormatDisPlayDateCustomFormat(data, fromFormat, toFormat, leng, initial);
    }
    return result;
}

const requestString = (data, initial = '') => {
    let result = initial;
    if (data) {
        result = data?.toString()?.trim();
    }
    return result;
}

const requestDate = (data, initial = null) => {
    let result = initial;
    if (data && data !== '01/01/0001') {
        // result = moment(data, 'DD/MM/YYYY').format('YYYY-MM-DD');
        result = dateTime.changeFormatDisPlayDate(data, "YYYY-MM-DD");
    }
    return result;
}

const requestDateTime = (data, initial = null) => {
    let result = initial;
    if (data && !data.includes('01/01/0001')) {
        // result = moment(data, 'DD/MM/YYYY').format('YYYY-MM-DD');
        result = dateTime.changeFormatDisPlayDate(data, "");
    }
    return result;
}

const requestInt = (data, initial = null) => {
    let result = initial;
    if (data || data === 0) {
        data = data.toString()?.replace(/,/g, "");
        result = parseInt(data);
    }
    return result;
}

const requestFloat = (data, initial = null) => {
    let result = initial;
    if (data || data === 0) {
        data = data.toString()?.replace(/,/g, "");
        result = parseFloat(parseFloat(data).toFixed(2))
    }
    return result;
}

const encrypt = (plaintext) => {
    const encrypted = window.btoa(encodeURIComponent(plaintext));
    return encrypted;
};

const decrypt = (cipher) => {
    const decrypted = decodeURIComponent(window.atob(cipher));
    return decrypted;
};

const encryptAES = (plaintext) => {
    const passphrase = 'blah';
    const encrypted = AES.encrypt(plaintext, passphrase).toString();
    const wordArray = enc.Base64.parse(encrypted);
    return enc.Hex.stringify(wordArray);
    // return AES.encrypt(plaintext, "Secret Passphrase");
};

const decryptAES = (cipher) => {
    const passphrase = 'blah';
    const wordArray = enc.Hex.parse(cipher);
    const toDecrypt = enc.Base64.stringify(wordArray);
    return AES.decrypt(toDecrypt, passphrase).toString(Utf8);
};

const toInt = (data, initial = null) => {
    let result = initial;
    if (data || data === 0) {
        data = data.toString().replace(/[,]|[%]/g, "");
        result = parseInt(data);
    }
    return result;
}

const toFloat = (data, initial = null, zeroIsEmpty = false) => {
    let result = initial;
    if (data || (zeroIsEmpty === false && data === 0)) {
        data = data.toString().replace(/[,]|[%]/g, "");
        result = parseFloat(data);
    }
    return result;
}

const exportCommon = {
    checkSession: checkSession,
    genUniqueId: genUniqueId,
    displayCurrency: displayCurrency,
    displayPersent: displayPersent,
    displayInt, displayInt,
    displayDate: displayDate,
    displayDateCustomFormat: displayDateCustomFormat,
    requestString: requestString,
    requestDate: requestDate,
    requestDateTime: requestDateTime,
    requestInt: requestInt,
    requestFloat: requestFloat,
    encrypt: encrypt,
    decrypt: decrypt,
    encryptAES: encryptAES,
    decryptAES: decryptAES,
    toInt: toInt,
    toFloat: toFloat,
}

export default exportCommon;