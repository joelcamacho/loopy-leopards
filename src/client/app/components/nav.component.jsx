import React from 'react';
import { HashRouter, Router, Link } from 'react-router-dom'
import AuthComponent from './auth.component.jsx';
import FlatButton from 'material-ui/FlatButton';
import { Image } from 'material-ui-image'
import AppBar from 'material-ui/AppBar';
import IconHome from 'material-ui/svg-icons/action/home';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Snackbar from 'material-ui/Snackbar';

// import helpers
import firebaseHelpers from '../helpers/firebase.helper.jsx';
import fetchHelpers from '../helpers/fetch.helper.jsx';

// import components
import BottomNav from '../components/bottomNav.component.jsx';

export default class NavComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);

    this.state = {
      open: false,
      message: "Event added to your calendar"
    };

    fetchHelpers.fetchGoogleProfile()
      .then(res => {
        console.log('fetchGoogleProfile', res);
        if(typeof res.result === 'string') {
          this.props.resetUser();
          this.props.resetProfile();
          return null;
        } else {
          this.props.updateUser(res.result);
          return fetchHelpers.fetchUserData();
        }
      })
      .then(res => {
        console.log('got back profile', res);
        if(!!res) {
          this.props.updateProfile(res);

          firebaseHelpers.requestPushNotificationPermissions();

          firebaseHelpers.setMessageReceivedHandler((alert) => {
            this.props.addAlert(alert);
            this.handleTouchTap(alert.body);
          })
        }
      })

  }

  handleTouchTap(message) {
    this.setState({
      open: true,
      message: message
    });
  };

  handleRequestClose() {
    this.setState({
      open: false,
      message: ''
    });
  };

  render() {
    console.log(this.props.auth);
    console.log(this.props.profile);

    return (
      <div>
        <div className="nav">
          <AppBar
            showMenuIconButton={false}
            title={<div>
              <IconHome className="homeIcon" />
              <span className="homeText"> Hangin Hubs </span>
              </div>}
            iconElementRight={
                this.props.auth.id !== null ? 
                (<div>
                  <a href="/#/profile">
                    <Image imageStyle={{borderRadius: '50%'}} style={{backgroundColor: 'clear', marginTop: '3pt', right: '40pt', position: 'absolute', height: '30pt', width: '30pt'}} src={this.props.profile ? this.props.profile.photo : ''}/>
                  </a>
                  <IconMenu iconStyle={{ fill: 'white' }} iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
                    <a className="navLink" href="/#/profile"> <MenuItem primaryText="Profile" /> </a>
                    <a className="navLink" href="/#/about"> <MenuItem primaryText="About Us" /> </a>
                    <a className="navLink" href="/logout"> <MenuItem primaryText="Sign out" /> </a>
                  </IconMenu>
                </div>
                )
                : (<IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}} >
                    <a className="navLink" href="/#/profile"> <MenuItem primaryText="Profile" /> </a>
                    <a className="navLink" href="/#/about"> <MenuItem primaryText="About Us" /> </a>
                    <a className="navLink" href="/auth/google"> <MenuItem primaryText="Sign In" /> </a>
                  </IconMenu>
                )
              }
          />
        </div>
        
        <div className="childrenContainer">
          <div className="childrenPadding">
            {this.props.children}
          </div>
        </div>

        <BottomNav />
        
        <Snackbar
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}