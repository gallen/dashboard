import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { Handshake as HandshakeIcon } from '@phosphor-icons/react';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { Money as MoneyIcon } from '@phosphor-icons/react/dist/ssr/Money';
import { HouseLine as HouseIcon } from '@phosphor-icons/react';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';

export const navIcons = {
  'chart-pie': ChartPieIcon,
  'handshake': HandshakeIcon,
  'house-line': HouseIcon,
  'x-square': XSquare,
  'money': MoneyIcon,
  user: UserIcon,
  users: UsersIcon,
} as Record<string, Icon>;
