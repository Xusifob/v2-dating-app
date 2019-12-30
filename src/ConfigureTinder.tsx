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


class ConfigureTinder extends Component
{

    public steps : string[] = ['OTP Via SMS', 'Confirmer le SMS'];


    public state : any = {activeStep : 0,phone : '',code : '',redirect : false};

    public configuratorService: ConfiguratorService;

    public userProvider : UserProvider;

    constructor(props) {
        super(props);

        this.configuratorService = props.configuratorService;
        this.userProvider = props.userProvider;

        this.state.phone = this.userProvider.user.phone;

    }


    public setActiveStep = (step) => {
        this.setState({activeStep : step});
    };


    public handleChange = ({ target: { value } }) => {

        this.resetAlert();

        value = value
            // Remove all non-digits, turn initial 33 into nothing
            .replace(/^0/, '33')
            // Stick to first 10, ignore later digits
            .slice(0, 17)
        // Add a space after any 2-digit group followed by more digits
        //  .replace(/(\d{2})(?=\d)/g, '$1 ');

        this.setState({ phone :  value })
    }



    public handleCodeChange = ({target : {value}}) => {

        this.resetAlert();

        this.setState({code : value})
    }


    protected resetAlert = () => {
        this.setState({alert : { type : null, 'message' : ''}});
    }

    public login = (event : any) => {

        event.preventDefault();

        this.configuratorService.login('tinder',{
            phone : this.state.phone
        }).then((response) => {
            this.setActiveStep(1);
        }).catch((response : CustomError) => {
            this.setState({alert : { type : 'error', 'message' : response.error}});
        });


    }


    public validateLogin = (event : any) => {

        event.preventDefault();

        this.configuratorService.validateLogin('tinder',{
            phone : this.state.phone,
            code : this.state.code,
        }).then((response) => {
            this.userProvider.user = response;
            this.setState({redirect : true});
            this.setActiveStep(1);
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
                <Container fixed component="main" maxWidth="xs">
                    <CssBaseline/>
                    {activeStep == 0 ?
                        <div>
                            <Typography component="h1" variant="h5">
                                <Trans>Se connecter avec Tinder</Trans>
                            </Typography>
                            <form className={classes.form} noValidate>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="phone"
                                    value={this.state.phone}
                                    label="Phone Number"
                                    onChange={this.handleChange}
                                    name="phone"
                                    type="tel"
                                    placeholder="+33 6 55 59 55 95"
                                    autoComplete="tel"
                                    autoFocus
                                />

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
                                <Trans>Entrez votre code OTP</Trans>
                            </Typography>
                            <form className={classes.form}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="phone"
                                    value={this.state.code}
                                    label="OTP Code"
                                    onChange={this.handleCodeChange}
                                    name="code"
                                    type="text"
                                    placeholder="069554"
                                    autoComplete="text"
                                    autoFocus
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={this.validateLogin}
                                >
                                    <Trans>Valider</Trans>
                                </Button>
                                <Grid container>
                                    <Grid item xs>
                                        <Link onClick={() => this.setActiveStep(0)} variant="body2">
                                            <Trans>Retour à l'étape précédente</Trans>
                                        </Link>
                                    </Grid>
                                </Grid>
                            </form>
                        </div>

                    }
                </Container>
            </div>
        );
    }
}

// @ts-ignore
export default withStyles(useStyles)(ConfigureTinder)