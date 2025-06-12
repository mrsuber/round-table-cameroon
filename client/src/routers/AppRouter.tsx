import { Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { protectedRoute, routes } from './routes';
import Loader from '../pages/loader/Loader';
import { useAppDispatch, useAppSelector } from '../store';
import ProtectedRoute from './ProtectedRoute';
import jwt from 'jwt-decode';
import { getJWT, getRefreshToken, isTokenExpired } from '../utils/localStorage';
import { refreshTokenAction } from '../store/features/slices/auth/auth.action';
import { getProfileAction } from '../store/features/slices/members/members.action';

const AppRouter = () => {
  const effectRef = useRef(false);
  const { user } = useAppSelector((state) => state.auth);
  const jwt: any = getJWT();
  const userToken = jwt || user?.accessToken;
  const refreshToken = getRefreshToken() || user?.refreshToken;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!effectRef.current) {
      if (isTokenExpired()) {
        dispatch(refreshTokenAction(refreshToken));
      }
      if (userToken) {
        dispatch(getProfileAction(userToken));
      }
    }
    effectRef.current = true;
  }, []);

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            {routes.map((route) => {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    route.protection === protectedRoute.ADMIN ? (
                      <ProtectedRoute userToken={userToken} isMember={user?.user?.isMember}>
                        <route.component />
                      </ProtectedRoute>
                    ) : (
                      <route.component />
                    )
                  }
                />
              );
            })}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default AppRouter;
