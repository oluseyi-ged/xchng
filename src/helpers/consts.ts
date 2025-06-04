export const IDLE_LOGOUT_TIME_LIMIT = 1 * 60 * 1000;
export const INACTIVITY_CHECK_INTERVAL_MS = 1000;

export function extractSelect(data, keyProperty, valueProperty) {
  return data?.map(item => ({
    key: item[keyProperty]?.toString(),
    value: item[valueProperty],
  }));
}

export function getObjectById(array, id) {
  return array.find(item => item.id === id);
}
export const urlRegex =
  /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;

export const transactionHistory = [
  {
    id: 'txn_1K9W2dLk5EaT3vXy',
    type: 'deposit',
    amount: 1500.75,
    currency: 'USD',
    date: '2023-05-21T09:30:45Z',
    status: 'completed',
    details: {
      from: 'Bank Account ****4567',
      to: 'Wallet USD',
    },
  },
  {
    id: 'txn_8F3Q9mNp7RbS2tUv',
    type: 'withdrawal',
    amount: 500.0,
    currency: 'EUR',
    date: '2023-05-21T14:22:10Z',
    status: 'pending',
    details: {
      from: 'Wallet EUR',
      to: 'Bank Account ****8910',
    },
  },
  {
    id: 'txn_4G7H1jKk3Ll9oPqR',
    type: 'swap',
    amount: 0.05,
    currency: 'BTC',
    date: '2023-05-17T11:05:33Z',
    status: 'completed',
    details: {
      from: '0.05 BTC',
      to: '1850.50 USDT',
      exchangeRate: '37010.00',
    },
  },
  {
    id: 'txn_6Y2T8uVv5Wx1zAa',
    type: 'deposit',
    amount: 200.0,
    currency: 'GBP',
    date: '2023-05-18T16:45:21Z',
    status: 'failed',
    details: {
      from: 'Credit Card ****3456',
      to: 'Wallet GBP',
      failureReason: 'Insufficient funds',
    },
  },
  {
    id: 'txn_9Z4X5cBb3Nn7MmKk',
    type: 'withdrawal',
    amount: 1200.0,
    currency: 'USD',
    date: '2023-05-19T08:12:07Z',
    status: 'completed',
    details: {
      from: 'Wallet USD',
      to: 'PayPal account',
    },
  },
];

export const currencies = [
  {
    id: 1,
    name: 'usd',
  },
  {
    id: 2,
    name: 'ngn',
  },
  {
    id: 3,
    name: 'gbp',
  },
];

export const dateFilters = [
  {
    id: 1,
    name: 'Custom',
  },
  {
    id: 2,
    name: 'This Week',
  },
  {
    id: 3,
    name: 'This Month',
  },
  {
    id: 4,
    name: 'Last Month',
  },
  {
    id: 5,
    name: 'This Year',
  },
];

export const allCurrencies = [
  {
    currency: 'Euros',
    abbreviation: 'EUR',
  },
  {
    currency: 'United States Dollar',
    abbreviation: 'USD',
  },
  {
    currency: 'Nigerian Naira',
    abbreviation: 'NGN',
  },
];

export const OTP_TIMEOUT = 67;

export const purposeOfAccount = [
  {value: 'charitable_donations', name: 'Charitable Donations'},
  {value: 'ecommerce_retail_payments', name: 'Ecommerce Retail Payments'},
  {value: 'investment_purposes', name: 'Investment Purposes'},
  {value: 'operating_a_company', name: 'Operating a Company'},
  {
    value: 'payments_to_friends_or_family_abroad',
    name: 'Payments to Friends or Family Abroad',
  },
  {
    value: 'personal_or_living_expenses',
    name: 'Personal or Living Expenses',
  },
  {value: 'protect_wealth', name: 'Protect Wealth'},
  {
    value: 'purchase_goods_and_services',
    name: 'Purchase Goods and Services',
  },
  {
    value: 'receive_payment_for_freelancing',
    name: 'Receive Payment for Freelancing',
  },
  {value: 'receive_salary', name: 'Receive Salary'},
];

export const incomeRange = [
  {name: '₦20,000 - ₦50,000', value: '₦20,000 - ₦50,000'},
  {name: '₦50,000 - ₦150,000', value: '₦50,000 - ₦150,000'},
  {name: '₦150,000 - ₦500,000', value: '₦150,000 - ₦500,000'},
  {name: '₦500,000 and above', value: '₦500,000 and above'},
];

export const sourceOfIncome = [
  {value: 'company_funds', name: 'Company Funds'},
  {value: 'ecommerce_reseller', name: 'Ecommerce Reseller'},
  {value: 'gambling_proceeds', name: 'Gambling Proceeds'},
  {value: 'gifts', name: 'Gifts'},
  {value: 'government_benefits', name: 'Government Benefits'},
  {value: 'inheritance', name: 'Inheritance'},
  {value: 'investments_loans', name: 'Investments & Loans'},
  {value: 'pension_retirement', name: 'Pension & Retirement'},
  {value: 'salary', name: 'Salary'},
  {
    value: 'sale_of_assets_real_estate',
    name: 'Sale of Assets & Real Estate',
  },
  {value: 'savings', name: 'Savings'},
  {value: 'someone_elses_funds', name: "Someone Else's Funds"},
];

export const employmentStatus = [
  {name: 'Employed Full-time', value: 'Employed Full-time'},
  {name: 'Employed Part-time', value: 'Employed Part-time'},
  {name: 'Freelancer/Contractor', value: 'Freelancer/Contractor'},
  {name: 'Self-employed', value: 'Self-employed'},
  {
    name: 'Unemployed (actively looking for work)',
    value: 'Unemployed (actively looking for work)',
  },
  {
    name: 'Unemployed (not seeking work)',
    value: 'Unemployed (not seeking work)',
  },
  {name: 'Student', value: 'Student'},
  {name: 'Retired', value: 'Retired'},
  {
    name: 'Stay-at-home Parent/Caregiver',
    value: 'Stay-at-home Parent/Caregiver',
  },
  {name: 'Government Worker', value: 'Government Worker'},
];

export const referralOptions = [
  {name: 'Instagram', value: 'Instagram'},
  {name: 'Facebook', value: 'Facebook'},
  {name: 'Twitter', value: 'Twitter'},
  {name: 'LinkedIn', value: 'LinkedIn'},
  {name: 'WhatsApp', value: 'WhatsApp'},
  {name: 'Friend/Family', value: 'Friend/Family'},
  {name: 'Search Engine', value: 'Search Engine'},
  {name: 'Other', value: 'Other'},
];

export const isEmpty = (value: any): boolean => !value;
