import APIService from "./APIService";
import URLS from "../Resources/URLS";
import User from "../Entities/User";


/**
 *
 */
export default class UserProvider extends APIService
{


    private _refresh : any;


    public loadCurrentUser() : Promise<any>
    {
        let promise = new Promise(((resolve, reject) => {
            this.get('users', 'me').then((user: any) => {
                this.user = user;
                resolve(this.user);
            })
                .catch((reason : any) => {
                    reject(reason);
                })
        }));

        return promise;
    }

    /**
     *
     * @param credentials
     */
    public login(credentials : any) : Promise<any>
    {
        let promise = new Promise(((resolve, reject) => {
            this.post(URLS.LOGIN,credentials).then((response : any) => {
                UserProvider.token = response.token;
                UserProvider.refresh_token = response.refresh_token;

                this.setAuthHeader();

                this.loadCurrentUser();
                this._refresh();
                resolve(this);

            }).catch(function (response) {
                reject(response);
            })
        }));

        return promise;
    }



    /**
     *
     * @param credentials
     */
    public register(credentials : any) : Promise<any>
    {
        let promise = new Promise(((resolve, reject) => {
            this.post(URLS.REGISTER,credentials).then((response : any) => {
                if(response) {
                    resolve(this);
                } else {
                    reject(this);
                }
            }).catch(function (response) {
                reject(response);
            })
        }));

        return promise;
    }

    /**
     *
     * @param user
     */
    public update(user : User) : Promise<any>
    {
        let promise = new Promise(((resolve, reject) => {
            this.put(URLS.USER_UPDATE,user.id,user).then((response : any) => {

                this.user = response;

                if(response) {
                    resolve(this);
                } else {
                    reject(this);
                }
            }).catch(function (response) {
                reject(response);
            })
        }));

        return promise;
    }


    public refreshToken()
    {

        let token = UserProvider.refresh_token;

        this.post(URLS.REFRESH_TOKEN,{refresh_token : token}).then((response : any) => {

            if(response) {
                this.setAuthHeader();
                UserProvider.token = response.token;
                UserProvider.refresh_token = response.refresh_token;
            }
        })
    }


    public static isLoggedIn() : boolean
    {
        //@ts-ignore
        return this.token != undefined;
    }



    public reset() : void
    {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');

        this._refresh();

    }


    /**
     *
     */
    static get token(): string|null {
        return localStorage.getItem('token');
    }

    static set token(value: string|null) {
        //@ts-ignore
        localStorage.setItem('token',value);
    }



    get user(): any {
        return UserProvider.getUser();
    }


    public static getUser() : User
    {
        let u = localStorage.getItem('user');

        if(u) {
            try {
                return new User(JSON.parse(u));
            }catch (e) {
                return new User({});
            }
        }

    }


    set user(user: any) {
        //@ts-ignore
        localStorage.setItem('user',JSON.stringify(user));
    }


    static get refresh_token(): string|null {
        return localStorage.getItem('refresh_token');
    }

    static set refresh_token(value: string|null) {
        //@ts-ignore
        localStorage.setItem('refresh_token',value);
    }



    set refresh(value: any) {

        this._refresh = value;
    }
}