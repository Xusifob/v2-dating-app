import React, {Component} from 'react';
import {Theme, withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import TuneIcon from '@material-ui/icons/Tune';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {FormControl, IconButton, InputLabel, Link, MenuItem, Select} from "@material-ui/core";
import {Trans} from "react-i18next";
import UserProvider from "../Services/UserProvider";
import {Redirect} from 'react-router';
import PersonIcon from '@material-ui/icons/Person';
import clsx from "clsx";
import MenuIcon from '@material-ui/icons/Menu';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChatIcon from '@material-ui/icons/Chat';
import ConfiguratorService from "../Services/ConfiguratorService";
import APIService from "../Services/APIService";

interface ListItemLinkProps {
    icon?: React.ReactElement;
    primary: string;
    to: string;
}

const drawerWidth = 240;

const useStyles = (theme : Theme) => ({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    formControl: {
        color: 'white',
        borderColor: 'white',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
})


class Menu extends Component
{

    public state : any = {
        logout : false,
        open : false,
        app : null,
    };


    public userProvider : UserProvider;

    constructor(props) {
        super(props);

        this.userProvider = props.userProvider;

        this.state.app = ConfiguratorService.currentApp;

    }

    public logOut = () => {

        this.userProvider.reset();

        this.setState({logout : true});
    };


    /**
     *
     * @param evt
     */
    public handleAppChange = (evt) => {
        this.setState({app : evt.target.value});
        APIService.currentApp = evt.target.value;

    }

    /**
     *
     */
    public handleDrawerOpen = () => {
        this.setState({open : true});
    }


    /**
     *
     */
    public handleDrawerClose = () => {
        this.setState({open : false});
    }


    public render() {

        // @ts-ignore
        const {classes} = this.props;

        const { logout } = this.state;


        if (logout) {
            return <Redirect to='/'/>;
        }

        let {open} = this.state;

        let {app} = this.state;

        let apps = APIService.apps;

        return (


            <div className={classes.root}>
                <CssBaseline/>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={this.handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, open && classes.hide)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography className={classes.title} variant="h6" noWrap>
                            Dating App Manager
                        </Typography>
                        <div className={classes.search}>
                            <FormControl variant="outlined">
                                <InputLabel id="appType"
                                            className={classes.formControl}
                                >
                                    Application
                                </InputLabel>
                                <Select
                                    labelId="appType"
                                    id="appType"
                                    value={app}
                                    onChange={this.handleAppChange}
                                    className={classes.formControl}
                                >
                                    <MenuItem value="all">
                                        <em><Trans>Toutes</Trans></em>
                                    </MenuItem>
                                    {apps.map((app) => {
                                        return app.isConfigured ? (
                                            <MenuItem value={app.app} key={app.app} >
                                                <em>{app.title}</em>
                                            </MenuItem>
                                        ) : '';
                                    })
                                    }
                                </Select>
                            </FormControl>
                        </div>
                    </Toolbar>

                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="persistent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    open={open}
                    anchor="left"
                >
                    <div className={classes.toolbar}/>
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={this.handleDrawerClose}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </div>
                    <Divider/>
                    <List>
                        <ListItem component="a" href="/dashboard">
                            <ListItemIcon>
                                <DashboardIcon/>
                            </ListItemIcon>
                            <ListItemText>
                                <Trans>Tableau de Bord</Trans>
                            </ListItemText>
                        </ListItem>
                        <ListItem component="a" href="/matches/pending">
                            <ListItemIcon>
                                <FavoriteIcon/>
                            </ListItemIcon>
                            <ListItemText>
                                <Trans>Matchs en attente</Trans>
                            </ListItemText>
                        </ListItem>
                        <ListItem component="a" href="/messages">
                            <ListItemIcon>
                                <ChatIcon/>
                            </ListItemIcon>
                            <ListItemText>
                                <Trans>Messages</Trans>
                            </ListItemText>
                        </ListItem>
                        <ListItem component="a" href="/configure">
                            <ListItemIcon>
                                <TuneIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Paramétrer les applications"/>
                        </ListItem>
                        <ListItem component="a" href="/my-profile">
                            <ListItemIcon>
                                <PersonIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Mon profil"/>
                        </ListItem>
                    </List>
                    <Divider/>
                    <ListItem button onClick={this.logOut}>
                        <ListItemIcon>
                            <ExitToAppIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Se déconnecter"/>
                    </ListItem>
                </Drawer>
            </div>
        );
    }
}

// @ts-ignore
export default withStyles(useStyles)(Menu)