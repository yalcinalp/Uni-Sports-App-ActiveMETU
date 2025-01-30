import axios from 'axios';
import { useEffect } from 'react';
import { useSession } from 'Utils/auth/ctx';

export const useAxiosConfig = () => {
  const { session } = useSession();

  axios.defaults.baseURL = 'http://localhost:8080/'; // If you are using an USB connected phone with Expo GO app, use this base URL.
  //axios.defaults.baseURL = 'http://10.0.2.2:8080/'; // If you are using emulator, use this.
  //axios.defaults.baseURL = 'http://144.122.71.73:8080/'; // If you are using the server, enter the ip and use this.

  useEffect(() => {
    // Authorization header. As default all API use token authentication, thus you need to send token.

    if (session) {
      axios.defaults.headers.common['Authorization'] = `Token ${session}`;
    }

    axios.defaults.headers.common['Accept'] = 'application/json';
    axios.defaults.headers.common['Content-Type'] = 'application/json';

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (axios.isAxiosError(error) && !error.response) {
          error.response = { data: {} };
          error.response.data.title = 'Network error';
          error.response.data.detail =
            'There was a problem connecting to the server. Please check your internet connection and try again.';
        } else if (error.response && error.response.status === 401) {
          error.response.data.title ??= 'Unauthorized';
          error.response.data.detail ??=
            'Your session has expired or you are not authorized. Please log in again.';
        }
        return Promise.reject(error);
      }
    );
  }, [session]);
};
