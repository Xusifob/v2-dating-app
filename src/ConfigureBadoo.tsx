import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import {Trans} from "react-i18next";
import ConfiguratorService from "./Services/ConfiguratorService";
import UserProvider from "./Services/UserProvider";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import {Redirect} from 'react-router';
import CustomError from "./Entities/CustomError";
import Profile from "./Entities/Profile";
import ToastService from "./Services/ToastService";


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
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});


class ConfigureBadoo extends Component
{

    public steps : string[] = ['Connectez-vous à votre compte', 'Confirmer le SMS'];


    public state : any = {activeStep : 0,session : '',mail : '',password : '',redirect : false};

    public configuratorService: ConfiguratorService;

    public userProvider : UserProvider;

    constructor(props) {
        super(props);

        this.configuratorService = props.configuratorService;
        this.userProvider = props.userProvider;

    }


    public setActiveStep = (step) => {

        this.setState({activeStep : step});
    };


    // Arrow fx for binding
    public handleChange = (evt : any) => {

        this.setState({ [evt.target.name]: evt.target.value });
        this.setState({alert : { type : null, 'message' : ''}})


    }



    public login = (event : any) => {

        event.preventDefault();

        this.configuratorService.login('badoo',{
            session : this.state.session
        }).then((response) => {
            this.setState({redirect : true});
            this.setActiveStep(1);
        }).catch((response : CustomError) => {
            this.setState({alert : { type : 'error', 'message' : response.error}});
        });

    }


    /**
     *
     * @param event
     */
    public validateLogin = (event : any) => {

        event.preventDefault();

        this.configuratorService.validateLogin('bumble',{
            password : this.state.session,
        }).then((response) => {
            this.userProvider.user = response;
            this.setState({redirect : true});
            this.setActiveStep(2);
        }).catch((response : CustomError) => {
            this.setState({alert : { type : 'error', 'message' : response.error}});
        });


    }

    render() {

        // @ts-ignore
        const {classes} = this.props;

        // @ts-ignore
        let {activeStep} = this.state;

        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/configure'/>;
        }



        return (
            <div className={classes.root}>
                <ToastService key={Math.random()} {...{alert : this.state.alert}} />
                <Stepper activeStep={activeStep} alternativeLabel>
                    {this.steps.map(label => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Container component="main" fixed maxWidth="xs">
                    <CssBaseline/>
                    {activeStep == 0 ?
                        <div>
                            <Typography component="h1" variant="h5">
                                <Trans>Se connecter avec Badoo</Trans>
                            </Typography>
                            <form className={classes.form} noValidate>
                                <Grid container spacing={1}>
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="mail"
                                            value={this.state.session}
                                            label="Cookie de session Badoo (s1)"
                                            onChange={this.handleChange}
                                            name="session"
                                            type="session"
                                            placeholder="s1:XXXX"
                                            autoComplete="session"
                                            autoFocus
                                        />
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={this.login}
                                >
                                    Configure
                                </Button>
                            </form>
                        </div> :
                        <div>
                            <Typography component="h1" variant="h5">
                                <Trans>Se connecter avec Badoo</Trans>
                            </Typography>
                            <form className={classes.form} noValidate>
                                <Grid container spacing={1}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="mail"
                                        value={this.state.mail}
                                        label="Adresse e-mail"
                                        onChange={this.handleChange}
                                        name="email"
                                        type="email"
                                        placeholder="adresse@email.com"
                                        autoComplete="email"
                                        autoFocus
                                    />
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="phone"
                                        value={this.state.password}
                                        label="Votre Mot de passe"
                                        onChange={this.handleChange}
                                        name="password"
                                        type="password"
                                        autoComplete="text"
                                        autoFocus
                                    />
                                </Grid>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={this.login}
                                >
                                    Configure
                                </Button>
                            </form>
                        </div>
                    }
                </Container>
            </div>
        );
    }
}

// @ts-ignore
export default withStyles(useStyles)(ConfigureBadoo)