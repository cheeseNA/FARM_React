import { useQuery } from 'react-query';
import axios, { AxiosError } from 'axios';
import { useAppDispatch } from '../app/hooks';
import { resetEditedTask, toggleCsrfState } from '../slices/appSlice';
import { Task, Error } from '../types/types';
import { useNavigate } from 'react-router-dom';

export const useQuerySingleTask = (id: string) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const getSingleTask = async (id: string) => {
    const { data } = await axios.get<Task>(`${process.env.REACT_APP_API_URL}/todo/${id}`, {
      withCredentials: true,
    });
    return data;
  };
  return useQuery({
    queryKey: ['single', id],
    queryFn: () => getSingleTask(id),
    enabled: !!id,
    staleTime: Infinity,
    onError: (err: AxiosError<Error>) => {
      if (err.response) {
        alert(`${err.response.data.detail}\n${err.message}`);
        if (
          err.response.data.detail == 'The CSRF token has expired.' ||
          err.response.data.detail == 'The JWT has expired'
        ) {
          dispatch(toggleCsrfState());
          dispatch(resetEditedTask());
          navigate('/');
        }
      } else {
        alert('axios error but no response');
      }
    },
  });
};
