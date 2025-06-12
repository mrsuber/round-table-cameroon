import jwt from 'jwt-decode';

export const USER_REFRS = {
  EMAIL: btoa('email'),
  USER: btoa('user'),
  EXPIRES_AT: btoa('expires-at'),
  EXPIRES_IN_SECONDS: btoa('expires-in-seconds'),
  REFRESH_TOKEN: btoa('refresh-token'),
  PASS: btoa('encrypt-pass'),
  JWT: btoa('jwt'),
  TOWN: btoa('town'),
  REGION: btoa('region'),
  ROLE: btoa('role'),
};
export const CHAT_USER = {
  RECEIVER: 'receiver',
  SENDER: 'sender',
};

export const setLocalUser = (value: any) => {
  localStorage.setItem(USER_REFRS.USER, JSON.stringify(value));
};
export const getLocalUser = () => {
  const data = localStorage.getItem(USER_REFRS.USER);
  return data ? JSON.parse(data) : null;
};
export const setLocalEmail = (value: string) => {
  localStorage.setItem(USER_REFRS.EMAIL, btoa(value));
};
export const getLocalEmail = () => {
  const data = localStorage.getItem(USER_REFRS.EMAIL);
  if (data) return atob(data);
  else return null;
};
export const setLocalPass = (value: string) => {
  localStorage.setItem(USER_REFRS.PASS, btoa(value));
};
export const getLocalPass = () => {
  const data = localStorage.getItem(USER_REFRS.PASS);
  if (data) return atob(data);
  else return null;
};
export const setLocalReceiver = (value: string) => {
  localStorage.setItem(CHAT_USER.RECEIVER, value);
};
export const getLocalReceiver = () => {
  return localStorage.getItem(CHAT_USER.RECEIVER) ?? null;
};
export const setLocalSender = (value: string) => {
  localStorage.setItem(CHAT_USER.SENDER, value);
};
export const getLocalSender = () => {
  return localStorage.getItem(CHAT_USER.SENDER) ?? null;
};
export const clearLocalUser = async () => {
  localStorage.removeItem(USER_REFRS.USER);
  localStorage.removeItem(USER_REFRS.REFRESH_TOKEN);
  localStorage.removeItem(USER_REFRS.JWT);
  localStorage.removeItem(USER_REFRS.PASS);
  localStorage.removeItem(USER_REFRS.EMAIL);
  localStorage.removeItem(CHAT_USER.RECEIVER);
  localStorage.removeItem(CHAT_USER.SENDER);
};

export const setRefreshToken = (value: string) => {
  localStorage.setItem(USER_REFRS.REFRESH_TOKEN, value);
};
export const getRefreshToken = () => {
  const data = localStorage.getItem(USER_REFRS.REFRESH_TOKEN);
  return data;
};

export const setJWT = (jwtStr: string) => {
  localStorage.setItem(USER_REFRS.JWT, jwtStr);
};

export const getJWT = () => localStorage.getItem(USER_REFRS.JWT);

export const isTokenExpired = () => {
  const userToken = getJWT();
  try {
    if (userToken === undefined || null) {
      return true;
    } else if (userToken) {
      const decoded: any = jwt(userToken);
      console.log(decoded.exp < Date.now());
      return decoded.exp < Date.now();
    } else {
      return true;
    }
  } catch (error) {
    console.log('error', error);
    if (error) return true;
  }
};

export const setLocalTown = (value: string) => {
  localStorage.setItem(USER_REFRS.TOWN, btoa(value));
};
export const getLocalTown = () => {
  const data: any = localStorage.getItem(USER_REFRS.TOWN);
  return atob(data) ?? null;
};
export const setLocalRegion = (value: string) => {
  localStorage.setItem(USER_REFRS.REGION, btoa(value));
};
export const getLocalRegion = () => {
  const data: any = localStorage.getItem(USER_REFRS.REGION);
  return atob(data) ?? null;
};
export const setLocalRole = (value: string) => {
  localStorage.setItem(USER_REFRS.ROLE, btoa(value));
};
export const getLocalRole = () => {
  const data: any = localStorage.getItem(USER_REFRS.ROLE);
  return atob(data) ?? null;
};
