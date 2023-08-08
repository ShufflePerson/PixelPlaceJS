import Axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
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
import ILoginData from "./Types/ILoginData";

class Auth {
  constructor(
    private loginData: ILoginData | null,
    private sessionData: ISessionData | null = null,
    private userAgent: string = getUA(),
    private axios: AxiosInstance = Axios.create({})
  ) {
    this.axios.defaults.headers = this.getHeaders() as any;
  }

  public getHeaders(): any {
    let cookie: string = "";

    if (this.sessionData) cookie += `authId=${this.sessionData.authId};authKey=${this.sessionData.authKey};authToken=${this.sessionData.authToken};`;

    return {
      Origin: "https://pixelplace.io/",
      "Cache-L0cal": getCacheLocalAuth(),
      Cookie: cookie,
      "User-Agent": this.userAgent
    };
  }
  
  public async performPing(): Promise<void> {
    await this.axios.get("https://pixelplace.io/api/ping.php", this.getAxiosConfig());
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
    return this.loginData?.email || "";
  }

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

  public async getPaintingData(): Promise<AxiosResponse> {
      return await this.axios.get("https://pixelplace.io/api/get-painting.php?id=7&connected=1", this.getAxiosConfig())
  }
  

  public async Login(): Promise<ISessionData | IError> {
    try {
      if (this.sessionData != null || (this.attemptLoadCache() && this.sessionData)) {
        let paintingRes = await this.getPaintingData();
        let possibleNewData = parseSessionData(paintingRes);
        if (possibleNewData.authId != "") {
          this.sessionData = possibleNewData;
        }
        return this.sessionData;
      };
      let res = await this.axios.post(Config.LOGIN_URL, `email=${this.loginData?.email}&password=${this.loginData?.email}`, this.getAxiosConfig());

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
