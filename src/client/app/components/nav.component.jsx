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

export default class NavComponent extends React.Component {
  constructor(props) {
    super(props);
    this.checkLoggedIn = this.checkLoggedIn.bind(this);
    this.checkLoggedIn();
  }

  checkLoggedIn() {
    fetch('/user', {credentials: 'include'})
      .then(res => res.json())
      .then(res => {
        // might need to check res.result and update photo
        if(typeof res.result === 'string') {
          this.props.resetUser();
          this.props.resetProfile();
          return;
        }
        console.log(res.result);
        res.result.photo = res.result.photos[0].value;
        this.props.updateUser(res.result);
      })
  }

  render() {
    console.log(this.props.auth);
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
                    <Image imageStyle={{borderRadius: '50%'}} style={{backgroundColor: 'clear', marginTop: '3pt', right: '40pt', position: 'absolute', height: '30pt', width: '30pt'}} src={this.props.auth ? this.props.auth.photo : ''}/>
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
        <div style={{marginTop: '48pt', backgroundColor: 'lightblue'}}>
          {this.props.children}
        </div>
      </div>
    );
  }
}