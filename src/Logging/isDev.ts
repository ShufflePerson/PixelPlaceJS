export default () => {
    return true; //temporary dev override
  if (!process.env || !process.env.ISDEV) return false;

  return process.env.ISDEV == "TRUE";
};
