import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'properties', title: 'Properties', href: paths.dashboard.properties, icon: 'house-line' },
  { key: 'tenants', title: 'Tenants', href: paths.dashboard.tenants, icon: 'users' },
  { key: 'renting', title: 'Renting', href: paths.dashboard.renting, icon: 'handshake'  },
  { key: 'expenses', title: 'Expenses', href: paths.dashboard.expenses, icon: 'money' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
