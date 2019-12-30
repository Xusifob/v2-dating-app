import APIService from "./APIService";
import URLS from "../Resources/URLS";
import Profile from "../Entities/Profile";
import Discussions from "../DiscussionsView";
import Discussion from "../Entities/Discussion";
import Message from "../Entities/Message";


/**
 *
 */
export default class DiscussionService extends APIService
{


    /**
     *
     * @param app
     */
    public fetchAll(app : string = 'all')
    {

        let promise = new Promise((resolve : any, reject : any) => {

            let url = URLS.GET_MESSAGES;

            url = url.replace('{app}',app);

            this.getAll(url).then((response : any) => {

                let discussions = this.parseDiscussions(response);

                resolve(discussions);

            }).catch((error : any) => {
                reject(error);
            })
        });


        return promise;
    }


  /**
     *
     * @param discussion Discussion
     * @param app
     */
    public fetchMessages(discussion: Discussion,app : string = 'all')
    {

        return  new Promise((resolve : any, reject : any) => {

            let url = URLS.GET_MESSAGES;

            url = url.replace('{app}',discussion.app);

            this.get(url,discussion.appId).then((response : any) => {

                let messages = this.parseMessages(response);

                resolve(messages);

            }).catch((error : any) => {
                reject(error);
            })
        });

    }

    /**
     *
     * @param discussion
     * @param message
     */
    public sendMessage(discussion : Discussion,message : Message) : Promise<Message>
    {
        return  new Promise((resolve : any, reject : any) => {

            let url = URLS.GET_MESSAGES;

            url = url.replace('{app}',discussion.app) + '/' + discussion.appId;

            this.post(url,message.toJSON()).then((response : any) => {

                let message = new Message(response);

                resolve(message);

            }).catch((error : any) => {
                reject(error);
            })
        });
    }



    /**
     *
     * @param response
     */
    protected parseDiscussions(response : any) : Discussion[]
    {
        let discussions : Discussion[] = [];

        response.forEach((data : any) => {

            let discussion = new Discussion(data);

            discussions.push(discussion);

        });

        return  discussions;
    }

    /**
     *
     * @param response
     */
    protected parseMessages(response : any) : Message[]
    {
        let messages : Message[] = [];

        response.forEach((data : any) => {

            let message = new Message(data);

            messages.push(message);

        });

        return messages.reverse();
    }

}