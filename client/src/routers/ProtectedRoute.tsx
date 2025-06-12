import { Navigate } from 'react-router-dom';

interface IProps {
  children: React.ReactNode | React.ReactNode[];
  userToken: string;
  isMember: boolean
}

const ProtectedRoute = ({ userToken, isMember, children }: IProps) => {
  
  if (!userToken || !isMember) {
    return <Navigate to='/' replace />;
  }
  return <div>{children}</div>;
};
export default ProtectedRoute;
