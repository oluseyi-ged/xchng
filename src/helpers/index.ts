/* eslint-disable @typescript-eslint/no-unused-vars */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {hideToast, showToast} from '@slices/toast';
import {WalletModel} from '@utils/models';
import {Dimensions, PixelRatio} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import store, {persistor} from 'store';
import {locationDials} from './countriesList';

export * from './consts';
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const SCREEN_WEIGHT = Dimensions.get('window').width;
export const THOUSANDS_DELIMITER = new RegExp(/\B(?=(\d{3})+(?!\d))/, 'g');
export const MAX_AMOUNT_LENGTH_CURRENCY_SECTION = 13;

export function RF(size: number) {
  let factor = PixelRatio.get();
  if (factor >= 2 && factor < 3) {
    // iphone 5s and older Androids
    if (SCREEN_WEIGHT < 360) {
      return size * 0.95;
    }
    // iphone 5
    if (SCREEN_HEIGHT < 667) {
      return size;
      // iphone 6-6s
    }
    if (SCREEN_HEIGHT >= 667 && SCREEN_HEIGHT <= 735) {
      return size * 1.15;
    }
    // older phablets
    return size * 1.25;
  }
  if (factor >= 3 && factor < 3.5) {
    // catch Android font scaling on small machines
    // where pixel ratio / font scale ratio => 3:3
    if (SCREEN_WEIGHT <= 360) {
      return size;
    }
    // Catch other weird android width sizings
    if (SCREEN_HEIGHT < 667) {
      return size * 1.15;
      // catch in-between size Androids and scale font up
      // a tad but not too much
    }
    if (SCREEN_HEIGHT >= 667 && SCREEN_HEIGHT <= 735) {
      return size * 1.2;
    }
    // catch larger devices
    // ie iphone 6s plus / 7 plus / mi note 等等
    return size * 1.27;
  }
  if (factor >= 3.5) {
    // catch Android font scaling on small machines
    // where pixel ratio / font scale ratio => 3:3
    if (SCREEN_WEIGHT <= 360) {
      return size;
      // Catch other smaller android height sizings
    }
    if (SCREEN_HEIGHT < 667) {
      return size * 1.2;
      // catch in-between size Androids and scale font up
      // a tad but not too much
    }
    if (SCREEN_HEIGHT >= 667 && SCREEN_HEIGHT <= 735) {
      return size * 1.25;
    }
    // catch larger phablet devices
    return size * 1.4;
  }
  return size;
}

export const getWidthPercentage = (
  value: number,
  creativeWidth = SCREEN_WEIGHT,
) => (value / creativeWidth) * 100;

export const getHeightPercentage = (
  value: number,
  creativeHeight = SCREEN_WEIGHT,
) => (value / creativeHeight) * 100;

export function HDP(size: number) {
  return PixelRatio.roundToNearestPixel(size);
}

export function MH(height: number) {
  return (height / 100) * SCREEN_HEIGHT;
}

export function WP(size: number) {
  return widthPercentageToDP(size);
}

export function HP(size: number) {
  return heightPercentageToDP(size);
}

// new
export const RW = (value: number) => {
  return widthPercentageToDP(getWidthPercentage(value));
};

export const RH = (value: number) => {
  return heightPercentageToDP(getHeightPercentage(value));
};

export const getWithoutFormattedAmount = (amount: string | number) => {
  if (typeof amount === 'number') {
    return amount?.toString();
  }
  return amount?.replace(/,/g, '');
};

export function trimNumber(number: any) {
  return number?.replace(/(\..*)\./g, '$1').replace(/[^\d.]/g, '');
}

const formatCurrency = (amount: any) => {
  if (typeof amount !== 'undefined') {
    const decimalIndex = amount.indexOf('.');
    if (decimalIndex === -1) {
      return amount.replace(THOUSANDS_DELIMITER, ',');
    } else {
      const integerPart = amount.substring(0, decimalIndex);
      const decimalPart = amount.substring(decimalIndex + 1, decimalIndex + 3);
      const formattedIntegerPart = integerPart.replace(
        THOUSANDS_DELIMITER,
        ',',
      );
      return `${formattedIntegerPart}.${decimalPart}`;
    }
  }
  return 0;
};

export const formatAmountInCurrency = (amountIn: string | number) => {
  const onlyNumber = getWithoutFormattedAmount(amountIn);
  const formattedAmount = formatCurrency(onlyNumber);
  return formattedAmount;
};

export const maskEmail = (email: string): string => {
  if (!email) return '';

  const [localPart, domain] = email.split('@');

  const visibleLocalPart =
    localPart.length > 3 ? localPart.slice(0, 3) + '*****' : localPart;

  return `${visibleLocalPart}@${domain}`;
};

export const clearPersistedState = async () => {
  try {
    await persistor.flush();
    await persistor.purge();

    await AsyncStorage.clear();

    return true;
  } catch (error) {
    console.error('Error clearing persisted state:', error);
    return false;
  }
};

