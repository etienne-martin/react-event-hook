export const generateRandomNumber = () => {
  return parseInt(Math.random().toString().replace(".", ""), 10);
};
