import React, {Component} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import {orange} from '@material-ui/core/colors';

import {Theme, withStyles} from '@material-ui/core/styles';
import {Copyright} from "./Elements/Copyright";
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

const WarningButton = withStyles((theme: Theme) => ({
    root: {
        color: theme.palette.getContrastText(orange[500]),
        backgroundColor: orange[500],
        '&:hover': {
            backgroundColor: orange[700],
        },
    },
}))(Button);




class DashBoardView extends Component
{

    public state : any = {
        favorites : [],
        profiles : [],
        redirect : false,
        app : 'all',
        runBot : false,
        passAll : false,
        likeAll : false,
        isLoading : false,
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

        //@ts-ignore
        this.profileService.fetchFavorites().then((favorites : Profile[]) => {

            this.setState({favorites: favorites});

        })

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
        this.profileService.fetchAll(this.state.app).then((profiles : Profile[]) => {

            this.setState({profiles: profiles});
            this.setState({isLoading: false});

        }).catch((response : CustomError) => {
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

            this.setState({profiles : [new Profile({})]});
            this.setState({alert : { type : 'error', 'message' : response.error}});

        });
    }


    /**
     *
     * @param profile
     * @param action
     */
    public onAction = (action : string = 'remove',profile : Profile|CustomError) =>
    {

        if(profile instanceof CustomError) {
            this.setState({alert : { type : 'error', 'message' : profile.error}});
            return;
        }

        let messages  = {
            'like' : 'Like pris en compte',
            'superLike' : 'Super like pris en compte',
            'add-to-favorite' : 'Profil ajouté en favoris',
            'remove-from-favorite' : 'Profil retiré des favoris',
            'dislike' : 'Dislike pris en compte'
        };

        let {favorites} = this.state;
        let {profiles} = this.state;

        if(action == 'add-to-favorite') {
            favorites.push(profile);
        } else {
            let Pkey = profiles.indexOf(profile);

            if (Pkey !== -1) {
                profiles.splice(Pkey, 1);
            }

            let Fkey = favorites.indexOf(profile);

            if(Fkey !== -1) {
                favorites.splice(Fkey,1);
            }

        }


        this.setState({profiles: profiles});
        this.setState({favorites : favorites});

        if(profiles.length === 0) {
            this.loadProfiles();
        }

        this.setState({alert : { type : 'info', 'message' : messages[action]}})


    }


    /**
     *
     * @param ev
     */
    public onButtonClick(ev : string)
    {

        let {profiles} = this.state;

        profiles.forEach((v,k) => {

            v[ev] = true;
            profiles[k] = v;
        })

        this.setState({profiles : profiles});

    }


    public render() {

        // @ts-ignore
        const {classes} = this.props;
        // @ts-ignore
        let {profiles} = this.state;

        // @ts-ignore
        let {favorites} = this.state;

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

                {favorites.length > 0 ? <Grid container spacing={1}>
                    <Grid container item xs={12} spacing={3}>
                        <Typography component="h2" variant="h5" className={classes.title} >
                            <Trans>Vos Profils Favoris</Trans>
                        </Typography>
                    </Grid>
                    <Grid container item xs={12} spacing={3}>
                        {favorites.map((profile) => {
                            return  <Grid key={profile.id}  item xs={12} sm={6} md={4} lg={3} xl={2}  >
                                <UserCard {... {onAction : this.onAction, profileService : this.profileService,profile : profile}}/>
                            </Grid>
                        })}
                    </Grid>
                </Grid> : ''}

                <div className={classes.root}>
                    <DangerButton variant="contained" color="secondary"  onClick={() => {this.onButtonClick('disLike')}} >Tout Passer</DangerButton>
                    <Button variant="contained" color="secondary"  onClick={() => {this.onButtonClick('like')}} >Tout Liker</Button>
                    <WarningButton variant="contained"  onClick={() => {this.onButtonClick('runBot')}} >Lancer le bot</WarningButton>
                    <Button variant="contained" color="primary" onClick={this.loadProfiles} >Recharger les profils</Button>
                </div>

                <CssBaseline />
                {profiles.length > 0 ?
                    <Grid container spacing={1}>
                        <Grid container item xs={12} spacing={3}>
                            <Typography component="h2" variant="h5" className={classes.title} >
                                <Trans>Tous les Profils</Trans>
                            </Typography>
                        </Grid>
                        <Grid container item xs={12} spacing={3}>
                            {profiles.map((profile) => {
                                if(profile.appId) {
                                    return <Grid key={profile.appId} item xs={12} sm={6} md={3} lg={3} xl={2}>
                                        <UserCard {...{
                                            runBot: profile.runBot,
                                            onAction: this.onAction,
                                            profileService: this.profileService,
                                            profile: profile,
                                            like: profile.like,
                                            disLike: profile.disLike,
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
export default withStyles(useStyles)(DashBoardView)