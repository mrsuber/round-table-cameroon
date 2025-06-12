import { paths } from '../../routers/paths'
import {
  BookIcon,
  DashboardIcon,
  MembersIcon,
  MessagesIcon,
  NotificationIcon,
  SettingsIcon,
} from '../svg'

export const sidebar = [
  {
    id: 0,
    title: 'Dashboard',
    icon: DashboardIcon,
    path: paths.ADMIN.DASHBOARD,
  },
  {
    id: 1,
    title: 'Projects',
    icon: BookIcon,
    path: paths.ADMIN.PROJECTS,
  },
  {
    id: 2,
    title: 'Members',
    icon: MembersIcon,
    path: paths.ADMIN.MEMBERS,
  },
  {
    id: 3,
    title: 'Messages',
    icon: MessagesIcon,
    path: paths.ADMIN.MESSAGES,
  },
  {
    id: 4,
    title: 'Donations',
    icon: MessagesIcon,
    path: paths.ADMIN.DONATIONS,
  },
  {
    id: 5,
    title: 'Transfers',
    icon: MessagesIcon,
    path: paths.ADMIN.TRANSFERS,
  },
  {
    id: 6,
    title: 'Settings',
    icon: SettingsIcon,
    path: paths.ADMIN.SETTINGS.GENERAL,
  },
]

export const settingsSidebar = [
  {
    id: 0,
    title: 'General',
    path: paths.ADMIN.SETTINGS.GENERAL,
    icon: DashboardIcon,
  },
  {
    id: 1,
    title: 'Account',
    path: paths.ADMIN.SETTINGS.ACCOUNT,
    icon: SettingsIcon,
  },
  {
    id: 2,
    title: 'Notifications',
    path: paths.ADMIN.SETTINGS.NOTIFICATIONS,
    icon: NotificationIcon,
  },
  {
    id: 3,
    title: 'Profile',
    path: paths.ADMIN.SETTINGS.PROFILE,
    icon: MembersIcon,
  },
]
