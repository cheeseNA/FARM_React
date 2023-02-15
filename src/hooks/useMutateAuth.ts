import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useAppDispatch } from '../app/hooks';
import { resetEditedTask, toggleCsrfState } from '../slices/appSlice';
import { User, Error } from '../types/types';

export const useMutateAuth = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const loginMutation = useMutation(
    async (user: User) =>
      await axios.post(`${process.env.REACT_APP_API_URL!}/login`, user, {
        withCredentials: true,
      }),
    {
      onSuccess: () => {
        navigate('/todo');
      },
      onError: (err: AxiosError<Error>) => {
        if (err.response === undefined || err.response.data === undefined) {
          alert('undefined error');
          return;
        }
        alert(`${err.response.data.detail}\n${err.message}`);
        if (err.response.data.detail == 'The CSRF token has expired.') {
          dispatch(toggleCsrfState());
        }
      },
    }
  );

  const registerMutation = useMutation(
    async (user: User) => await axios.post(`${process.env.REACT_APP_API_URL!}/register`, user),
    {
      onError: (err: AxiosError<Error>) => {
        if (err.response === undefined || err.response.data === undefined) {
          alert('undefined error');
          return;
        }
        alert(`${err.response.data.detail}\n${err.message}`);
        if (err.response.data.detail == 'The CSRF token has expired.') {
          dispatch(toggleCsrfState());
        }
      },
    }
  );

  const logoutMutation = useMutation(
    async () =>
      await axios.post(
        `${process.env.REACT_APP_API_URL!}/register`,
        {},
        {
          withCredentials: true,
        }
      ),
    {
      onSuccess: () => {
        navigate('/');
      },
      onError: (err: AxiosError<Error>) => {
        if (err.response === undefined || err.response.data === undefined) {
          alert('undefined error');
          return;
        }
        alert(`${err.response.data.detail}\n${err.message}`);
        if (err.response.data.detail == 'The CSRF token has expired.') {
          dispatch(resetEditedTask());
          dispatch(toggleCsrfState());
        }
      },
    }
  );
  return { loginMutation, registerMutation, logoutMutation };
};
