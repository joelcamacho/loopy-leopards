import React from 'react';
import { HashRouter, Router, Link } from 'react-router-dom'
import AuthComponent from './auth.component.jsx';
import {
  ResponsiveDrawer,
  BodyContainer,
  ResponsiveAppBar
} from 'material-ui-responsive-drawer'
import FlatButton from 'material-ui/FlatButton';


export default class NavComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
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
                iconElementRight={<AuthComponent />}
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