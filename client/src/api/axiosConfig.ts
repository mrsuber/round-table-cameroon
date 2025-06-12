import axios from 'axios';
import { getJWT, getRefreshToken, setJWT, setRefreshToken } from '../utils/localStorage';
import { backendUrls } from './urls';
import { endpoint } from './config/index';
import { paths } from '../routers/paths';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: endpoint,
});

axiosInstance.interceptors.request.use(
  (req) => {
    const token = getJWT();
    if (token) {
      req.headers['Authorization'] = 'Bearer ' + token;
    }
    // req.headers['Content-Type'] = 'application/json';
    return req;
  },
  (error) => {
    Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    console.log('inst', error);
    const originalRequest = error.config;
    if (error?.code === 'ERR_NETWORK') {
      toast.error(`${error?.message}, Check internet connection`);
      return;
    } else if (
      error?.response?.status === 401 ||
      (error?.response?.data?.message === '401 Unauthorized' && !originalRequest._retry)
    ) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();
      return axios.post(backendUrls.users.REFRESHTOKEN, { refreshToken }).then((res) => {
        console.log('ref res', res)
        if (res?.status === (201 || 200)) {
          setJWT(res?.data?.tokens?.accessToken);
          setRefreshToken(res?.data?.tokens?.refreshToken);
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + getJWT();
          return axios(originalRequest);
        }
      });
    } else if (error?.response?.status !== 401) {
      return Promise.reject(error?.response?.data);
    } else if (!error?.response) {
      return Promise.reject(error?.message);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
