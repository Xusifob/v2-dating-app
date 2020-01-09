import React, {Component} from "react";
import SignInView from "./SignInView";
import SignUp from "./SignUp";
import DashBoardView from "./DashBoardView";

// @ts-ignore
import { BrowserRouter as Router,Redirect, Route, Link,Switch} from "react-router-dom";
import UserProvider from "./Services/UserProvider";
import ProfileService from "./Services/ProfileService";
import Container from "@material-ui/core/Container";
import Menu from "./Elements/Menu";
import {withStyles} from "@material-ui/core/styles";
import Configure from "./Configure";
import ConfigureTinder from "./ConfigureTinder";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import {Copyright} from "./Elements/Copyright";
import ConfiguratorService from "./Services/ConfiguratorService";
import MyProfileView from "./MyProfileView";
import ConfigureBumble from "./ConfigureBumble";
import DiscussionsView from "./DiscussionsView";
import ConfigureBadoo from "./ConfigureBadoo";
import PendingMatchesView from "./PendingMatchesView";


const useStyles = (theme : any) => ({
    container: {
        marginTop: theme.spacing(10),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
});


/**
 *
 * @constructor
 */
class App extends Component
{

    protected userProvider : UserProvider;
    protected profileService : ProfileService;
    protected configuratorService : ConfiguratorService;


    public state : any = {refresh : false};

    public refresh = () => {
        this.setState({ refresh: Math.random() });
    }

    constructor(props) {
        super(props);

        this.userProvider = new UserProvider();

        this.profileService = new ProfileService();

        this.configuratorService = new ConfiguratorService();

        this.userProvider.refresh = this.refresh;

        if(UserProvider.isLoggedIn()) {
            this.userProvider.refreshToken();
        }

    }


    render() {

        // @ts-ignore
        const {classes} = this.props;

        if (UserProvider.isLoggedIn()) {
            return (
                <div className={classes.container} >
                    <Router>
                        <Menu  {...{userProvider : this.userProvider}}/>
                        <div className={classes.mainContainer}>
                            <Switch>
                                <Route exact path="/">
                                    <Redirect to="/dashboard"/>
                                </Route>
                                <Route exact path="/configure" >
                                    <Configure {...{userProvider : this.userProvider}} />
                                </Route>
                                <Route path="/configure/tinder" >
                                    <ConfigureTinder {...{configuratorService : this.configuratorService,userProvider : this.userProvider}} />
                                </Route>
                                <Route path="/configure/bumble" >
                                    <ConfigureBumble {...{configuratorService : this.configuratorService,userProvider : this.userProvider}} />
                                </Route>
                                <Route path="/configure/badoo" >
                                    <ConfigureBadoo {...{configuratorService : this.configuratorService,userProvider : this.userProvider}} />
                                </Route>
                                <Route path="/my-profile" >
                                    <MyProfileView {...{configuratorService : this.configuratorService,userProvider : this.userProvider}} />
                                </Route>
                                <Route path="/dashboard" >
                                    <DashBoardView {...{userProvider : this.userProvider,profileService : this.profileService}} />
                                </Route>
                                <Route path="/matches/pending" >
                                    <PendingMatchesView {...{userProvider : this.userProvider,profileService : this.profileService}} />
                                </Route>
                                <Route path="/messages" >
                                    <DiscussionsView {...{profileService : this.profileService}} />
                                </Route>
                                <Route path="*" >
                                    <Redirect to="/dashboard" />
                                </Route>
                            </Switch>
                        </div>
                    </Router>
                    <Box mt={8}>
                        <Copyright/>
                    </Box>
                </div>
            )
        } else {
            return(
                <Container component="main" maxWidth="xs">
                    <CssBaseline/>
                    <Router>
                        <div className="main-route-place">
                            <Switch>
                                <Route exact path="/">
                                    <SignInView {...{userProvider : this.userProvider}} />
                                </Route>
                                <Route path="/register" >
                                    <SignUp {...{userProvider : this.userProvider}} />
                                </Route>
                                <Route path="*" >
                                    <Redirect to="/" />
                                </Route>
                            </Switch>
                        </div>
                    </Router>
                    <Box mt={8}>
                        <Copyright/>
                    </Box>
                </Container>
            )
        }
    }
}


export default  withStyles(useStyles)(App)