import React , {Component} from "react";
import {IconButton, makeStyles, Snackbar, SnackbarContent, Theme} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close"
import CheckCircleIcon from "@material-ui/icons/CheckCircle"
import WarningIcon from "@material-ui/icons/Warning"
import ErrorIcon from "@material-ui/icons/Error"
import InfoIcon from "@material-ui/icons/Info"
import {amber, green} from "@material-ui/core/colors";
import clsx from "clsx";

/**
 *
 */
export default class ToastService extends Component
{

    public variant : string = 'success';

    public state : any = {message : '' , variant : 'success', open : false };


    public constructor(props) {
        super(props);

        if(props.alert) {
            this.state ={
                message: props.alert.message,
                variant: props.alert.type ? props.alert.type : 'success',
                open: props.alert.type ? true : false,
            }
        }

    }


    /**
     *
     * @deprecated
     * @param message
     */
    public set success(message : string)
    {
        //@void
    }

    /**
     * @deprecated
     * @param message
     */
    public set error(message : string)
    {

    }


    public handleClose = (event : any = null) => {
        this.setState({message : ''});
        this.setState({type : null});
        this.setState({open : false});
    }


    /**
     *
     */
    public render()
    {

        //@ts-ignore
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={this.state.open}
                autoHideDuration={6000}
                onClose={this.handleClose}
            >
                <MySnackbarContentWrapper
                    onClose={this.handleClose}
                    variant={this.state.variant}
                    message={this.state.message}
                />
            </Snackbar>
        )
    }

}


const useStyles1 = makeStyles((theme: Theme) => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.main,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
}));

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

function MySnackbarContentWrapper(props: any) {
    //@ts-ignore
    const classes = useStyles1(props);
    const { className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={clsx(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
                    {message}
        </span>
            }
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
            {...other}
        />
    );
}