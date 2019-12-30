import React, {Component} from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import Configuration from "./../Resources/Configuration";
import {Theme, withStyles} from "@material-ui/core/styles";


const useStyles = (theme : Theme) => ({
    map : {
        width: 600,
        height: 400,
    },
    clearfix: {
        clear: 'both'
    }
});




class MapComponent extends Component
{


    public state : any = {
        user : { settings : {}
        }};

    constructor(props) {
        super(props);

    }



    render() {

        // @ts-ignore
        const {classes} = this.props;

        // @ts-ignore
        const {google} = this.props;


        return (
            <div>
                <Map
                    google={google}
                    zoom={8}
                    classes={classes.map}
                    initialCenter={{ lat: 47.444, lng: -122.176}}
                />
                <div className={classes.clearfix} />
            </div>
        );
    }
}

// @ts-ignore
export default withStyles(useStyles)(GoogleApiWrapper({
    apiKey: Configuration.G_MAP_API_KEY
})(MapComponent));