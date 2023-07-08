import { useState, useEffect } from "react";


/**
 * Hook for data fetching.
 * @param url api request.
 * @param initialState initial state.
 * @param isText response is text (true) or json (false).
 * @returns api response.
 */
export function useFetch<T>(url: string | null, initialState: T, isText: boolean = false): T {
  const [result, setResult] = useState(initialState);
  useEffect(() => {
    let ignore = false;
    if (url){
      fetch(url)
      .then(response => isText ? response.text() : response.json())
      .then(responseResult => {
        if (!ignore) {
          setResult(responseResult);
        }
      })
      .catch(error => console.log(error));
    } else {
      setResult(initialState);
    } 
    return () => {
      ignore = true;
    };
  }, [url]);
  return result;
};

/**
 * Hook to set a delay time until a user stops typing to change state.
 * @param defaultValue default value.
 * @param delay delay in milliseconds.
 * @returns useState('') hook with debouncing.
 */
export function useSearchDebounce(defaultValue: string, delay = 350): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [search, setSearch] = useState(defaultValue);
  const [searchQuery, setSearchQuery] = useState(defaultValue);

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
export function useLocalStorage<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>]{
  const [value, setValue] = useState<T>(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};