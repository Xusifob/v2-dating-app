import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import {Trans} from "react-i18next";
import ConfiguratorService from "./Services/ConfiguratorService";
import UserProvider from "./Services/UserProvider";
import Grid from "@material-ui/core/Grid";
import {Checkbox, FormControlLabel} from "@material-ui/core";
import ToastService from "./Services/ToastService";
import User from "./Entities/User";
import MapComponent from "./Elements/MapComponent";
import GooglePlacesAutocomplete, {geocodeByPlaceId} from 'react-google-places-autocomplete';
import 'react-google-places-autocomplete/dist/assets/index.css';


const useStyles = (theme : any) => ({
    root: {
        width: '100%',
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(2),
    },
    title : {
        marginTop : theme.spacing(2),
        marginBottom : theme.spacing(2),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    map : {
        width: '100%',
        height: 400,
    }
});




class MyProfileView extends Component
{


    public state : any = {
        user : { settings : {}},
        location : {lat : '', lon : ''}
    };


    protected locationUpdated : boolean = false;

    public configuratorService: ConfiguratorService;

    public userProvider : UserProvider;

    constructor(props) {
        super(props);

        this.configuratorService = props.configuratorService;
        this.userProvider = props.userProvider;

        let user = this.userProvider.user;

        if(!user.phone) {
            user.phone = '';
        }

        this.state = {
            user : user,
            location : {}
        };

        this.userProvider.loadCurrentUser().then((user : User) => {

            if(!user.phone) {
                user.phone = '';
            }

            this.setState({user : user});

        })

        this.userProvider.getCurrentLocation().then((location) => {

            this.setState({location : location});

        })

    }


    // Arrow fx for binding
    public handleChange = (evt : any) => {

        let {user} = this.state;

        user[evt.target.name] = evt.target.value;

        this.setState({user : user});

    }

    // Arrow fx for binding
    public handleSettingChange = (evt : any) => {

        let {user} = this.state;

        let value = evt.target.value;

        if(evt.target.type == 'checkbox') {
            value = evt.target.checked;
        }

        user.settings[evt.target.name] = value;

        this.setState({user : user});

    }


    public loadLocationData = (selection) => {

        geocodeByPlaceId(selection.place_id).then((place) => {
            if(place[0]) {

                this.locationUpdated = true;

                this.setState({
                    location: {
                        'lat': place[0].geometry.location.lat(),
                        'lon': place[0].geometry.location.lng(),
                    }
                })
            }

        });

    }


    public submit = (evt : any) => {
        evt.preventDefault();

        if(this.locationUpdated) {
            this.userProvider.updateLocation(this.state.location).then(() => {

            });

        }

        this.userProvider.update(this.state.user).then(() => {
            this.setState({alert : {type : 'success', message : 'Votre profil a bien été mis à jour'}})
        }).catch((response) => {
            this.setState({alert : {type : 'danger', message : 'Une erreur est survenue'}})

        })

    }

    render() {

        // @ts-ignore
        const {classes} = this.props;

        const {location} = this.state;


        return (
            <div className={classes.root}>
                <ToastService key={Math.random()} {...{alert : this.state.alert}} />
                <Container fixed component="main" maxWidth="xl">
                    <CssBaseline/>
                    <form className={classes.form} >
                        <Typography component="h2" variant="h5" className={classes.title} >
                            <Trans>Vos informations personnelles</Trans>
                        </Typography>
                        <Grid container item xs={12} spacing={3}>
                            <Grid  item xs={12} sm={8} md={8} xl={6} >
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="mail"
                                    type="email"
                                    label="Email Address"
                                    name="mail"
                                    autoComplete="mail"
                                    value={this.state.user.mail}
                                    onChange={this.handleChange}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="phone"
                                    value={this.state.user.phone}
                                    label="Phone Number"
                                    onChange={this.handleChange}
                                    name="phone"
                                    type="tel"
                                    placeholder="+33 6 55 59 55 95"
                                    autoComplete="tel"
                                    autoFocus
                                />


                                <Typography component="h2" variant="h5" className={classes.title} >
                                    <Trans>Informations du Bot</Trans>
                                </Typography>

                                <div>
                                    <FormControlLabel control={<Checkbox onChange={this.handleSettingChange} checked={this.state.user.settings.startBotAuto} name="startBotAuto" />} label="Lancer le bot automatiquement au chargement de la page" />
                                    <FormControlLabel control={<Checkbox onChange={this.handleSettingChange} checked={this.state.user.settings.autoSuperLike} name="autoSuperLike" />} label="Super liker automatiquement les profils en favoris" />
                                    <FormControlLabel control={<Checkbox onChange={this.handleSettingChange} checked={this.state.user.settings.passWithoutBio} name="passWithoutBio" />} label="Dislike automatiquement les profils sans description" />
                                    <FormControlLabel control={<Checkbox onChange={this.handleSettingChange} checked={this.state.user.settings.passWithoutPicture} name="passWithoutPicture" />} label="Dislike automatiquement les profils sans photo" />
                                </div>

                                <TextField
                                    id="words-to-exclude"
                                    label="Liste de mots à exclure (1 par ligne)"
                                    multiline
                                    rows={6}
                                    className={classes.form}
                                    name="wordsToExclude"
                                    value={this.state.user.settings.wordsToExclude}
                                    onChange={this.handleSettingChange}
                                    variant="outlined"
                                />
                                <TextField
                                    id="names-to-exclude"
                                    label="Liste de prénoms à exclure (1 par ligne)"
                                    multiline
                                    rows={6}
                                    className={classes.form}
                                    name="namesToExclude"
                                    value={this.state.user.settings.namesToExclude}
                                    onChange={this.handleSettingChange}
                                    variant="outlined"
                                />

                                <Typography component="h2" variant="h5" className={classes.title} >
                                    <Trans>Votre localisation</Trans>
                                </Typography>

                                <MapComponent {... {location : location}} />

                                <div>
                                    <GooglePlacesAutocomplete
                                        onSelect={this.loadLocationData}
                                        renderInput={(props) => (
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="location"
                                                label="Votre localisation"
                                                type="text"
                                                placeholder="Votre localisation"
                                                autoComplete="text"
                                                autoFocus
                                                {...props}
                                            />
                                        )}
                                    />
                                </div>


                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={this.submit}
                                >
                                    Valider
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </div>
        );
    }
}

// @ts-ignore
export default withStyles(useStyles)(MyProfileView)