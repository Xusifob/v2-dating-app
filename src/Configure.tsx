import React, {Component} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import {withStyles} from '@material-ui/core/styles';
import {Copyright} from "./Elements/Copyright";
import UserProvider from "./Services/UserProvider";
import ConfiguratorService from "./Services/ConfiguratorService";
import AppCard from "./Elements/AppCard";
import {Container} from "@material-ui/core";
import APIService from "./Services/APIService";


const useStyles = (theme : any) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
        textAlign: 'center',
        marginBottom : theme.spacing(2),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
});




class Configure extends Component
{

    public state : any = {apps : []};


    protected userProvider : UserProvider;


    protected configuratorService : ConfiguratorService;

    /**
     *
     * @param props
     */
    constructor(props : any) {
        super(props);

        this.userProvider = props.userProvider;
        this.configuratorService = new ConfiguratorService();

        this.configuratorService.getAvailableApps().then((response) => {
            APIService.apps = response;
            this.setState({apps : response})
        })

    }



    public render() {


        // @ts-ignore
        const {apps} = this.state;



        return (
            <div>
                <Container fixed>
                    <CssBaseline />
                    <Grid container spacing={1}>
                        <Grid container item xs={12} spacing={3}>

                            {apps.map((app,key) => {
                                return  <Grid key={key}  item xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <AppCard {...{app : app,configuratorService : this.configuratorService}} />
                                </Grid>
                            })}
                        </Grid>
                    </Grid>
                </Container>
            </div>
        );
    }
}


// @ts-ignore
export default withStyles(useStyles)(Configure)