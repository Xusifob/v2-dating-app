export abstract class Entity {


    // @ts-ignore
    public id : string;


    constructor(props : any = []) {

        this.setData(props);

    }


    public setData(props : any = []) {
        Object.keys(props).forEach((k : string) => {

            //@ts-ignore
            this[k] =  props[k];

        });
    }


}