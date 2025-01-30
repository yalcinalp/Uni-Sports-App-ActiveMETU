import { useEffect, useCallback, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';

function useAsyncState(initialValue) {
  return useReducer(
    (state, action) => [action.isLoading, action.value],
    [true, initialValue]
  );
}

export async function setStorageItemAsync(key, value) {
  if (value == null) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

export function useStorageState(key) {
  // Public
  const [state, setState] = useAsyncState();

  // Get
  useEffect(() => {
    SecureStore.getItemAsync(key).then((value) => {
      setState({ isLoading: false, value: value });
    });
  }, [key]);

  // Set
  const setValue = useCallback(
    (value) => {
      setState({ isLoading: false, value: value });
      setStorageItemAsync(key, value);
    },
    [key]
  );

  return [state, setValue];
}
