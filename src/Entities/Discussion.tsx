import {Entity} from "./Entity";
import Profile from "./Profile";
import Message from "./Message";

export default class Discussion extends Entity
{

    // @ts-ignore
    public appId : string|number;

    // @ts-ignore
    public app : string;

    private _profile : Profile;

    private _messages : Message[] = [];

    private _createdDate : Date;

    constructor(props) {
        super(props);

        this.setData(props);

    }



    get profile(): any {
        return this._profile;
    }

    set profile(value: any) {

        if(value instanceof Profile) {
            this._profile = value;
        } else {
            this._profile = new Profile(value);
        }

    }

    get messages(): Message[]|any[] {
        return this._messages;
    }

    set messages(messages: Message[]|any[]) {

        messages.forEach((message : any) => {
            this.addMessage(message);
        })

    }

    public addMessage(message : any) {
        if(!this._messages) {
            this._messages = [];
        }

        if(message instanceof Message) {
            this._messages.push(message);
        } else {
            this._messages.push(new Message(message));
        }
    }


    /**
     *
     */
    get createdDate(): Date|any {
        return this._createdDate;
    }


    /**
     *
     * @param date
     */
    set createdDate(date: Date|any) {
        if(date instanceof Date) {
            this._createdDate = date;
        } else {
            this._createdDate = new Date(date);
        }
    }
}

