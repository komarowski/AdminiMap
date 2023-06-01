import { useState, useEffect } from "react";


// https://beta-reactjs-org-git-you-might-not-fbopensource.vercel.app/learn/you-might-not-need-an-effect#fetching-data
// not call api request if urlParam is null

export function useFetch<T>(url: string | null, initialState: T, isJson: boolean): T {
  const [result, setResult] = useState(initialState);
  useEffect(() => {
    let ignore = false;
    if (url){
      console.log(url);
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

// https://stackoverflow.com/questions/42217121/how-to-start-search-only-when-user-stops-typing
export function useSearchDebounce(delay = 350): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timeoutID = setTimeout(() => setSearch(searchQuery), delay);
    return () => clearTimeout(timeoutID);
  }, [searchQuery, delay]);

  return [search, setSearchQuery];
};

// https://blog.logrocket.com/using-localstorage-react-hooks/
function getStorageValue(key: string, defaultValue: any): any {
  const saved = localStorage.getItem(key);
  const initial = saved && JSON.parse(saved);
  return initial || defaultValue;
}

export const useLocalStorage = (key: string, defaultValue: any): [any, React.Dispatch<any>] => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};