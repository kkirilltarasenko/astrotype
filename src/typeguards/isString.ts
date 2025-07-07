export const isString = (data: unknown): data is string => {
  return typeof data === 'string';
};
