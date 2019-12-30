import {Entity} from "./Entity";

export default class User extends Entity
{

    public phone : string|null;

    public mail : string|null;

    public settings : any = {};

    public photo : string;

    public fullName : string;

    protected defaultSettings : any = {
        autoSuperLike: false,
        passWithoutBio: false,
        passWithoutPicture: false,
        startBotAuto: false,
        wordsToExclude: "",
        namesToExclude: "",
    };


    constructor(props) {

        super(props);

        this.setData(props);

        this.settings = {...this.defaultSettings,...this.settings};

    }





}