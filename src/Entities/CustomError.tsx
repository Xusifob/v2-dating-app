import {Entity} from "./Entity";

export default class CustomError extends Entity
{

    protected _status : number|null;

    protected  _error : string = '';

    constructor(props) {
        super(props);

        this.setData(props);

        if(props.message && !this.error) {
            this.error = props.message;
        }
        if(props.code && !this.status) {
            this.status = props.code;
        }

    }



    get status(): number | null {
        return this._status;
    }

    set status(value: number | null) {
        this._status = value;
    }

    get error(): string {
        return this._error;
    }

    set error(value: string) {
        this._error = value;
    }
}