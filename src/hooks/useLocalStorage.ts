import { useState } from 'react';

/**
 *  custom hook to leverage local storage :
 *  useState in localStorage version
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // upon call, check if previous stored value exists for key
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  /**
   * setter for local storage state
   * @param value : either a value or callback; (like standard way to use state)
   * if value is a function : execute the callback on stored value to get new value
   * else: just use the passed value
   */
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
