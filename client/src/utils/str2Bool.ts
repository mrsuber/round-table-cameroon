export const str2Bool = (value: string) => {
  if (value && typeof value === 'string') {
    if (value.toLowerCase() === 'public project') return true;
    if (value.toLowerCase() != 'public project' || value.toLowerCase() != '') return false;
  }
  return value;
};
