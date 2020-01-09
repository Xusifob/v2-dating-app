import React, {Component} from 'react';
import { Map, GoogleApiWrapper,Marker } from 'google-maps-react';
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


    constructor(props) {
        super(props);
    }



    render() {

        // @ts-ignore
        const {classes} = this.props;

        // @ts-ignore
        const {google} = this.props;

        // @ts-ignore
        const {location} = this.props;


        return (
            location.lat && location.lon ? (
            <div style={{height: '350px',position: "relative"}} >
                <Map
                    style={{width: '100%', height: '300px', position: 'initial'}}
                    google={google}
                    zoom={12}
                    classes={classes.map}
                    initialCenter={{ lat: location.lat, lng: location.lon}}
                    center={{ lat: location.lat, lng: location.lon}}
                >
                    <Marker
                        position={
                            {lat: location.lat, lng: location.lon}
                        } />
                </Map>
            </div>) : ''
        );
    }
}

// @ts-ignore
export default withStyles(useStyles)(GoogleApiWrapper({
    apiKey: Configuration.G_MAP_API_KEY
})(MapComponent));