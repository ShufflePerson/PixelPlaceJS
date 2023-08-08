export default () => {
  if(!process.env || !process.env.ISDEV) return false;

  
  return process.env.ISDEV == "TRUE";
};
