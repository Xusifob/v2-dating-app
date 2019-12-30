import React, {Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import {Trans} from "react-i18next";
import UserProvider from "./Services/UserProvider";
import {Redirect} from 'react-router';


const useStyles = (theme : any) => ({
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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

class SignUp extends Component
{

    protected userProvider : UserProvider;


    public state : any = {
        mail : '',
        password : '',
        redirect : false,
    };


    constructor(props) {
        super(props);

        this.userProvider = props.userProvider;

    }



    // Arrow fx for binding
    public handleChange = (evt : any) => {

        this.setState({ [evt.target.name]: evt.target.value });

    }

    public signUp = (event : any) => {

        event.preventDefault();

        this.userProvider.register(this.state).then(() => {
            this.userProvider.login({
                username : this.state.mail,
                password : this.state.password
            }).then(() => {
                this.setState({ redirect: true })
            })
        })

    }


    public render() {

        // @ts-ignore
        const {classes} = this.props;

        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/configure'/>;
        }

        return (
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    <Trans>Inscription</Trans>
                </Typography>
                <form className={classes.form}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="mail"
                                type="email"
                                label="Email Address"
                                name="mail"
                                autoComplete="mail"
                                value={this.state.mail}
                                onChange={this.handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={this.state.password}
                                onChange={this.handleChange}
                                autoComplete="current-password"
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={this.signUp}
                    >
                        <Trans>S'inscrire</Trans>
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/" variant="body2">
                                <Trans>Vous avez déjà un compte ? Se connecter</Trans>
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        );
    }
}


// @ts-ignore
export default withStyles(useStyles)(SignUp)
