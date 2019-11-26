import React, { Component } from 'react';
import './App.css';

import { BrowserRouter as Router, Route, Link, Redirect, Switch } from "react-router-dom";

// Css
import CssBaseline from "@material-ui/core/CssBaseline";

// Flux
import Flux from '../flux'
import Localizes from '../flux/data/localizes.json'

import {HomePage} from '../components/HomePage';

import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import Hidden from '@material-ui/core/Hidden';

import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


import Grid from '@material-ui/core/Grid';
// card
import {Card, CardContent, CardActions} from '@material-ui/core/';

// color
import blue from '@material-ui/core/colors/blue';

// list
import {List, ListItem, ListItemIcon, ListItemText, ListItemAvatar} from '@material-ui/core/';

// icons
import MenuIcon from '@material-ui/icons/Menu';
import DialpadIcon from '@material-ui/icons/Dialpad';
import ViewAgendaIcon from '@material-ui/icons/ViewAgenda';
import HomeIcon from '@material-ui/icons/Home';
import SyncIcon from '@material-ui/icons/Sync';
import DonutSmallIcon from '@material-ui/icons/DonutSmall';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import InvertColorsIcon from '@material-ui/icons/InvertColors';
import RoomIcon from '@material-ui/icons/Room';



//
import MuiSwitch from '@material-ui/core/Switch';


const CONSTANTS = require('../flux/constants.json');
const ROOT_PATH = CONSTANTS.settings.root_path;


const styles = theme=> ({
  root: {
    display: 'flex',
    minHeight: '100%',
    minWidth: '100%'
  },
  headerBar: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    boxShadow: "none"
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: 250,
      flexShrink: 0,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'block',
    color: 'black'
  },

  drawerList: {
    width: 250,
  },

  homeCard: {
    width: "100%",
    display: "inline-block",
    marginTop: 5,
    marginBottom: 15,
    verticalAlign: "top",
  },

  homeCardWrapper: {
    columnCount: 2,
    columnGap: 20,
    padding: "0 20px",
    [theme.breakpoints.down('sm')]: {
     columnCount: 1,
   },
   toolbar: theme.mixins.toolbar,
  }
})

const theme = createMuiTheme({
  palette: {
    primary: { main: blue[500] }, // Purple and green play nicely together.
    secondary: { main: '#11cb5f' }, // This is just green.A700 as hex.
  },

  typography: { useNextVariants: true },

  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  }

});

const dark_theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: { main: blue[500] }, // Purple and green play nicely together.
    secondary: { main: '#11cb5f' }, // This is just green.A700 as hex.
  },

  typography: { useNextVariants: true },

  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  }

});

class App extends Component {
  constructor(props) {
    super(props);
    this.controller = new Flux(this.setState.bind(this));
    this.actions = this.controller.Actions;
    this.state= {
      lang: 'en',
      localizes: Localizes,
      iottalk_profile: {},
      DarkTheme: false,
      controls: {

      },
      endpoint: ''
    }
  }

  componentDidMount() {
    this.controller.start(()=> {
      console.log('background started.');
    });
  }

  toggleDrawer = (bool)=> ()=> {
    this.setState({DrawerOpened: bool});
  }

