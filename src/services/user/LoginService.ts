import DISingleton from "@web-atoms/core/dist/di/DISingleton.js";
import FetchBuilder from "@web-atoms/core/dist/services/FetchBuilder.js";

interface IUserInfo {
    userID: number;
    emailAddress: string;
    displayName: string;
    roles: string[];
}

@DISingleton()
export default class LoginService {

    user: IUserInfo = void 0;

    async getUser() {
        if(this.user) {
            return this.user;
        }
        const r = await FetchBuilder.get("/api/user").asJson<IUserInfo>();
        if(r.userID) {
            this.user = r;
        }
        return this.user;
    }

}