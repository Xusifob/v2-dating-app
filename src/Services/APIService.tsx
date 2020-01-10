import Configuration from '../Resources/Configuration';
import UserProvider from "./UserProvider";
import CustomError from "../Entities/CustomError";


class APIService {



    public headers : any;


    constructor() {

        this.headers = {
            "Content-Type": "application/json",
        };

        this.setAuthHeader();

    }


    public setAuthHeader()
    {
        if(UserProvider.token) {
            this.headers['Authorization'] = 'Bearer ' + UserProvider.token;
        }
    }


    /**
     *
     * @param route
     * @return {Promise<[]>}
     */
    protected async getAll(route : string) : Promise<any> {

        route = this.parseRoute(route);

        return new Promise(((resolve, reject) => {

            return fetch(Configuration.BASE_URL + route, {
                headers: this.headers
            })
                .then(response => {
                    if (!response.ok) {
                        response.json().then((d) => {
                            reject(new CustomError(d));
                        })
                    } else {
                        response.json().then((d) => {
                            resolve(d);
                        })
                    }
                })
                .catch(error => {
                    reject(new CustomError({status: 500, error: error.toString()}));
                });
        }))

    }


    /**
     *
     * @param route
     */
    protected parseRoute(route : string) : string
    {
        let app = APIService.currentApp;

        route = route.replace('{app}',app);

        return route;
    }

    /**
     *
     * @param route
     * @param id
     * @return {Promise<any>}
     */
    protected async get(route : string,id : string|number) {

        route = this.parseRoute(route);

        return fetch(Configuration.BASE_URL + route + '/' + id,{
            headers : this.headers
        })
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
            })
            .catch(response => {
                if(!response.message) {
                    throw new Error(response);
                }
                this.handleError(response);
            });
    }


    /**
     *
     * @param route
     * @param newitem
     * @return {Promise<any>}
     */
    protected async post(route : string,newitem : any) : Promise<any>
    {

        route = this.parseRoute(route);

        return new Promise(((resolve, reject) => {

            fetch(Configuration.BASE_URL + route, {
                method: "POST",
                mode: "cors",
                cache: 'no-cache',
                credentials: 'include',
                headers: this.headers,
                body: JSON.stringify(newitem)
            })
                .then(response => {
                    if (!response.ok) {
                        response.json().then((d) => {
                            reject(new CustomError(d));
                        })
                    } else {
                        response.json().then((d) => {
                            resolve(d);
                        })
                    }
                })
                .catch(error => {
                    reject(new CustomError({status : 500, error : error.toString()}));
                });

        }));

    }


    /**
     *
     * @param route
     * @param id
     * @return {Promise<Response>}
     */
    protected async delete(route : any,id : string) {

        route = this.parseRoute(route);

        return fetch(Configuration.BASE_URL + route + '/' + id,{
            method: "DELETE",
            mode: "cors",
            headers : this.headers,
        })
            .then(response => {
                if (!response.ok) {
                    return this.handleResponseError(response);
                } else {
                    return response.json();
                }
            })
            .catch(error => {
                this.handleError(error);
            });
    }


    /**
     *
     * @param route
     * @param id
     * @param item
     * @return {Promise<any>}
     */
    protected async put(route : string, id : any,item : any) {

        route = this.parseRoute(route);

        return fetch(Configuration.BASE_URL + route + '/' + id,{
            method: "PUT",
            mode: "cors",
            headers: this.headers,
            body: JSON.stringify(item)
        })
            .then(response => {
                if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    /**
     *
     * @param response
     */
    handleResponseError(response : any) {
        throw new Error(response);
    }

    /**
     *
     * @param error
     */
    handleError(error : any) {
        throw new Error(error.message);
    }


    /**
     *
     */
    public static get apps() : any
    {
        let u = localStorage.getItem('apps');

        if(u) {
            try {
                return JSON.parse(u);
            }catch (e) {
                return []
            }
        }

        return []

    }


    /**
     *
     * @param apps
     */
    public static set apps(apps: any) {
        //@ts-ignore
        localStorage.setItem('apps',JSON.stringify(apps));
    }


    /**
     *
     */
    public static get currentApp() : string
    {
        let u = localStorage.getItem('app');

        if(!u) {
            return 'all';
        }

        return u;

    }


    /**
     *
     * @param app
     */
    public static set currentApp(app : string) {

        localStorage.setItem('app',app);
    }


}

export default APIService;