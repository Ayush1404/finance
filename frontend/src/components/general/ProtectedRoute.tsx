import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import userAtom from '../../store/userAtom';

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [user,setUser] = useRecoilState(userAtom)

  const getUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUser((prev) => ({ ...prev, ...response.data.data }));
      } else {
        navigate('/signin');
      }
    } catch (error) {
      console.log(error)
      navigate('/signin');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!!user.id) {
    return <div>{children}</div>;
  } else {
    return <Navigate to='/signin' />;
  }
};

export default ProtectedRoute;
