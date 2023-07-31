import Axios, { AxiosInstance, AxiosError } from "axios";
import IError from "../../Types/Auth/IError";
import IPPHeaders from "../../Types/PixelPlace/IPPHeaders";
import ISessionData from "../../Types/PixelPlace/ISessionData";
import getUA from "./Utils/getUA";
import Config from "./Config";
import { getCacheLocalAuth } from "../../Helpers/getAuthSecret";
import parseSessionData from "./Utils/parseSessionData";
import EError from "../../Types/Auth/EError";


class Auth {

    private sessionData: ISessionData | null = null;

    constructor(private email: string, private password: string, private userAgent: string = getUA(), private axios: AxiosInstance = Axios.create({})) {}

    public getHeaders(): any {
        let cookie: string = "";

        if (this.sessionData) 
            cookie = `authId=${this.sessionData.authId};authKey=${this.sessionData.authKey};authToken=${this.sessionData.authToken};`;

        return {
            "Origin": "https://pixelplace.io/",
            "Cache-L0cal": getCacheLocalAuth(),
            "Cookie": cookie,
            "User-Agent": this.userAgent
        }
    }
    
    public getSessionData(): ISessionData | null {
        return this.sessionData;
    }

    public getEmail(): string {
        return this.email;
    }

    public setProxy(proxy: string) {
        console.warn(`setProxy function is not yet finished.`)
    }

    public async Login(): Promise<ISessionData | IError> {
        try {
            let res = await this.axios.post(Config.LOGIN_URL, `email=${this.email}&password=${this.password}`, {headers: this.getHeaders()})
            
            if (JSON.stringify(res.data) == "[]") {
                let sesData = parseSessionData(res);
                this.sessionData = sesData;
                return sesData;
            }

            return {
                id: EError.UNEXPECTED,
                info: "Unexpected Response",
                message: res.data
            }
        } catch (ex) {
            if (Axios.isAxiosError(ex)) {
                let error = ex as AxiosError;
                return {
                    id: EError.INVALID_CREDENTIALS,
                    info: "Given Login Data is invalid",
                    message: error.response?.data as string
                }
            } else {
                console.log(ex)
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