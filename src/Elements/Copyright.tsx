import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import React, {Component} from "react";

export class Copyright extends  Component {

    render() {
        return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://www.bastienmalahieude.fr/">
                Bastien Malahieude
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
        )
    }
}