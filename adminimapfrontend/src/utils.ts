export const convertStringToInt = (text: string | null, defaultValue: number): number => {
  if (text) {
    const result = parseInt(text);
    if (!isNaN(result)) {
      return result;
    }    
  }
  return defaultValue;
}