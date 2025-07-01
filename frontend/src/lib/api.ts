import axios from 'axios';
import { useAuth } from '@/store/auth';

export const useApi = () => {
  const token = useAuth.getState().token;

  return axios.create({
    baseURL: 'http://localhost:3001/api',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
