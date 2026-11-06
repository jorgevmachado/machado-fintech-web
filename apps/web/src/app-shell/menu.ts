import type { TMenuItem } from '@fintech/ui';

export const menu: Array<TMenuItem> = [
  {
    href: '/home',
    icon: 'home',
    label: 'navigation.home',
  },
  {
    href: '/credit-card',
    icon: 'credit-card',
    label: 'navigation.card',
  },
  {
    href: '/account',
    icon: 'user',
    label: 'navigation.account',
  },
  {
    href: '/payer',
    icon: 'user-tie',
    label: 'navigation.payer',
  },
  {
    href: '/payment',
    icon: 'money',
    label: 'navigation.payment',
  },
  {
    href: '/beneficiary',
    icon: 'hand-holding',
    label: 'navigation.beneficiary',
  },
  {
    href: '/category',
    icon: 'category',
    label: 'navigation.category',
  },
  {
    href: '/institution',
    icon: 'landmark',
    label: 'navigation.institution.title',
    disabled: true,
    children: [
      {
        href: '/institution/source',
        icon: 'sign-out',
        label: 'navigation.institution.source',
      },
      {
        href: '/institution/destination',
        icon: 'sign-in',
        label: 'navigation.institution.destination',
      },
    ],
  },
];
