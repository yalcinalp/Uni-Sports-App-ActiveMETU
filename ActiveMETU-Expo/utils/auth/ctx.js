import { useContext, createContext } from 'react';
import { useStorageState } from './useStorageState.js';
import axios from 'axios';
import { Alert } from 'react-native';

const AuthContext = createContext({
  logIn: () => Boolean,
  logOut: () => null,
  session: null,
  isLoading: false,
  isLoggedIn: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider({ children }) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        login: async (credentials) => {
          try {
            const response = await axios.post(
              'accounts/login/',
              {},
              {
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: `Basic ${credentials}`,
                },
              }
            );
            console.log('Login Response:', response?.data);

            const { token } = response.data;
            //console.log('Token:', token);
            setSession(token);

            return true;
          } catch (error) {
            Alert.alert('Error', error.response.data.detail);

            return false;
          }
        },

        logout: async () => {
          // Token is already not present(idk how). Return.
          if (!session) {
            return true;
          }

          try {
            const response = await axios.post('accounts/logout/');
            if (response.status === 200) {
              setSession(null);
              return true;
            }
            return false;
          } catch (error) {
            if (error.response?.data.title === 'Unauthorized') {
              // The app has a token, but the backend db doesn't have it.
              // Thus, the app shouldn't be logged in already?
              setSession(null);
              return true;
            }
            return false;
          }
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
