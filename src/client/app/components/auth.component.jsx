import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { Image } from 'material-ui-image'

export default class AuthComponent extends React.Component {
  constructor(props) {
    super(props);
    
    this.isAuthenticated = false;
    this.user = null;

    this.checkLoggedIn = this.checkLoggedIn.bind(this);
    this.checkLoggedIn();
  }

  checkLoggedIn() {
    fetch('/auth', {credentials: 'include'})
      .then(res => res.json())
      .then(res => {
        this.isAuthenticated = res.result;
        this.forceUpdate();
        return this.isAuthenticated; })
      .then(res => {
        if(res) {
          fetch('/user', {credentials: 'include'})
          .then(res => res.json())
          .then(res => {
            console.log(res);
            this.user = res.result;
            this.forceUpdate();
          })
        } else {
          this.user = null;
          this.forceUpdate();
        }
      })
  }

  render() {
    return (
      <a href={this.isAuthenticated ? "/logout" : "/auth/google"}> 
        {!!this.user ? (<Image imageStyle={{borderRadius: '50%'}} style={{backgroundColor: 'clear', marginTop: '3pt', right: '10pt', position: 'absolute', height: '30pt', width: '30pt'}} src={this.user.photos ? this.user.photos[0].value : ''}/>) : null}
        <FlatButton onClick={() => this.checkLoggedIn()} className={this.isAuthenticated ? 'authIn' : 'auth' } label={ this.isAuthenticated ? "Log out" : "Log in"} />
      </a>
    );
  }
}