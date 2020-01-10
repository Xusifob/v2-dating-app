import APIService from "./APIService";
import URLS from "../Resources/URLS";

/**
 *
 */
export default class ConfiguratorService extends APIService
{



    /**
     * Get all existing apps
     */
    public getAvailableApps() {

      return this.getAll(URLS.APPS);
    }


    /**
     *
     * Login to the selected app
     *
     * @param app
     * @param credentials
     */
    public login(app : string,credentials : any) : Promise<any>
    {
        let url = URLS.APP_LOGIN;

        url = url.replace('{app}', app);

        return  this.post(url, credentials);
    }


    /**
     *
     * Disconnect the app selected
     *
     * @param app
     */
    public disconnect(app : string) : Promise<any>
    {
        let url = URLS.APP_DISCONNECT;

        url = url.replace('{app}', app);

        return this.post(url,{})

    }


    /**
     *
     * @param app
     * @param credentials
     */
    public validateLogin(app : string,credentials : any) : Promise<any>
    {
        let url = URLS.APP_LOGIN_VALIDATE;

        url = url.replace('{app}',app);

        return this.post(url,credentials);
    }

}