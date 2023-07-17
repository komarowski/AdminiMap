import { LocalStorageParams } from "./constants";

/**
 * Parse the date string from the database to the Long Date format.
 * @param dateString Date string from the database.
 * @returns Date string in Long Date format.
 */
export const getFormatDateString = (dateString: string): string => {
  const timestamp = Date.parse(dateString);
  if (!isNaN(timestamp)) {
    const date = new Date(timestamp);
    const resultDate = date.toDateString(); 
    return resultDate.substring(resultDate.indexOf(' ') + 1);
  }
  return '';
}

/**
 * Converts a string to an integer.
 * @param text A string to convert into a number.
 * @param defaultValue Default value if the conversion failed.
 * @returns Integer.
 */
export const convertStringToInt = (text: string | null, defaultValue: number): number => {
  if (text) {
    const result = parseInt(text);
    if (!isNaN(result)) {
      return result;
    }    
  }
  return defaultValue;
}

interface IFetchGetProps<T> {
  url: string,
  default: T,
  isText?: boolean,
  headers?: any, 
}

/**
 * Performs a GET request using fetch.
 * @param props Request parameters.
 * @returns Response to a request or default value.
 */
export async function fetchGet<T>(props: IFetchGetProps<T>): Promise<T>{
  const response = await fetch(props.url, {
    method: "GET",
    headers: props.headers,
  });
  if (response.ok){
    return props.isText ? response.text() : response.json();
  }
  return props.default;
}

/**
 * Performs a GET request using fetch with authentication info.
 * @param props Request parameters.
 * @returns Response to a request or default value.
 */
export async function fetchGetAuth<T>(props: IFetchGetProps<T>): Promise<T>{
  return await fetchGet<T>({
    url: props.url,
    default: props.default,
    isText: props.isText,
    headers: {
      "AuthName": localStorage.getItem(LocalStorageParams.USERNAME),
      "AuthToken": localStorage.getItem(LocalStorageParams.TOKEN),
      ...props.headers,
    },
  });
}

interface IFetchPostProps<T> {
  url: string,
  default: T,
  method: "POST"|"DELETE"|"PUT",
  isText?: boolean,
  body?: any,
  headers?: any, 
}

/**
 * Performs a POST | DELETE | PUT request using fetch.
 * @param props Request parameters.
 * @returns Response to a request or default value.
 */
export async function fetchPost<T>(props: IFetchPostProps<T>): Promise<T>{
  const response = await fetch(props.url, {
    method: props.method,
    headers: props.headers,
    body: props.body
  });
  if (response.ok){
    return props.isText ? response.text() : response.json();
  }
  return props.default;
}

/**
 * Performs a POST | DELETE | PUT request using fetch with authentication info.
 * @param props Request parameters.
 * @returns Response to a request or default value.
 */
export async function fetchPostAuth<T>(props: IFetchPostProps<T>): Promise<T>{
  return await fetchPost<T>({
    url: props.url,
    default: props.default,
    method: props.method,
    isText: props.isText,
    headers: {
      "AuthName": localStorage.getItem(LocalStorageParams.USERNAME),
      "AuthToken": localStorage.getItem(LocalStorageParams.TOKEN),
      ...props.headers,
    },
    body: props.body,
  });
}