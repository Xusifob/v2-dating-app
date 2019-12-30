import APIService from "./APIService";
import URLS from "../Resources/URLS";
import Profile from "../Entities/Profile";


/**
 *
 */
export default class ProfileService extends APIService
{


    /**
     *
     * @param app
     */
    public fetchAll(app : string = 'all')
    {

        let promise = new Promise((resolve : any, reject : any) => {

            let url = URLS.GET_MATCHES;

            url = url.replace('{app}',app);

            this.getAll(url).then((response : any) => {

                let profiles = this.parseProfiles(response);

                resolve(profiles);

            }).catch((error : any) => {
                reject(error);
            })
        });


        return promise;
    }


    /**
     *
     * @param app
     */
    public fetchFavorites(app : string = 'all')
    {

        let promise = new Promise((resolve : any, reject : any) => {

            let url = URLS.FAVORITE;

            url = url.replace('{app}',app);

            this.getAll(url).then((response : any) => {

                let profiles = this.parseProfiles(response);

                resolve(profiles);

            }).catch((error : any) => {
                reject(error);
            })
        });


        return promise;
    }


    /**
     *
     * @param response
     */
    protected parseProfiles(response : any) : Profile[]
    {
        let profiles : Profile[] = [];

        response.forEach((data : any) => {

            let profile = new Profile(data);

            profiles.push(profile);

        });

        return  profiles;
    }


    public like(profile : Profile) : Promise<any> {
      return this.post(URLS.LIKE,profile);
    }


    public AddToFavorite(profile : Profile) : Promise<any> {
        let url = URLS.FAVORITE.replace('{app}','all');

        return this.post(url,profile)
    }


    /**
     *
     * @param profile
     */
    public removeFavorite(profile : Profile) : Promise<any> {

        let url = URLS.FAVORITE.replace('{app}','all');

        return this.delete(url,profile.id);
    }


    public superLike(profile : Profile) : Promise<any> {
        return this.post(URLS.SUPERLIKE,profile);
    }


    public disLike(profile : Profile) : Promise<any> {
        return this.post(URLS.DISLIKE,profile);
    }

}