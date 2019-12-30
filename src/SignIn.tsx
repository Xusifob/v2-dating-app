import React, {Component} from "react";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import UserProvider from "./Services/UserProvider";
import { withTranslation } from 'react-i18next';
import {Redirect} from 'react-router';
import ToastService from "./Services/ToastService";
import Card from "@material-ui/core/Card";

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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});


class SignIn extends Component
{


    public state : any = {
        username : '',
        password : '',
        redirect : false,
    };


    public userProvider : UserProvider;

    constructor(props : any) {
        super(props);

        this.userProvider = props.userProvider

    }


    // Arrow fx for binding
    public login = (event : any) => {

        event.preventDefault();

        this.userProvider.login(this.state).then(() => {

            this.setState({ redirect: true });

        }).catch((response : any) => {

            this.setState({alert : { type : 'error', 'message' : response.error}})
        })

    }


    // Arrow fx for binding
    public handleChange = (evt : any) => {

        this.setState({alert : { type : null, 'message' : ''}})
        this.setState({ [evt.target.name]: evt.target.value });

    }


    /**
     *
     * @return {*}
     */
    render()
    {

        // @ts-ignore
        const {classes} = this.props;

        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/dashboard'/>;
        }

        return (
            <div className={classes.paper}>
                <ToastService key={Math.random()} {...{alert : this.state.alert}} />

                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Email Address"
                        value={this.state.username}
                        onChange={this.handleChange}
                        name="username"
                        type="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        value={this.state.password}
                        name="password"
                        label="Password"
                        onChange={this.handleChange}
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={this.login}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/register" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        );
    }
}

// @ts-ignore
export default withTranslation()(withStyles(useStyles)(SignIn))

