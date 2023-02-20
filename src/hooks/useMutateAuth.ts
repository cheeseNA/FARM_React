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
      await axios.post(`${process.env.REACT_APP_API_URL}/login`, user, {
        withCredentials: true,
      }),
    {
      onSuccess: () => {
        navigate('/todo');
      },
      onError: (err: AxiosError<Error>) => {
        if (err.response) {
          alert(`${err.response.data.detail}\n${err.message}`);
          if (err.response.data.detail == 'The CSRF token has expired.') {
            dispatch(toggleCsrfState());
          }
        } else {
          alert('axios error but no response');
        }
      },
    }
  );

  const registerMutation = useMutation(
    async (user: User) => await axios.post(`${process.env.REACT_APP_API_URL}/register`, user),
    {
      onError: (err: AxiosError<Error>) => {
        if (err.response) {
          alert(`${err.response.data.detail}\n${err.message}`);
          if (err.response.data.detail == 'The CSRF token has expired.') {
            dispatch(toggleCsrfState());
          }
        } else {
          alert('axios error but no response');
        }
      },
    }
  );

  const logoutMutation = useMutation(
    async () =>
      await axios.post(
        `${process.env.REACT_APP_API_URL}/logout`,
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
        if (err.response) {
          alert(`${err.response.data.detail}\n${err.message}`);
          if (err.response.data.detail == 'The CSRF token has expired.') {
            dispatch(resetEditedTask());
            dispatch(toggleCsrfState());
          }
        } else {
          alert('axios error but no response');
        }
      },
    }
  );
  return { loginMutation, registerMutation, logoutMutation };
};
