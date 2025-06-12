export const paths = {
  HOME: '/',
  AUTH: '/auth',
  AUTHSIGNUP: 'auth?tab=signup',
  FORGOTPASSWORD: '/forgot-password',
  RESETPASSWORD: '/reset-password/:token',
  MEMBERS: '/members',
  PROJECTS: '/projects',
  VERIFICATION: '/verification',
  PROJECT_DETAILS: '/projects-details',
  DONATIONS: '/donations',
  NOTFOUND: '*',
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    PROJECTS: '/admin/projects',
    ADDPROJECT: '/admin/add-project',
    PROJECTDETAILS: '/admin/details/:id',
    EDITPROJECT: '/admin/edit/:id',
    MEMBERS: '/admin/dashboard/members',
    MESSAGES: '/admin/messages',
    DONATIONS: '/admin/donations',
    TRANSFERS: '/admin/transfers',
    SETTINGS: {
      GENERAL: '/admin/settings/general',
      ACCOUNT: '/admin/settings/account',
      NOTIFICATIONS: '/admin/settings/notifications',
      PROFILE: '/admin/settings/profile',
    },
  },
  WHITELABELLING: {
    HOME: '/labelling/home',
    CREATE: '/labelling/create',
    ABOUT: '/labelling/about',
    OURPROCESS: '/labelling/our-process',
    COMPANY: '/labelling/company',
    TEAM: '/labelling/team',
    PROJECTS: '/labelling/projects',
    MAGAZINE: '/labelling/magazine',
  },
};
export const navlinks = [
  {
    label: 'Home',
    path: paths.HOME,
  },
  {
    label: 'Projects',
    path: paths.PROJECTS,
  },
  {
    label: 'Members',
    path: paths.MEMBERS,
  },
];
export const labellingNavlinks = [
  {
    id: 0,
    label: 'About',
    path: paths.WHITELABELLING.ABOUT,
  },
  {
    id: 1,
    label: 'Our Process',
    path: paths.WHITELABELLING.OURPROCESS,
  },
  {
    id: 2,
    label: 'Company',
    path: paths.WHITELABELLING.COMPANY,
  },
  {
    id: 3,
    label: 'Team',
    path: paths.WHITELABELLING.TEAM,
  },
  {
    id: 4,
    label: 'Projects',
    path: paths.WHITELABELLING.PROJECTS,
  },
  {
    id: 5,
    label: 'Magazine',
    path: paths.WHITELABELLING.MAGAZINE,
  },
];
