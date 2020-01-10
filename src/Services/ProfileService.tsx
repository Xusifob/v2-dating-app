import APIService from "./APIService";
import URLS from "../Resources/URLS";
import Profile from "../Entities/Profile";


/**
 *
 */
export default class ProfileService extends APIService
{



    public fetchAll()
    {
        return this.fetchProfiles(URLS.GET_MATCHES);
    }


    public fetchFavorites()
    {
        return this.fetchProfiles(URLS.FAVORITE);
    }

    public fetchPending()
    {

        return this.fetchProfiles(URLS.GET_PENDING);

    }


    protected fetchProfiles(route) {

        return new Promise((resolve : any, reject : any) => {

            this.getAll(route).then((response : any) => {

                let profiles = this.parseProfiles(response);

                resolve(profiles);

            }).catch((error : any) => {
                reject(error);
            })
        });

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


    /**
     *
     * @param profile
     */
    public like(profile : Profile) : Promise<any> {
      return this.post(URLS.LIKE,profile);
    }


    /**
     *
     * @param profile
     * @constructor
     */
    public addToFavorite(profile : Profile) : Promise<any> {
        return this.post(URLS.FAVORITE,profile)
    }


    /**
     *
     * @param profile
     */
    public removeFavorite(profile : Profile) : Promise<any> {

        return this.delete(URLS.FAVORITE,profile.id);
    }


    /**
     *
     * @param profile
     */
    public superLike(profile : Profile) : Promise<any> {
        return this.post(URLS.SUPERLIKE,profile);
    }


    /**
     *
     * @param profile
     */
    public disLike(profile : Profile) : Promise<any> {
        return this.post(URLS.DISLIKE,profile);
    }

}