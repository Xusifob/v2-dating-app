import React, {Component} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import {Theme, withStyles} from '@material-ui/core/styles';
import ProfileService from "./Services/ProfileService";
import UserCard from "./Elements/UserCard";
import Profile from "./Entities/Profile";
import Backdrop from "@material-ui/core/Backdrop";
import {CircularProgress, Container} from "@material-ui/core";
import DangerButton from './Elements/DangerButton';
import {Redirect} from 'react-router';
import Typography from "@material-ui/core/Typography";
import {Trans} from "react-i18next";
import ToastService from "./Services/ToastService";
import CustomError from "./Entities/CustomError";
import UserProvider from "./Services/UserProvider";


const useStyles = (theme : any) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
        textAlign: 'center',
        marginBottom : theme.spacing(2),
        marginTop : theme.spacing(3),

    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    title : {
        marginTop : theme.spacing(2),
        marginBottom : theme.spacing(2),
    },
});




class PendingMatchesView extends Component
{

    public state : any = {
        profiles : [],
    };

    protected profileService : ProfileService;

    protected userProvider : UserProvider;

    /**
     *
     * @param props
     */
    constructor(props : any) {
        super(props);

        this.profileService = props.profileService;

        this.userProvider = props.userProvider;

        this.profileService.setAuthHeader();

        this.loadProfiles();

    }


    /**
     *  Load all the profiles
     */
    public loadProfiles = () =>
    {

        let {isLoading} = this.state;

        if(isLoading) {
            return;
        }
        this.setState({isLoading: true});

        //@ts-ignore
        this.profileService.fetchPending(this.state.app).then((profiles : Profile[]) => {

            this.setState({profiles: profiles});

        }).catch((response : CustomError) => {
            if(response.status == 404) {
                this.setState({profiles : [new Profile({})]});
                this.setState({alert : { type : 'error', 'message' : response.error}});
            }
            if(response.status == 401) {
                // Reload profiles, the token is probably refreshed with load
                if(response.error == 'Expired JWT Token') {
                    this.userProvider.refreshToken().then(() => {
                        this.profileService.setAuthHeader();
                        this.loadProfiles();
                    });
                }
            }

            if(response.status == 406) {
                this.setState({redirect: true})
            }
        });
    }



    public render() {

        // @ts-ignore
        const {classes} = this.props;
        // @ts-ignore
        let {profiles} = this.state;


        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/configure'/>;
        }

        return (
            <Container component="main"  className={classes.container}  maxWidth="xl">
                <ToastService key={Math.random()} {...{alert : this.state.alert}} />
                <Backdrop
                    open={profiles.length <= 0}
                    className={classes.backdrop}
                >
                    <CircularProgress color="primary" />
                </Backdrop>


                <CssBaseline />
                {profiles.length > 0 ?
                    <Grid container spacing={1}>
                        <Grid container item xs={12} spacing={3}>
                            <Typography component="h2" variant="h5" className={classes.title} >
                                <Trans>Tous les Profils qui vous ont matchés</Trans>
                            </Typography>
                        </Grid>
                        <Grid container item xs={12} spacing={3}>
                            {profiles.map((profile) => {
                                if(profile.appId) {
                                    return <Grid key={profile.appId} item xs={12} sm={6} md={3} lg={3} xl={2}>
                                        <UserCard {...{
                                            profile: profile,
                                            hideActions : true,
                                        }}/>
                                    </Grid>
                                }
                            })}
                        </Grid>
                    </Grid> : ''}
            </Container>
        );
    }
}


// @ts-ignore
export default withStyles(useStyles)(PendingMatchesView)