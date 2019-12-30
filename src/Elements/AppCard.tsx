import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {Button} from "@material-ui/core";
import DangerButton from "./DangerButton";
import {Trans} from "react-i18next";
import ConfiguratorService from "../Services/ConfiguratorService";
import ToastService from "../Services/ToastService";
import CustomError from "../Entities/CustomError";


const useStyles = (theme : any) => ({
    card: {
        maxWidth: 345,
    },
    media: {
        height: 210,
    },
});


class AppCard extends Component
{

    public state : any = {app : {}};

    protected configuratorService : ConfiguratorService;

    constructor(props : any) {
        super(props);

        // @ts-ignore
        this.configuratorService = this.props.configuratorService;

        // @ts-ignore
        this.state = {app : this.props.app};
    }



    public disconnect = (event : any) => {

        event.preventDefault();

        const {app} : any = this.state;

        this.configuratorService.disconnect(app.app).then(() => {

            app.isConfigured = false;

            this.setState({app : app})

            this.setState({alert : { type : 'success', 'message' : 'L\'application a bien été déconnectée'}});


        }).catch((response : CustomError) => {
            this.setState({alert : { type : 'error', 'message' : response.error}});
        });


    }


    public render()
    {

        // @ts-ignore
        const {classes} = this.props;

        const {app} : any = this.state;


        let link = 'configure/' + app.app;

        return (
            <Card className={classes.card}>
                <ToastService key={Math.random()} {...{alert : this.state.alert}} />
                <CardActionArea>
                    <CardMedia
                        className={classes.media}
                        image={app.img}
                        title={ app.title }
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            { app.title }
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    {app.isConfigured ?
                        <DangerButton variant="contained" color="secondary" onClick={this.disconnect} >
                            <Trans>Déconnecter</Trans>
                        </DangerButton> :
                        <Button variant="contained" color="primary" component="a" href={link} >
                            <Trans>Configurer l'application</Trans>
                        </Button>
                    }
                </CardActions>
            </Card>
        );
    }
}

export default withStyles(useStyles)(AppCard)