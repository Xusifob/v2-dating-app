import React, {Component} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import {Theme, withStyles} from '@material-ui/core/styles';
import ProfileService from "./Services/ProfileService";

import {
    Card,
    Divider,
    Hidden,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText, Typography
} from "@material-ui/core";
import {Redirect} from 'react-router';
import {Trans} from "react-i18next";
import ToastService from "./Services/ToastService";
import CustomError from "./Entities/CustomError";
import DiscussionService from "./Services/DiscussionService";
import Discussion from "./Entities/Discussion";
import CardHeader from "@material-ui/core/CardHeader";
import CardActionArea from "@material-ui/core/CardActionArea";
import Avatar from "@material-ui/core/Avatar";
import Message from "./Entities/Message";
import UserCard from "./Elements/UserCard";
import TextField from "@material-ui/core/TextField";
import UserProvider from "./Services/UserProvider";
import Profile from "./Entities/Profile";


const useStyles = (theme : Theme) => ({
    root: {
        width: '100%',
        maxWidth: 500,
        backgroundColor: theme.palette.background.paper,
    },
    messagesContainer : {
        height: '80vh',
        overflow: 'auto',
        paddingTop : theme.spacing(10),
        marginTop: '-' + theme.spacing(10) + 'px',
        width: '100%'
    },
    textAreaContainer : {
        height: '20vh',
        background: '#fff',
        width: '100%'
    },
    messages : {
        height: '100vh',
        paddingTop : theme.spacing(10),
        overflow: 'auto',
   //     marginTop: '-' + theme.spacing(10) + 'px',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(2),
    },
    submit : {
        margin: theme.spacing(1, 0, 0),
        width: '30%',
        marginRight : '70%',
        display: 'flex',
    }
});





class DiscussionsView extends Component
{

    public state : any = {
        discussions : [],
        currentDiscussion : {},
        messages : [],
        currentMessage : '',
    };

    protected profileService : ProfileService;

    protected discussionService : DiscussionService;

    /**
     *
     * @param props
     */
    constructor(props : any) {
        super(props);

        this.profileService = props.profileService;
        this.discussionService = new DiscussionService();

        this.loadDiscussions();

    }

    public loadDiscussions() {
        //@ts-ignore
        this.discussionService.fetchAll().then((discussions : Discussion[]) => {

            this.setState({discussions: discussions});

        })
    }

    public loadMessages(discussion : Discussion) {
        //@ts-ignore
        this.discussionService.fetchMessages(discussion).then((messages : Message[]) => {

            this.setState({messages: messages});

        })
    }

    /**
     *
     * @param discussion
     */
    public selectDiscussion(discussion : Discussion)
    {
        this.setState({currentDiscussion : discussion});
        this.loadMessages(discussion);
    }


    public onChange = (evt : any) => {
        this.setState({ [evt.target.name]: evt.target.value });

    }

    public send = (event : any) => {
        event.preventDefault();



        let message = new Message({
            content : this.state.currentMessage,
        });

        const { currentDiscussion } = this.state;

        this.discussionService.sendMessage(currentDiscussion,message).then((message : Message) => {
            let {messages} = this.state;

            messages.push(message);

            this.setState({currentMessage : ''});

            this.setState({messages : messages})

            this.setState({alert : {type : 'success', message : 'Message envoyé'}})
        }).catch((error : CustomError) => {

            this.setState({alert : {type : 'error', message : error.error}})

        })

    }


    public render() {


        const { redirect } = this.state;

        const { discussions } = this.state;

        const { messages } = this.state;

        const { currentDiscussion } = this.state;

        // @ts-ignore
        const { classes } = this.props;

        if (redirect) {
            return <Redirect to='/configure'/>;
        }

        return (
            <div>
                <ToastService key={Math.random()} {...{alert : this.state.alert}} />
                <CssBaseline/>
                <Grid
                    container
                    spacing={2}
                >
                    <Grid className={classes.messages} container item sm={6} md={4} lg={3} xs={12} spacing={1}>

                        <List
                            className={classes.root}
                            component="nav"
                        >
                            {discussions.map((discussion : Discussion) => {
                                return (
                                    <div  key={discussion.appId} >
                                        <ListItem
                                            button
                                            onClick={() => {this.selectDiscussion(discussion)}}
                                            alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar alt={discussion.profile.fullName} src={discussion.profile.pictures[0]} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={discussion.profile.fullName}
                                                secondary={
                                                    <React.Fragment>
                                                        {discussion.messages[0].content}
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                    </div>
                                )
                            })}
                        </List>
                    </Grid>
                    {currentDiscussion.profile ? (
                        <Grid container item sm={6} md={4} lg={6} xs={12} spacing={2}
                              className={classes.messages}
                        >
                            <div className={classes.messagesContainer} >
                                {messages.map((message: Message) => {

                                    let profile;

                                    if(message.profile.appId == currentDiscussion.profile.appId) {
                                        profile = currentDiscussion.profile;
                                    } else {
                                        let user = UserProvider.getUser();
                                        profile = new Profile({
                                            fullName : user.fullName,
                                            pictures : [user.photo]
                                        });
                                    }

                                    return (
                                        <Grid item xs={12} key={message.appId}>
                                            <Card className={classes.card}>
                                                <CardHeader
                                                    avatar={
                                                        <Avatar
                                                            className={classes.avatar}
                                                            src={profile.pictures ? profile.pictures[0] : ''}
                                                        />
                                                    }

                                                    title={profile.fullName}
                                                    subheader={message.content}
                                                />
                                            </Card>
                                        </Grid>
                                    )
                                })
                                }
                            </div>
                            <div className={classes.textAreaContainer}>
                                <TextField
                                    id="currentMessage"
                                    label="Votre message"
                                    multiline
                                    rows={2}
                                    className={classes.form}
                                    name="currentMessage"
                                    value={this.state.currentMessage}
                                    onChange={this.onChange}
                                    variant="outlined"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={this.send}
                                >
                                    <Trans>Envoyer</Trans>
                                </Button>
                            </div>
                        </Grid>) : ''}
                    {currentDiscussion.profile ? (<Hidden only={['sm', 'xs']}>
                        <Grid container item sm={6} md={4} lg={3} xs={12} spacing={1}>
                            <UserCard key={currentDiscussion.profile.appId} {...{hideActions : true,profile : currentDiscussion.profile}} />
                        </Grid>
                    </Hidden>) : ''}
                </Grid>

            </div>
        );
    }
}


// @ts-ignore
export default withStyles(useStyles)(DiscussionsView)