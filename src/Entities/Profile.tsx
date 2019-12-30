import {Entity} from "./Entity";

export default class Profile extends Entity
{

    // @ts-ignore
    public appId : string|number;

    // @ts-ignore
    public app : string;
    // @ts-ignore
    public fullName : string;
    // @ts-ignore
    private _bio : string|null;
    // @ts-ignore
    public age : string|null;
    // @ts-ignore
    public isFavorite : boolean;
    // @ts-ignore
    public pictures : string[];
    // @ts-ignore
    public distance : string|null;

    // @ts-ignore
    public jobTitle : string|null;

    // @ts-ignore
    public school : string|null;

    public attributes : any;


    constructor(props) {
        super(props);

        this.setData(props);

    }


    set bio(value: string | null) {
        this._bio = value;
    }


    /**
     * nl2br
     */
    get bio(): string | null {

        if (typeof this._bio === 'undefined' || this._bio === null) {
            return '';
        }
        var breakTag = '<br>';

        this._bio = this._bio.trim();

        return (this._bio).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');

    }
}

