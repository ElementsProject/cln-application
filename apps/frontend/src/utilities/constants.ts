import {
  faDollarSign,
  faYenSign,
  faEuroSign,
  faSterlingSign,
  faIndianRupeeSign,
  faRubleSign,
  faShekelSign,
  faLiraSign,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

export const HOST = process.env.NODE_ENV !== 'production' ? 'localhost' : window.location.hostname;
export const PORT = process.env.NODE_ENV !== 'production' ? 2103 : window.location.port;
export const PROTOCOL = window.location.protocol || 'http:';
export const API_BASE_URL = PROTOCOL + '//' + HOST + ':' + PORT;
export const API_VERSION = '/v1';
export const LOG_LEVEL = process.env.NODE_ENV !== 'production' ? 'info' : 'warn';

export const APP_WAIT_TIME = 15 * 1000; // 15 seconds
export const CLEAR_STATUS_ALERT_DELAY = 10000; // 10 seconds
export const TODAY = Math.floor(Date.now() / 1000);
export const SCROLL_BATCH_SIZE = 20; // For infinite scroll, number of items to load per batch
export const SCROLL_THRESHOLD = 120; // For infinite scroll, distance from bottom to trigger next batch

export const BTC_MSAT = 100000000000;
export const BTC_SATS = 100000000;
export const SATS_MSAT = 1000;

export type LogLevel = 'info' | 'warn' | 'error';

export enum InputType {
  ORIGINAL = 'original',
  LOWERCASE = 'lowercase',
  UPPERCASE = 'uppercase',
}

export enum NumberTypes {
  COMMON = 'COMMON',
  CURRENCY = 'CURRENCY',
}

export enum Units {
  MSATS = 'MSATS',
  SATS = 'SATS',
  BTC = 'BTC',
}

export enum ApplicationModes {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export const CURRENCY_UNITS = ['SATS', 'BTC'];

export const CURRENCY_UNIT_FORMATS = { Sats: '1.0-0', BTC: '1.6-6', OTHER: '1.2-2' };

export const FIAT_CURRENCIES = [
  { currency: 'USD', symbol: faDollarSign },
  { currency: 'AUD', symbol: faDollarSign },
  { currency: 'BRL', symbol: null },
  { currency: 'CAD', symbol: faDollarSign },
  { currency: 'CHF', symbol: null },
  { currency: 'CNY', symbol: faYenSign },
  { currency: 'CZK', symbol: null },
  { currency: 'DKK', symbol: null },
  { currency: 'EUR', symbol: faEuroSign },
  { currency: 'GBP', symbol: faSterlingSign },
  { currency: 'HKD', symbol: faDollarSign },
  { currency: 'IDR', symbol: null },
  { currency: 'ILS', symbol: faShekelSign },
  { currency: 'INR', symbol: faIndianRupeeSign },
  { currency: 'JPY', symbol: faYenSign },
  { currency: 'MXN', symbol: faDollarSign },
  { currency: 'MYR', symbol: null },
  { currency: 'NGN', symbol: null },
  { currency: 'NOK', symbol: null },
  { currency: 'NZD', symbol: faDollarSign },
  { currency: 'PLN', symbol: null },
  { currency: 'RUB', symbol: faRubleSign },
  { currency: 'SEK', symbol: null },
  { currency: 'SGD', symbol: faDollarSign },
  { currency: 'THB', symbol: null },
  { currency: 'TRY', symbol: faLiraSign },
  { currency: 'VND', symbol: null },
  { currency: 'ZAR', symbol: null },
];

export enum ApplicationActions {
  SET_AUTH_STATUS = 'SET_AUTH_STATUS',
  SET_SHOW_MODALS = 'SET_SHOW_MODALS',
  SET_SHOW_TOAST = 'SET_SHOW_TOAST',
  SET_WALLET_CONNECT = 'SET_WALLET_CONNECT',
  SET_CONFIG = 'SET_CONFIG',
  SET_FIAT_CONFIG = 'SET_FIAT_CONFIG',
  SET_FEE_RATE = 'SET_FEE_RATE',
  SET_NODE_INFO = 'SET_NODE_INFO',
  SET_LIST_FUNDS = 'SET_LIST_FUNDS',
  SET_LIST_PEERS = 'SET_LIST_PEERS',
  SET_LIST_CHANNELS = 'SET_LIST_CHANNELS',
  SET_LIST_INVOICES = 'SET_LIST_INVOICES',
  SET_LIST_SEND_PAYS = 'SET_LIST_SEND_PAYS',
  SET_LIST_OFFERS = 'SET_LIST_OFFERS',
  SET_LIST_BITCOIN_TRANSACTIONS = 'SET_LIST_BITCOIN_TRANSACTIONS',
  SET_ACCOUNT_EVENTS = 'SET_ACCOUNT_EVENTS',
  SET_SATS_FLOW = 'SET_SATS_FLOW',
  SET_VOLUME = 'SET_VOLUME',
  CLEAR_CONTEXT = 'CLEAR_CONTEXT',
}

export enum Breakpoints {
  XS = 'XS',
  SM = 'SM',
  MD = 'MD',
  LG = 'LG',
  XL = 'XL',
  XXL = 'XXL',
}

export enum CallStatus {
  NONE = 'NONE',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum FeeRate {
  SLOW = 'Slow',
  NORMAL = 'Normal',
  URGENT = 'Urgent',
}

export const FEE_RATES: FeeRate[] = [FeeRate.SLOW, FeeRate.NORMAL, FeeRate.URGENT];

export enum PaymentType {
  INVOICE = 'Invoice',
  OFFER = 'Offer',
  KEYSEND = 'Keysend',
}

export enum TimeGranularity {
  MINUTELY = 'Minutely',
  HOURLY = 'Hourly',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly'
}

// Utility function to get seconds in a day (more semantic)
const SECONDS_IN_DAY = 86400;

// Pre-calculated durations in seconds
const GRANULARITY_DURATIONS = {
  [TimeGranularity.MINUTELY]: 60,
  [TimeGranularity.HOURLY]: 3600,
  [TimeGranularity.DAILY]: SECONDS_IN_DAY,
  [TimeGranularity.WEEKLY]: SECONDS_IN_DAY * 7,
  [TimeGranularity.YEARLY]: SECONDS_IN_DAY * 365,
};

export const secondsForTimeGranularity = (timeGranularity: TimeGranularity, timestamp: number): number => {
  if (timeGranularity !== TimeGranularity.MONTHLY) {
    return GRANULARITY_DURATIONS[timeGranularity];
  }
  
  // Handle monthly case separately since it varies
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return SECONDS_IN_DAY * daysInMonth;
};

export function getPeriodKey(timeGranularity: TimeGranularity, timestamp: number): string {
  const date = moment.unix(timestamp);
  
  switch (timeGranularity) {
    case TimeGranularity.MINUTELY:
      return date.format('DD MMM, YYYY HH:mm')
    case TimeGranularity.HOURLY:
      return date.format('DD MMM, YYYY HH:00');
    case TimeGranularity.DAILY:
      return date.format('DD MMM, YYYY');
    case TimeGranularity.WEEKLY:
      return date.startOf('isoWeek').format('DD MMM, YYYY');
    case TimeGranularity.MONTHLY:
      return date.format('MMM, YYYY');
    case TimeGranularity.YEARLY:
      return date.format('YYYY');
    default:
      throw new Error(`Unsupported time granularity: ${timeGranularity}`);
  }
};

export function getTimestampFromPeriodKey(timeGranularity: TimeGranularity, periodKey: string): number {
  let format: string;
  let startOfUnit: moment.unitOfTime.StartOf;
  
  switch (timeGranularity) {
    case TimeGranularity.MINUTELY:
      format = 'DD MMM, YYYY HH:mm'
      startOfUnit = 'minute';
      break;
    case TimeGranularity.HOURLY:
      format = 'DD MMM, YYYY HH';
      startOfUnit = 'hour';
      break;
    case TimeGranularity.DAILY:
      format = 'DD MMM, YYYY';
      startOfUnit = 'day';
      break;
    case TimeGranularity.WEEKLY:
      format = 'DD MMM, YYYY';
      startOfUnit = 'isoWeek';
      break;
    case TimeGranularity.MONTHLY:
      format = 'DD MMM, YYYY';
      startOfUnit = 'month';
      break;
    case TimeGranularity.YEARLY:
      format = 'YYYY';
      startOfUnit = 'year';
      break;
    default:
      throw new Error(`Unsupported time granularity: ${timeGranularity}`);
  }
  
  return moment(periodKey, format).startOf(startOfUnit).unix();
};

export const getTimestampWithGranularity = (
  timeGranularity: TimeGranularity,
  dateToConvert: Date,
  limitTo: 'start' | 'end',
): number => {
  const momentDate = moment(dateToConvert).startOf('day');
  const periodKey = getPeriodKey(timeGranularity, momentDate.unix());
  
  if (limitTo === 'start') {
    return getTimestampFromPeriodKey(timeGranularity, periodKey);
  }
  
  // For end limit, get start of next period and subtract 1 second
  const startOfNextPeriod = moment(periodKey, getFormatForGranularity(timeGranularity))
    .add(1, getMomentUnit(timeGranularity))
    .startOf(getMomentUnit(timeGranularity));
  
  return startOfNextPeriod.subtract(1, 'second').unix();
};

export function getFormatForGranularity(granularity: TimeGranularity): string {
  switch (granularity) {
    case TimeGranularity.MINUTELY: return 'DD MMM, YYYY HH:mm'
    case TimeGranularity.HOURLY: return 'DD MMM, YYYY HH';
    case TimeGranularity.DAILY: return 'DD MMM, YYYY';
    case TimeGranularity.WEEKLY: return 'DD MMM, YYYY';
    case TimeGranularity.MONTHLY: return 'MMM, YYYY';
    case TimeGranularity.YEARLY: return 'YYYY';
    default: throw new Error(`Unsupported granularity: ${granularity}`);
  }
};

export function getMomentUnit(granularity: TimeGranularity): moment.unitOfTime.DurationConstructor {
  switch (granularity) {
    case TimeGranularity.MINUTELY: return 'minute'
    case TimeGranularity.HOURLY: return 'hour';
    case TimeGranularity.DAILY: return 'day';
    case TimeGranularity.WEEKLY: return 'week';
    case TimeGranularity.MONTHLY: return 'month';
    case TimeGranularity.YEARLY: return 'year';
    default: throw new Error(`Unsupported granularity: ${granularity}`);
  }
};

export const GRAPH_COLOR_PALETTE = ['#00C6A0', '#F2CF20', '#ED583B'];

const interpolateColor = (color1, color2, factor): string => {
  const c1 = parseInt(color1.slice(1), 16),
        c2 = parseInt(color2.slice(1), 16);
  const r1 = (c1 >> 16) & 255, g1 = (c1 >> 8) & 255, b1 = c1 & 255;
  const r2 = (c2 >> 16) & 255, g2 = (c2 >> 8) & 255, b2 = c2 & 255;
  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));
  return `rgb(${r}, ${g}, ${b})`;
};

export const getBarColors = (numBars: number): string[] => {
  // Till 3 colors, return palette colors
  if (numBars <= 0) return [];
  if (numBars === 1) return [GRAPH_COLOR_PALETTE[1]];
  if (numBars === 2) return [GRAPH_COLOR_PALETTE[0], GRAPH_COLOR_PALETTE[2]];
  if (numBars === 3) return [...GRAPH_COLOR_PALETTE];

  const colors: string[] = [];
  for (let i = 0; i < numBars; i++) {
    const factor = i / (numBars - 1);
    
    if (factor <= 0.5) {
      const segmentFactor = factor * 2;
      colors.push(interpolateColor(
        GRAPH_COLOR_PALETTE[0], 
        GRAPH_COLOR_PALETTE[1], 
        segmentFactor
      ));
    } else {
      const segmentFactor = (factor - 0.5) * 2;
      colors.push(interpolateColor(
        GRAPH_COLOR_PALETTE[1], 
        GRAPH_COLOR_PALETTE[2], 
        segmentFactor
      ));
    }
  }
  
  return colors;
};

export const APP_ANIMATION_DURATION = 2;
export const TRANSITION_DURATION = 0.3;
export const COUNTUP_DURATION = 1.5;
export const ANIMATION_INITIAL_STATE = { opacity: 0, scale: 0.1 };
export const ANIMATION_FINAL_STATE = { opacity: 1, scale: 1 };
export const ANIMATION_TRANSITION = {
  duration: COUNTUP_DURATION,
  delay: 0,
  ease: [0, 0.71, 0.2, 1.01],
};
export const ANIMATION_DELAYED_TRANSITION = {
  duration: COUNTUP_DURATION,
  delay: 0.5,
  ease: [0, 0.71, 0.2, 1.01],
};

export const OPACITY_VARIANTS = { visible: { opacity: 1 }, hidden: { opacity: 0 } };
export const SPRING_VARIANTS = { type: 'spring', stiffness: 400, damping: 25 };
export const BOUNCY_SPRING_VARIANTS_1 = { type: 'spring', stiffness: 600, damping: 20 };
export const BOUNCY_SPRING_VARIANTS_2 = { type: 'spring', stiffness: 700, damping: 10 };
export const BOUNCY_SPRING_VARIANTS_3 = { type: 'spring', stiffness: 400, damping: 8, delay: 0.2 };
export const BOUNCY_SPRING_VARIANTS_4 = { type: 'spring', stiffness: 250, damping: 15 };
export const STAGERRED_SPRING_VARIANTS_1 = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: i => {
    const delay = 0 + i * 0.5;
    return {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay, type: 'spring', duration: COUNTUP_DURATION, bounce: 0 },
        opacity: { delay, duration: 0.02 },
      },
    };
  },
};
export const STAGERRED_SPRING_VARIANTS_2 = {
  hidden: { x: 15 },
  visible: i => {
    const delay = 0 + i * 0.5;
    return {
      x: 0,
      transition: {
        x: { delay, type: 'spring', stiffness: 700, damping: 10 },
      },
    };
  },
};

export const STAGERRED_SPRING_VARIANTS_3 = {
  hidden: { y: -10 },
  visible: i => {
    const delay = 0 + i * 0.5;
    return {
      y: 0,
      transition: {
        y: { delay, type: 'spring', stiffness: 700, damping: 4 },
      },
    };
  },
};

export const STAGERRED_SPRING_VARIANTS_4 = {
  hidden: { opacity: 0 },
  visible: i => {
    const delay = 0 + i * 0.5;
    return {
      opacity: 1,
      transition: {
        opacity: { delay, type: 'spring', stiffness: 500, damping: 3 },
      },
    };
  },
};

export const STAGERRED_COLOR_DRAIN = {
  primary: { fill: '#E1BA2D' },
  dark: i => {
    const delay = 0 + i * 0.5;
    return {
      fill: '#E1BA2D',
      transition: {
        fill: { delay },
      },
    };
  },
};
