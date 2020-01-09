import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {IconButton} from "@material-ui/core";
import FavoriteIcon from '@material-ui/icons/Favorite';
import CloseIcon from '@material-ui/icons/Close';
import GradeIcon from '@material-ui/icons/Grade';
import ProfileService from "../Services/ProfileService";
import Profile from "../Entities/Profile";
import {PersonAdd, PersonAddDisabled} from "@material-ui/icons";
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';
import { virtualize } from 'react-swipeable-views-utils';
import UserProvider from "../Services/UserProvider";
import User from "../Entities/User";
import CustomError from "../Entities/CustomError";

const KBSwipeableViews = bindKeyboard(virtualize(SwipeableViews));


const useStyles = (theme : any) => ({
    img: {
        display: 'block',
        maxWidth: 480,
        overflow: 'hidden',
        width: '100%',
    },
    imgContainer : {
        height: 370,
        overflow: 'hidden',
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 12,
    },
    icon : {
        height: 30,
        width: 'auto',
    },
    tinder : {
        backgroundColor: 'rgba(254, 90, 98, 0.25);'
    },
    bumble : {
        backgroundColor: 'rgba(254, 197, 40, 0.25);'
    },
    badoo : {
        backgroundColor: 'rgba(120, 59, 248, 0.25);'
    },
    dislike : {
        backgroundColor: 'rgba(255, 40, 40, 0.70);'
    },
    like : {
        backgroundColor: '#4caf50'
    },
    card : {
        maxWidth: 480,
    }
});


class UserCard extends Component
{


    protected profileService : ProfileService;


    public state  : any = {profile : {},runBot : false};

    protected _ismounted : boolean = false;

    protected onAction : any;

    constructor(props) {
        super(props);

        // @ts-ignore
        this.state  = {
            // @ts-ignore
            profile : this.props.profile,
            runBot : false,
            action: null,
        };

        // @ts-ignore
        this.profileService = this.props.profileService;

        // @ts-ignore
        this.onAction = this.props.onAction;

        if(this._ismounted) {
            this.doActions(props);
        }

    }

    public componentDidMount(): void {

        this._ismounted = true;

        this.doActions(this.props);

    }

    public componentWillUnmount(): void {
        this._ismounted = false;
    }


    public componentWillReceiveProps(props)
    {
        this.doActions(props);
    }



    public doActions = (props) => {

        // @ts-ignore
        const {hideActions} = this.props;

        // Disable bot actions only if the actions are hidden
        if(!hideActions) {

            // Put a random timeout to avoid tinder errors
            //    setTimeout(() => {
            let user = UserProvider.getUser();

            let runBot = props.runBot || user.settings.startBotAuto;

            if(runBot !== this.state.runBot) {
                this.setState({runBot: runBot});
                if(runBot) {
                    this.runBot(user);
                }

            }

            if(props.like !== this.state.like) {
                this.setState({like: props.like});
                if(props.like) {
                    this.like();
                }
            }

            if(props.disLike !== this.state.disLike) {
                this.setState({disLike: props.disLike});
                if(props.disLike) {
                    this.disLike();
                }
            }
            //     },Math.random()*2000)
        }
    }


    /**
     *
     * Run the bot
     *
     * @param user
     */
    public runBot = (user : User) => {

        console.log('run');

        let to_dislike = false;

        let {profile} = this.state;

        if(profile.isFavorite) {
            return;
        }

        if(user.settings.passWithoutBio) {
            if(profile.bio == '') {
                to_dislike = true;
            }
        }

        // @TODO Do this one
        if(user.settings.passWithoutPicture) {

        }



        let words = user.settings.wordsToExclude.trim().split("\n")

        words.map((word) => {
            word = word.trim();

            let rex = (new RegExp(word, "ig"));
            if (profile.bio.match(rex)) {
                to_dislike = true;
            }
        })


        let names = user.settings.wordsToExclude.trim().split("\n");

        names.map((name) => {
            name = name.trim();

            let rex = (new RegExp(name, "igm"));
            if (profile.fullName.match(rex)) {
                to_dislike = true;
            }
        })


        if(to_dislike) {
            this.disLike();
        }

    }



