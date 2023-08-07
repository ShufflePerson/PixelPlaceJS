import Axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import IError from "../../Types/Auth/IError";
import ISessionData from "../../Types/PixelPlace/ISessionData";
import getUA from "./Utils/getUA";
import Config from "./Config";
import { getCacheLocalAuth } from "../../Helpers/getAuthSecret";
import parseSessionData from "./Utils/parseSessionData";
import EError from "../../Types/Auth/EError";
import fs from "fs";
import { customRandomString } from "../../Helpers/getPAlive";
import winston from "winston";

class Auth {
  private sessionData: ISessionData | null = null;

  constructor(
    private email: string,
    private password: string,
    private userAgent: string = getUA(),
    private axios: AxiosInstance = Axios.create({})
  ) {
    this.axios.defaults.headers = this.getHeaders() as any;
  }

  public getHeaders(): any {
    let cookie: string = "";

    if (this.sessionData) cookie = `authId=${this.sessionData.authId};authKey=${this.sessionData.authKey};authToken=${this.sessionData.authToken};`;

    return {
      Origin: "https://pixelplace.io/",
      "Cache-L0cal": getCacheLocalAuth(),
      Cookie: cookie,
      "User-Agent": this.userAgent
    };
  }

  private getAxiosConfig(): AxiosRequestConfig {
    return {
      headers: this.getHeaders()
    };
  }

  public getSessionData(): ISessionData | null {
    return this.sessionData;
  }

  public getEmail(): string {
    return this.email;
  }

  // public setProxy(proxy: string) {
  //    console.warn(`setProxy function is not yet finished.`)
  // }

  private saveCache() {
    let currentCache = JSON.parse(fs.readFileSync("./data/cache.json", "utf-8"));
    currentCache[this.getEmail()] = this.sessionData;
    fs.writeFileSync("./data/cache.json", JSON.stringify(currentCache));
  }

  private attemptLoadCache(): boolean {
    if (!fs.existsSync("./data/cache.json")) return false;
    let currentCache = JSON.parse(fs.readFileSync("./data/cache.json", "utf-8"));
    if (currentCache[this.getEmail()]) {
      this.sessionData = currentCache[this.getEmail()];
      return true;
    }
    return false;
  }

  public async setUsername(username: string = customRandomString(7)): Promise<void> {
    await this.axios.post("https://pixelplace.io/api/account-username.php", `username=${username}`, this.getAxiosConfig());
    winston.log("info", "Set username", "Auth", username);
  }

  public async Login(): Promise<ISessionData | IError> {
    try {
      if (this.attemptLoadCache() && this.sessionData) return this.sessionData;
      let res = await this.axios.post(Config.LOGIN_URL, `email=${this.email}&password=${this.password}`, this.getAxiosConfig());

      if (JSON.stringify(res.data) == "[]") {
        let sesData = parseSessionData(res);
        this.sessionData = sesData;
        this.saveCache();
        return sesData;
      }

      return {
        id: EError.UNEXPECTED,
        info: "Unexpected Response",
        message: res.data
      };
    } catch (ex) {
      if (Axios.isAxiosError(ex)) {
        let error = ex as AxiosError;
        return {
          id: EError.INVALID_CREDENTIALS,
          info: "Given Login Data is invalid",
          message: error.response?.data as string
        };
      } else {
        console.log(ex);
      }

      return {
        id: EError.OTHER,
        info: "Unexpected Error occured",
        message: JSON.stringify(ex)
      };
    }
  }
}

export default Auth;
