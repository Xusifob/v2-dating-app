import Configuration from '../Resources/Configuration';
import UserProvider from "./UserProvider";
import CustomError from "../Entities/CustomError";
import {Simulate} from "react-dom/test-utils";


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
     * @param id
     * @return {Promise<any>}
     */
    protected async get(route : string,id : string|number) {

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
}

export default APIService;