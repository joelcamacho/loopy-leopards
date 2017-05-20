import React from 'react';
import { HashRouter, Router, Link } from 'react-router-dom'
import AuthComponent from './auth.component.jsx';

export default class NavComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    	<div>
    		<HashRouter>
    			<div>
		    		<Link to="/home"> HOME </Link>
		    		<Link to="/profile"> PROFILE </Link>
		    		<Link to="/group"> GROUPS </Link>
		    		<Link to="/find"> FIND </Link>
		    		<Link to="/events"> EVENTS </Link>
	    		</div>
	    	</HashRouter>
	    	<AuthComponent />
    	</div>
    );
  }
}