    /**
     *
     * Like the user
     *
     * @param event
     */
    public like = (event : any = {}) => {

        // @ts-ignore
        const {profile} = this.state;

        this.setState({action: 'like'});

        this.profileService.like(profile).then(() => {
            this.onAction('like',profile);
        }).catch((error : CustomError) => {
            this.setState({action: null});
            this.onAction('error',error);
        })
    }


    /**
     *
     * Super like the user
     *
     * @param event
     */
    public superLike = (event : any = {}) => {

        // @ts-ignore
        const {profile} = this.state;

        this.setState({action: 'superlike'});

        this.profileService.superLike(profile).then(() => {
            this.onAction('superLike',profile);
        }).catch((error : CustomError) => {
            this.setState({action: null});
            this.onAction('error',error);
        })

    }


    /**
     *
     * Add the user to the favorites
     *
     * @param event
     */
    public favorite = (event : any = {}) => {

        // @ts-ignore
        const {profile} = this.state;

        this.profileService.AddToFavorite(profile).then((response) => {

            let profile = new Profile(response);

            this.setState({profile : profile});

            this.onAction('add-to-favorite',profile);

        }).catch((error : CustomError) => {
            this.onAction('error',error);
        })


    }


    /**
     *
     * Remove the user from the favorites
     *
     * @param event
     */
    public removeFavorite = (event : any) => {

        // @ts-ignore
        const {profile} = this.state;

        this.profileService.removeFavorite(profile).then((response) => {

            this.onAction('remove-from-favorite',profile);

        }).catch((error : CustomError) => {
            this.onAction('error',error);
        })


    };


    /**
     * Dislike the profile
     *
     * @param event
     */
    public disLike = (event : any = {}) => {

        // @ts-ignore
        const {profile} = this.state;

        this.setState({action: 'dislike'});

        this.profileService.disLike(profile).then(() => {
            this.onAction('dislike',profile);
        }).catch((error : CustomError) => {
            this.setState({action: null});
            this.onAction('error',error);
        })
    }


    /**
     * Render the image in the carousel
     *
     * @param params
     */
    public renderImage = (params) => {
        const { index, key } = params;

        // @ts-ignore
        const {classes} = this.props;

        // @ts-ignore
        const {profile} = this.state;

        let k = Math.abs(key);

        k = k%profile.pictures.length;

        return (
            <div key={index} className={classes.imgContainer} >
                <img className={classes.img} src={profile.pictures[k]} alt={profile.fullName} />
            </div>
        )


    }

    public render()
    {

        // @ts-ignore
        const {classes} = this.props;

        // @ts-ignore
        const {hideActions} = this.props;

        // @ts-ignore
        const {profile} = this.state;

        const {action} = this.state;


        return (
            (
                <Card className={classes.card + ' ' + classes[profile.app] + ' ' + classes[action]}>
                    <div>
                        <KBSwipeableViews
                            enableMouseEvents
                            slideRenderer={this.renderImage}
                        />
                    </div>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {profile.fullName ? ( profile.fullName  + ' , ' +  profile.age) : (profile.appId) }
                        </Typography>
                        {profile.distance ? (
                            <Typography className={classes.subtitle} color="textSecondary" gutterBottom>
                                <strong>{profile.distance}</strong>,
                            </Typography>) : '' }
                        {profile.bio ? (
                            <Typography variant="body2" color="textSecondary" component="p" dangerouslySetInnerHTML={{__html: profile.bio}} >
                            </Typography>) : ''
                        }
                    </CardContent>
                    {hideActions ? '' : (
                        <CardActions disableSpacing>
                            <IconButton aria-label="like" title="like" onClick={this.like}>
                                <FavoriteIcon />
                            </IconButton>
                            <IconButton aria-label="super Like" title="superLike" onClick={this.superLike} >
                                <GradeIcon />
                            </IconButton>
                            <IconButton aria-label="pass" title="pass" onClick={this.disLike}>
                                <CloseIcon />
                            </IconButton>
                            {
                                profile.isFavorite ?
                                    < IconButton aria-label="Favorite" title="Favorite" onClick={this.removeFavorite} >
                                        <PersonAddDisabled />
                                    </IconButton>
                                    :
                                    <IconButton aria-label="Favorite" title="Favorite" onClick={this.favorite}>
                                        <PersonAdd/>
                                    </IconButton>
                            }
                        </CardActions>
                    )}
                </Card>)
        );
    }
}

export default withStyles(useStyles)(UserCard)