  render() {
    const {classes} = this.props;

    const sideList = (
      <List className={classes.drawerList}>
        <ListItem button>
          <ListItemText primary={'IoTtalk '+this.state.localizes[this.state.lang].remote_control} secondary={this.state.localizes[this.state.lang].device_id+ ': ' + this.state.iottalk_profile.d_name}/>
        </ListItem>
        <ListItem>
        <ListItemText primary={this.state.localizes[this.state.lang].languages} />
        <Select
          color="primary"
          value={this.state.lang} onChange={evt => {
          this.actions.updateLang(evt.target.value);
        }}>
          {Object.keys(CONSTANTS.lang2string).map(key=><MenuItem key={key} value={key}>{CONSTANTS.lang2string[key]}</MenuItem>)}
        </Select>
        </ListItem>
        <Divider />
        <Link to="/all/">
          <ListItem button>
            <ListItemIcon><HomeIcon/></ListItemIcon>
            <ListItemText primary={this.state.localizes[this.state.lang].all} />
          </ListItem>
        </Link>
        <Link to="/keypads/">
          <ListItem button>
            <ListItemIcon><DialpadIcon/></ListItemIcon>
            <ListItemText primary={this.state.localizes[this.state.lang].keypad} />
          </ListItem>
        </Link>
        <Link to="/buttons/">
          <ListItem button>
            <ListItemIcon><ViewAgendaIcon/></ListItemIcon>
            <ListItemText primary={this.state.localizes[this.state.lang].button} />
          </ListItem>
        </Link>
        <Link to="/knobs/">
          <ListItem button>
            <ListItemIcon><DonutSmallIcon/></ListItemIcon>
            <ListItemText primary={this.state.localizes[this.state.lang].knob} />
          </ListItem>
        </Link>
        <Link to="/switchs/">
          <ListItem button>
            <ListItemIcon><CheckCircleIcon/></ListItemIcon>
            <ListItemText primary={this.state.localizes[this.state.lang].switch} />
          </ListItem>
        </Link>
        <Divider />
        <ListItem button onClick={()=> {
          this.actions.updateDarktheme(!this.state.DarkTheme);
        }}>
          <ListItemIcon><InvertColorsIcon/></ListItemIcon>
          <ListItemText primary={this.state.localizes[this.state.lang].dark_theme} />
          <MuiSwitch color="primary" checked={this.state.DarkTheme} />
        </ListItem>
        <ListItem button onClick={()=> {
          this.actions.updateControls();
        }}>
          <ListItemIcon><SyncIcon/></ListItemIcon>
          <ListItemText primary={this.state.localizes[this.state.lang].update_controls} />
        </ListItem>
        <ListItem button onClick={()=> {this.setState({openEndpointSettings: this.state.endpoint})}}>
          <ListItemIcon><RoomIcon/></ListItemIcon>
          <ListItemText primary={this.state.localizes[this.state.lang].set_endpoint} secondary={'current: '+this.state.endpoint}/>
        </ListItem>
        <Dialog open={typeof(this.state.openEndpointSettings) === 'string'} onClose={()=>{this.setState({openEndpointSettings: null})}} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{this.state.localizes[this.state.lang].set_endpoint}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {this.state.localizes[this.state.lang].set_endpoint_description}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            defaultValue={this.state.endpoint}
            id="endpoint"
            onChange={(e)=> {
              this.setState({
                openEndpointSettings: e.target.value
              });
            }}
            value={this.state.openEndpointSettings}
            label={this.state.localizes[this.state.lang].url}
            type="url"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{this.setState({openEndpointSettings: null})}} color="primary">
            {this.state.localizes[this.state.lang].cancel}
          </Button>
          <Button onClick={()=>{
            this.actions.updateEndpoint(this.state.openEndpointSettings);
            this.setState({openEndpointSettings: null})
          }} color="primary">
            {this.state.localizes[this.state.lang].ok}
          </Button>
        </DialogActions>
      </Dialog>
        <Divider />
      </List>
    )

    return (
      <Router basename={ROOT_PATH}>
        <MuiThemeProvider theme={this.state.DarkTheme?dark_theme:theme}>
        <CssBaseline />
        <Route exact path={':url(.*)'} render={(props)=>{
          this.history = props.history;
          return(
            <div className={classes.root}>
              <Switch>
                <Route exact path={':url(.*)'} render={(props)=>{
                  return(
                    [
                      <Hidden smUp implementation="css">
                        <AppBar className={classes.headerBar} position="fixed">
                          <Toolbar>
                            <IconButton className={classes.menuButton} aria-label="Open drawer" onClick={this.toggleDrawer(true)}>
                              <MenuIcon />
                            </IconButton>
                          </Toolbar>
                        </AppBar>
                      </Hidden>
                      ,
                      <nav className={classes.drawer} aria-label="mailbox folders">
                        <Hidden smUp implementation="css">
                          <SwipeableDrawer
                           open={this.state.DrawerOpened}
                           onClose={this.toggleDrawer(false)}
                           onOpen={this.toggleDrawer(true)}
                           variant="temporary"
                          >
                             {sideList}
                          </SwipeableDrawer>
                        </Hidden>
                        <Hidden xsDown implementation="css">
                          <SwipeableDrawer
                            variant="permanent"
                            open
                          >
                             {sideList}
                          </SwipeableDrawer>
                        </Hidden>
                      </nav>
                      ,
                      <main className={classes.content}>
                        <div style= {{minHeight: '40px'}}/>
                        <Switch>
                          <Route exact path="/" render={() => {
                            return(<Redirect to="/all/"/>)
                          }}/>
                          <Route exact path="/all/" render={(props)=>{
                            return(
                              <HomePage localize={this.state.localizes[this.state.lang]}/>
                            );
                          }}/>
                          <Route exact path="/personal-settings/" render={(props)=>{
                            return(null
                            );
                          }}/>
                          <Route exact path="/contact-settings/" render={(props)=>{
                            return(null
                            );
                          }}/>
                          <Route exact path="/security-settings/" render={(props)=>{
                            return(null
                            );
                          }}/>
                        </Switch>
                      </main>
                    ]
                  );
                }}/>
              </Switch>
            </div>
          );
        }}/>

        </MuiThemeProvider>
      </Router>
    );
  }
}

export default withStyles(styles)(App);
