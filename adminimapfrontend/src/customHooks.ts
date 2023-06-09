import { useState, useEffect } from "react";


/**
 * Hook for data fetching.
 * @param url api request.
 * @param initialState initial state.
 * @param isJson response is json (true) or text (false).
 * @returns api response.
 */
export function useFetch<T>(url: string | null, initialState: T, isJson: boolean): T {
  const [result, setResult] = useState(initialState);
  useEffect(() => {
    let ignore = false;
    if (url){
      fetch(url)
      .then(response => isJson ? response.json() : response.text())
      .then(responseResult => {
        if (!ignore) {
          setResult(responseResult);
        }
      })
      .catch(error => console.log(error));
    }   
    return () => {
      ignore = true;
    };
  }, [url]);
  return result;
};

/**
 * Hook to set a delay time until a user stops typing to change state.
 * @param delay delay in milliseconds.
 * @returns useState('') hook with debouncing.
 */
export function useSearchDebounce(delay = 350): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timeoutID = setTimeout(() => setSearch(searchQuery), delay);
    return () => clearTimeout(timeoutID);
  }, [searchQuery, delay]);

  return [search, setSearchQuery];
};

/**
 * Get value from local storage.
 * @param key local storage key.
 * @param defaultValue default value.
 * @returns local storage value.
 */
function getStorageValue(key: string, defaultValue: any): any {
  const saved = localStorage.getItem(key);
  const initial = saved && JSON.parse(saved);
  return initial || defaultValue;
}

/**
 * Hook for saving state in local storage.
 * @param key local storage key.
 * @param defaultValue default value.
 * @returns useState hook.
 */
export const useLocalStorage = (key: string, defaultValue: any): [any, React.Dispatch<any>] => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};