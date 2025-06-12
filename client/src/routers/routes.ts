import { lazy } from 'react';
import { RouteType } from '../types';
import { paths } from './paths';

export enum protectedRoute {
  ADMIN = 'ADMIN',
}

export const routes: RouteType[] = [
  {
    path: paths.HOME,
    component: lazy(async () => await import('../pages/home/Home')),
  },
  {
    path: paths.AUTH,
    component: lazy(async () => await import('../pages/auth/login/Login')),
  },
  {
    path: paths.FORGOTPASSWORD,
    component: lazy(async () => await import('../pages/auth/forgotpassword/ForgotPassword')),
  },
  {
    path: paths.RESETPASSWORD,
    component: lazy(async () => await import('../pages/auth/reset-password/ResetPassword')),
  },
  {
    path: paths.VERIFICATION,
    component: lazy(async () => await import('../pages/auth/verification/Verification')),
  },
  {
    path: paths.MEMBERS,
    component: lazy(async () => await import('../pages/members/Members')),
  },
  {
    path: paths.DONATIONS,
    component: lazy(async () => await import('../pages/donations/Donations.page')),
  },
  {
    path: paths.PROJECTS,
    component: lazy(async () => await import('../pages/projects/Projects')),
  },
  {
    path: paths.PROJECT_DETAILS,
    component: lazy(async () => await import('../pages/project-details/ProjectDetails')),
  },
  {
    path: paths.NOTFOUND,
    component: lazy(async () => await import('../pages/error/404')),
  },
  {
    path: paths.ADMIN.DASHBOARD,
    component: lazy(async () => await import('../pages/admin/dashboard/Dashboard.page')),
    protection: protectedRoute.ADMIN,
  },
  {
    path: paths.ADMIN.PROJECTS,
    component: lazy(async () => await import('../pages/admin/projects/Projects.page')),
    protection: protectedRoute.ADMIN,
  },
  {
    path: paths.ADMIN.ADDPROJECT,
    component: lazy(async () => await import('../pages/admin/add-project/AddProject.page')),
    protection: protectedRoute.ADMIN,
  },
  {
    path: paths.ADMIN.PROJECTDETAILS,
    component: lazy(async () => await import('../pages/admin/project-details/ProjectDetails.page')),
    protection: protectedRoute.ADMIN,
  },
  {
    path: paths.ADMIN.EDITPROJECT,
    component: lazy(async () => await import('../pages/admin/edit-project/EditProject.page')),
    protection: protectedRoute.ADMIN,
  },
  {
    path: paths.ADMIN.MEMBERS,
    component: lazy(async () => await import('../pages/admin/members/Members.page')),
    protection: protectedRoute.ADMIN,
  },
  {
    path: paths.ADMIN.MESSAGES,
    component: lazy(async () => await import('../pages/admin/messages/Messages.page')),
    protection: protectedRoute.ADMIN,
  },
  {
    path: paths.ADMIN.DONATIONS,
    component: lazy(async () => await import('../pages/admin/donations/Donations.page')),
    protection: protectedRoute.ADMIN,
  },
  {
    path: paths.ADMIN.TRANSFERS,
    component: lazy(async () => await import('../pages/admin/transfers/Transfers.page')),
    protection: protectedRoute.ADMIN,
  },
  {
    path: paths.ADMIN.SETTINGS.GENERAL,
    component: lazy(async () => await import('../pages/admin/settings/Settings.page')),
    protection: protectedRoute.ADMIN,
  },
  {
    path: paths.ADMIN.SETTINGS.ACCOUNT,
    component: lazy(async () => await import('../pages/admin/account/Account.page')),
    protection: protectedRoute.ADMIN,
  },
  {
    path: paths.ADMIN.SETTINGS.NOTIFICATIONS,
    component: lazy(async () => await import('../pages/admin/notifications/Notifications.page')),
    protection: protectedRoute.ADMIN,
  },
  {
    path: paths.ADMIN.SETTINGS.PROFILE,
    component: lazy(async () => await import('../pages/admin/profile/Profile.page')),
    protection: protectedRoute.ADMIN,
  },
  // whiet-labeling routes 
  {
    path: paths.WHITELABELLING.HOME,
    component: lazy(async () => await import('../pages/labelling/home/Home.page')),
  },
];
