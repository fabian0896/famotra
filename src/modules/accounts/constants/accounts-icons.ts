import {
  BanknoteIcon,
  CircleDollarSignIcon,
  CreditCardIcon,
  LandmarkIcon,
  PiggyBankIcon,
  WalletIcon,
} from 'lucide-react';

export const ACOUNTS_ICONS = {
  'credit-card': {
    id: 'credit-card',
    Icon: CreditCardIcon,
  },
  landmark: {
    id: 'landmark',
    Icon: LandmarkIcon,
  },
  banknote: {
    id: 'banknote',
    Icon: BanknoteIcon,
  },
  'piggy-bank': {
    id: 'piggy-bank',
    Icon: PiggyBankIcon,
  },
  'circle-dollar-sign': {
    id: 'circle-dollar-sign',
    Icon: CircleDollarSignIcon,
  },
  wallet: {
    id: 'wallet',
    Icon: WalletIcon,
  },
} as const;
