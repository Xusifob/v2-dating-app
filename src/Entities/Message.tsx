import {Entity} from "./Entity";
import Profile from "./Profile";

export default class Message extends Entity
{



    // @ts-ignore
    public appId : string|number;

    // @ts-ignore
    public app : string;


    private _profile : Profile;


    private _content : string;


    private _sentDate : Date;

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


    get content(): string {
        return this._content;
    }

    set content(value: string) {
        this._content = value;
    }

    /**
     *
     */
    get sentDate(): Date|any {
        return this._sentDate;
    }


    /**
     *
     * @param date
     */
    set sentDate(date: Date|any) {
        if(date instanceof Date) {
            this._sentDate = date;
        } else {
            this._sentDate = new Date(date);
        }
    }

    public toJSON() {
        return {
            content : this.content,
            sentDate : this.sentDate,
            profile : this.profile,
        }
    }

}