export const extractErrors = (e: any): string[] => {
  try {
    const errors: string[] = [];

    if (!e || typeof e !== 'object') {
      return ['An unknown error occurred'];
    }

    if (Array.isArray(e?.data?.errors) && e.data.errors.length > 0) {
      errors.push(
        ...e.data.errors
          .filter(
            (err: {message: string}) =>
              err &&
              typeof err.message === 'string' &&
              err.message.trim()?.toLocaleLowerCase() !==
                'bad request exception',
          )
          .map((err: {message: string}) => err.message.trim()),
      );
    }

    // Handle single error message
    if (
      typeof e?.data?.message === 'string' &&
      e.data.message.trim() &&
      e.data.message.trim()?.toLocaleLowerCase() !== 'bad request exception'
    ) {
      errors.push(e.data.message.trim());
    }

    return errors.length > 0 ? errors : ['An unknown error occurred'];
  } catch (error) {
    return ['An unknown error occurred'];
  }
};

export const passwordRules: {id: string; name: string; body: string}[] = [
  {
    id: '0',
    name: 'min 8 chars',
    body: '8 characters',
  },
  {
    id: '1',
    name: 'a number',
    body: 'A number',
  },
  {
    id: '2',
    name: 'special char',
    body: 'A special character',
  },
  {
    id: '3',
    name: 'uppercase',
    body: 'An uppercase letter',
  },
  {
    id: '4',
    name: 'lowercase',
    body: 'A lowercase letter',
  },
];

export const checkPassword = (name: string, password: string) => {
  switch (name) {
    case 'lowercase':
      return password.match(/[a-z]/);
    case 'uppercase':
      return password.match(/[A-Z]/);
    case 'special char':
      return password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/);
    case 'a number':
      return password.match(/\d/);
    case 'min 8 chars':
      return password.length >= 8;
    default:
      return false;
  }
};

export const maskPhoneNumber = (phone: string): string => {
  if (!phone) return '';

  // Remove all non-digit characters except leading +
  const cleanedPhone = phone.startsWith('+')
    ? '+' + phone.slice(1).replace(/\D/g, '')
    : phone.replace(/\D/g, '');

  let countryCode = '';
  let restOfNumber = '';

  if (cleanedPhone.startsWith('+')) {
    const match = cleanedPhone.match(/^(\+\d{1,4})(\d{6,})$/);
    if (!match) return phone;
    [, countryCode, restOfNumber] = match;
  } else if (cleanedPhone.startsWith('234')) {
    // Nigerian number without +
    countryCode = '+234';
    restOfNumber = cleanedPhone.slice(3);
  } else if (cleanedPhone.startsWith('0')) {
    // Local number, drop leading 0
    restOfNumber = cleanedPhone.slice(1);
  } else if (cleanedPhone.length > 10) {
    // Assume first 1-4 digits are country code
    const match = cleanedPhone.match(/^(\d{1,4})(\d{6,})$/);
    if (!match) return phone;
    [, countryCode, restOfNumber] = match;
    countryCode = '+' + countryCode;
  } else {
    restOfNumber = cleanedPhone;
  }

  if (restOfNumber.length <= 4) return phone; // too short to mask

  const maskedSection = restOfNumber
    .slice(0, -4)
    .replace(/\d/g, '*')
    .replace(/(.{3})/g, '$1 '); // group every 3 for readability

  const last4Digits = restOfNumber.slice(-4);

  return `${countryCode} ${maskedSection.trim()} ${last4Digits}`.trim();
};

export const triggerToast = (message, type = 'success', title = '') => {
  store.dispatch(showToast({message, type, title}));
};

export const closeToast = (message, type = 'success') => {
  store.dispatch(hideToast());
};

export function removeDialCode(phoneNumber) {
  const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
  for (const location of locationDials) {
    const cleanDialCode = location.dial_code.replace('+', '');
    if (cleanPhoneNumber.startsWith(cleanDialCode)) {
      return cleanPhoneNumber.slice(cleanDialCode.length);
    }
  }
  return cleanPhoneNumber;
}

export const shortenFilename = (
  filename: string,
  maxLength: number = 15,
): string => {
  const lastDotIndex = filename.lastIndexOf('.');

  if (lastDotIndex === -1) return filename; // No extension

  const name = filename.substring(0, lastDotIndex);
  const ext = filename.substring(lastDotIndex);

  const shortName =
    name.length > maxLength ? name.substring(0, maxLength) : name;

  return shortName + ext;
};

export const formatDocPath = (
  data: {email: string; firstName?: string; lastName?: string},
  suffix: string,
) => {
  const NEXT_PUBLIC_APP_STAGE = __DEV__ ? 'dev' : 'prod';

  const date = new Date().toISOString().split('T')[0];

  return `${NEXT_PUBLIC_APP_STAGE}/Customer/kyc/${data.email}/${date}/${suffix}`;
};

const isWalletModel = (wallet: any): wallet is WalletModel => {
  return wallet && typeof wallet.currencyCode === 'string';
};

export const reorderWallets = (wallets: unknown): WalletModel[] => {
  const priority: Record<string, number> = {NGN: 1, USD: 2, GBP: 3};

  if (!Array.isArray(wallets)) {
    return [];
  }

  const sortedWallets = [...wallets].filter(isWalletModel).sort((a, b) => {
    const priorityA = priority[a.currencyCode] ?? 99;
    const priorityB = priority[b.currencyCode] ?? 99;
    return priorityA - priorityB;
  });

  return sortedWallets;
};

export const formatterUSD = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
