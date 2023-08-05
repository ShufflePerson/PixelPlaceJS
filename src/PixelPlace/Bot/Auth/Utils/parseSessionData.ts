import { AxiosResponse } from "axios";
import ISessionData from "../../../Types/PixelPlace/ISessionData";

function parseSessionData(res: AxiosResponse): ISessionData {
  let authId = "";
  let authKey = "";
  let authToken = "";

  res.headers["set-cookie"]?.forEach((cookie) => {
    const [cookieName, cookieValue] = cookie.split(";")[0].split("=");
    switch (cookieName.trim()) {
      case "authId":
        authId = cookieValue;
        break;
      case "authKey":
        authKey = cookieValue;
        break;
      case "authToken":
        authToken = cookieValue;
        break;
    }
  });

  return {
    authId,
    authKey,
    authToken
  };
}

export default parseSessionData;
