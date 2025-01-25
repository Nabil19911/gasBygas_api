export const getValidNumber = (value, fieldName) => {
  if (value === undefined) return undefined;
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
  return num;
};
