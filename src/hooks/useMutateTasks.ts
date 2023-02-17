import axios, { AxiosError } from 'axios';
import { useAppDispatch } from '../app/hooks';
import { useQueryClient, useMutation } from 'react-query';
import { resetEditedTask, toggleCsrfState } from '../slices/appSlice';
import { Task, Error } from '../types/types';
import { useNavigate } from 'react-router-dom';

export const useMutateTask = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation(
    (task: Omit<Task, 'id'>) =>
    axios.post<Task>(`${process.env.REACT_APP_API_URL!}/todo`, task, {
        withCredentials: true,
      }),
    {
      onSuccess: (res) => {
        const previousTodos = queryClient.getQueryData<Task[]>('tasks');
        if (previousTodos) {
          queryClient.setQueryData('tasks', [...previousTodos, res.data]);
        }
        dispatch(resetEditedTask());
      },
      onError: (err: AxiosError<Error>) => {
        if (err.response) {
          alert(`${err.response.data.detail}\n${err.message}`);
          if (
            err.response.data.detail === 'The JWT has expired' ||
            err.response.data.detail === 'The CSRF token has expired.'
          ) {
            dispatch(toggleCsrfState());
            dispatch(resetEditedTask());
            navigate('/');
          }
        } else {
          alert('axios error but no response');
        }
      },
    }
  );

  const updateTaskMutation = useMutation(
    (task: Task) =>
      axios.put<Task>(
        `${process.env.REACT_APP_API_URL!}/todo/${task.id}`,
        {
          title: task.title,
          description: task.description,
        },
        {
          withCredentials: true,
        }
      ),
    {
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>('tasks');
        if (previousTodos) {
          queryClient.setQueryData(
            'tasks',
            previousTodos.map((task) => (task.id === variables.id ? res.data : task))
          );
        }
        dispatch(resetEditedTask());
      },
      onError: (err: AxiosError<Error>) => {
        if (err.response) {
          alert(`${err.response.data.detail}\n${err.message}`);
          if (
            err.response.data.detail === 'The JWT has expired' ||
            err.response.data.detail === 'The CSRF token has expired.'
          ) {
            dispatch(toggleCsrfState());
            dispatch(resetEditedTask());
            navigate('/');
          }
        } else {
          alert('axios error but no response');
        }
      },
    }
  );

  const deleteTaskMutation = useMutation(
    (id: string) =>
      axios.delete<Task>(`${process.env.REACT_APP_API_URL!}/todo/${id}`, {
        withCredentials: true,
      }),
    {
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>('tasks');
        if (previousTodos) {
          queryClient.setQueryData(
            'tasks',
            previousTodos.filter((task) => task.id !== variables)
          );
        }
        dispatch(resetEditedTask());
      },
      onError: (err: AxiosError<Error>) => {
        if (err.response) {
          alert(`${err.response.data.detail}\n${err.message}`);
          if (
            err.response.data.detail === 'The JWT has expired' ||
            err.response.data.detail === 'The CSRF token has expired.'
          ) {
            dispatch(toggleCsrfState());
            dispatch(resetEditedTask());
            navigate('/');
          }
        } else {
          alert('axios error but no response');
        }
      },
    }
  );
  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  };
};
