export const convertStringToInt = (text: string | null, defaultValue: number): number => {
  if (text) {
    const result = parseInt(text);
    if (!isNaN(result)) {
      return result;
    }    
  }
  return defaultValue;
}

export function getDefaultIfNull<T>(value: T | null, defaultValue: T): T {
  if (value) {
    return value;   
  }
  return defaultValue;
}