import copy from 'copy-to-clipboard';
import { BTC_SATS, BTC_MSAT, SATS_MSAT, Units } from './constants';

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const convertIntoDateFormat = dataValue => {
  let newDate = new Date(dataValue * 1000);
  return (
    newDate.getDate().toString().padStart(2, '0') +
    ' ' +
    MONTH_NAMES[newDate.getMonth()] +
    ', ' +
    newDate.getHours().toString().padStart(2, '0') +
    ':' +
    newDate.getMinutes().toString().padStart(2, '0')
  );
};

export const ConvertSatsToMSats = (num: number) => {
  return num * SATS_MSAT;
};

export const ConvertBTCToSats = (num: number) => {
  return num * BTC_SATS;
};

export const ConvertBTCToMSats = (num: number) => {
  return num * BTC_MSAT;
};

export const ConvertMSatsToSats = (
  num: number,
  numDecimalPlaces: number,
  returnFormat: string = 'string',
) => {
  return returnFormat === 'string'
    ? Number.parseFloat(
        Number.parseFloat((num / SATS_MSAT).toString()).toFixed(numDecimalPlaces),
      ).toLocaleString('en-us')
    : Number.parseFloat((num / SATS_MSAT).toString()).toFixed(numDecimalPlaces);
};

export const ConvertSatsToBTC = (num: number, numDecimalPlaces: number = 5) => {
  return Number.parseFloat((num / BTC_SATS).toString()).toFixed(numDecimalPlaces);
};

export const ConvertMSatsToBTC = (num: number, numDecimalPlaces: number = 5) => {
  return Number.parseFloat((num / BTC_MSAT).toString()).toFixed(numDecimalPlaces);
};

export const formatCurrencyType = (
  num: number,
  shorten: boolean,
  returnFormat: string = 'string',
) => {
  return returnFormat === 'string'
    ? shorten
      ? Math.floor(num / 1000).toLocaleString('en-us') + 'K'
      : parseFloat(num.toString()).toLocaleString('en-us')
    : shorten
      ? Math.floor(num / 1000)
      : parseFloat(num.toString()); // number format
};

export const formatCurrency = (
  num: any,
  fromUnit: Units,
  toUnit: Units = Units.SATS,
  shorten: boolean = false,
  numDecimalPlaces: number = 5,
  returnFormat: string = 'string',
) => {
  if (typeof num === 'undefined') {
    num = 0;
  }
  if (num && typeof num === 'string' && num.includes('msat')) {
    num = num.substring(0, num.length - 4);
  }
  switch (fromUnit) {
    case Units.MSATS:
      return toUnit === Units.BTC
        ? ConvertMSatsToBTC(num, numDecimalPlaces)
        : toUnit === Units.SATS
          ? ConvertMSatsToSats(num, numDecimalPlaces, returnFormat)
          : formatCurrencyType(num, shorten, returnFormat);
    case Units.BTC:
      return toUnit === Units.SATS
        ? ConvertBTCToSats(num)
        : toUnit === Units.MSATS
          ? ConvertBTCToMSats(num)
          : formatCurrencyType(num, shorten, returnFormat);
    default:
      return toUnit === Units.BTC
        ? ConvertSatsToBTC(num, numDecimalPlaces)
        : toUnit === Units.MSATS
          ? ConvertSatsToMSats(num)
          : formatCurrencyType(num, shorten, returnFormat);
  }
};

export const formatFiatValue = (num: number = 0, rate: number = 1, fromUnit: Units) => {
  num = fromUnit === Units.MSATS ? num / BTC_MSAT : fromUnit === Units.SATS ? num / BTC_SATS : num;
  return Number.parseFloat(Number.parseFloat((num * rate).toString()).toFixed(2)).toLocaleString('en-us');
};

export const sortDescByKey = (array, key) => {
  const temp = array.sort((a, b) => {
    const x = +a[key] ? +a[key] : 0;
    const y = +b[key] ? +b[key] : 0;
    return x > y ? -1 : x < y ? 1 : 0;
  });
  return temp;
};

export const titleCase = (str: string | undefined) => {
  return str && typeof str === 'string' ? str[0].toUpperCase() + str.substring(1).toLowerCase() : '';
};

export const copyTextToClipboard = (textToCopy: string | undefined) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(copy(textToCopy || ''));
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @param currentVersion The current version of this app.
 * @param checkVersion The version to check against.
 * @returns Returns whether the current version is equal to or higher than checkVersion.
 */
export const isCompatibleVersion = (currentVersion: string, checkVersion: string) => {
  if (!checkVersion || currentVersion === '') return false;
  if (currentVersion) {
    const versionsArr =
      currentVersion.trim()?.replace('v', '').split(/[rc]+/)[0].split('-')[0].split('.') || [];
    const checkVersionsArr = checkVersion.split('.');
    return (
      +versionsArr[0] > +checkVersionsArr[0] ||
      (+versionsArr[0] === +checkVersionsArr[0] && +versionsArr[1] > +checkVersionsArr[1]) ||
      (!!versionsArr[2]
        ? +versionsArr[0] === +checkVersionsArr[0] &&
          +versionsArr[1] === +checkVersionsArr[1] &&
          +versionsArr[2] >= +checkVersionsArr[2]
        : +versionsArr[0] === +checkVersionsArr[0] && +versionsArr[1] >= +checkVersionsArr[1])
    );
  }
  return false;
};

export const decodeCombinedCerts = (encodedValue) => {
  try {
    const base64Encoded = decodeURIComponent(encodedValue);
    const originalString = atob(base64Encoded);
    const keyMatch = originalString.match(/client_key:((?:.|\n)+?)(?=client_cert:|ca_cert:|$)/);
    const certMatch = originalString.match(/client_cert:((?:.|\n)+?)(?=ca_cert:|$)/);
    const caMatch = originalString.match(/ca_cert:((?:.|\n)+)/);
    return `{\n"clientKey": "\n${keyMatch?.[1]?.trim()?.replace(/\n/g, '\n')}\n",\n"clientCert": "\n${certMatch?.[1]?.trim()?.replace(/\n/g, '\n')}\n",\n"caCert": "\n${caMatch?.[1]?.trim()?.replace(/\n/g, '\n')}\n"\n}`    
  } catch (error) {
    throw error;
  }
};
