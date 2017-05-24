import React from 'react';
import { HashRouter, Router, Link } from 'react-router-dom'
import AuthComponent from './auth.component.jsx';
import {
  ResponsiveDrawer,
  BodyContainer,
  ResponsiveAppBar
} from 'material-ui-responsive-drawer'
import FlatButton from 'material-ui/FlatButton';
import { Image } from 'material-ui-image'

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
      <div className="nav">
          <ResponsiveDrawer>
            <HashRouter>
              <div className="drawer">
                <Link to="/home"> 
                  <FlatButton className="drawerItem" label="HOME" />
                </Link>
                <Link to="/profile"> 
                  <FlatButton className="drawerItem" label="PROFILE" /> 
                </Link>
                <Link to="/find"> 
                  <FlatButton className="drawerItem" label="FIND" /> 
                </Link>
                <Link to="/events"> 
                  <FlatButton className="drawerItem" label="EVENTS" /> 
                </Link>
                <Link to="/group"> 
                  <FlatButton className="drawerItem" label="GROUP" /> 
                </Link>
              </div>
            </HashRouter>
          </ResponsiveDrawer>
          <BodyContainer>
            <ResponsiveAppBar
                title={'Hangin\' Hubs'}
                iconElementRight={
                  <a href={this.props.auth.id !== null ? "/logout" : "/auth/google"}> 
                    {this.props.auth.id !== null ? (<Image imageStyle={{borderRadius: '50%'}} style={{backgroundColor: 'clear', marginTop: '3pt', right: '10pt', position: 'absolute', height: '30pt', width: '30pt'}} src={this.props.auth ? this.props.auth.photo : ''}/>) : null}
                    <FlatButton className={this.props.auth.id !== null ? 'authIn' : 'auth' } label={ this.props.auth.id !== null ? "Log out" : "Log in"} />
                  </a>
                }
              />
              <div style={{marginTop: '48pt'}}>
                {this.props.children}
              </div>
          </BodyContainer>
      </div>

    );
  }
}
    	// <div className="nav">
    	// 	<HashRouter>
    	// 		<div>
		   //  		<Link to="/home"> HOME </Link>
		   //  		<Link to="/profile"> PROFILE </Link>
		   //  		<Link to="/group"> GROUPS </Link>
		   //  		<Link to="/find"> FIND </Link>
		   //  		<Link to="/events"> EVENTS </Link>
	    // 		</div>
	    // 	</HashRouter>
	    // 	<AuthComponent />
    	// </div>