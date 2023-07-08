import { useEffect, useState } from 'react';
import { Navigate } from "react-router-dom";
import { IUserDTO } from '../../types';
import { fetchGetAuth } from '../../utils';
import { LocalStorageParams, Pages } from '../../constants';


interface IProps {
  children: JSX.Element;
}

interface IState {
  user: IUserDTO | null;
  loading: boolean;
}

export const ProtectedLayout: React.FunctionComponent<IProps> = ({ children }) => {
  const [data, setData] = useState<IState>({user: null, loading: true});
  
  useEffect(() => {
    const fetchData = async()=> {
      const data = await fetchGetAuth<IUserDTO | null>({
        url:`api/admin0/user/${localStorage.getItem(LocalStorageParams.USERNAME)}`,
        default: null,
        headers: { "Content-Type": "application/json" }
      })
      setData({user: data, loading: false});
    }
    fetchData();
  }, []);

  if (data.loading) {
    return null;
  }

  if (data.user == null) {
    return <Navigate to={Pages.LOGIN} />;
  }
  return children;
};