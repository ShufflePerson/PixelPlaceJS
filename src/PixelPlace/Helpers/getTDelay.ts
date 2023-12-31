export default (serverTime: number): number => {
  var currentTime = new Date().getTime() / 1e3;
  var tdelay = 0;
  if (serverTime < currentTime) {
    tdelay = serverTime - currentTime;
  } else serverTime > currentTime && (tdelay = serverTime - currentTime);

  return Math.round(tdelay);
};
