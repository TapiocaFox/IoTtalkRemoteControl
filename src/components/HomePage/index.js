import React, { Component } from 'react';

import { Link } from "react-router-dom";

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';

// card
import {Card, CardContent, CardActions} from '@material-ui/core/';
import {List, ListItem, ListItemIcon, ListItemText, ListSubheader} from '@material-ui/core/';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';

import PersonIcon from '@material-ui/icons/Person';
import CodeIcon from '@material-ui/icons/Code';
import LocalPhoneIcon from '@material-ui/icons/LocalPhone';


const useStyles = makeStyles({
  avatar: {
    marginBottom: 20,
    width: 70,
    height: 70,
  },
  card: {
    marginBottom: 20,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function HomePage(props) {
  const classes = useStyles();
  return(
      <Grid container justify="center" alignItems="center" spacing={5}>
        <Grid item xs={11}>
          <Typography  variant="h4" component="h2">
            {'IoTtalk '+props.localize.remote_control}
          </Typography>
          <Typography  variant="p" component="p">
            {"Welcome to IoTtalk remote control. You can manage all of your controls in this page."}
          </Typography>
        </Grid>
        <Grid item xs={11}>
        <Card className={classes.card}>
          <CardContent>
            <Typography  variant="h5" component="h2">
              {capitalize(props.localize.quick_access)}
            </Typography>
          </CardContent>
          <CardActions>

          </CardActions>
        </Card>
          <Card className={classes.card}>
            <CardContent>
              <Typography  variant="h5" component="h2">
                {capitalize(props.localize.keypads)}
              </Typography>
            </CardContent>
            <CardActions>

            </CardActions>
          </Card>
        </Grid>
      </Grid>
  )
};
