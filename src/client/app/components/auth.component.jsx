import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { Image } from 'material-ui-image'

export default class AuthComponent extends React.Component {
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
        console.log(res.result);
        if(typeof res.result === 'string') {
          this.props.resetUser();
          this.props.resetProfile();
          return;
        }

        this.props.updateUser(res.result);
      })
  }

  render() {
    return (
      <a href={this.props.user.id !== null ? "/logout" : "/auth/google"}> 
        {this.props.user.id !== null ? (<Image imageStyle={{borderRadius: '50%'}} style={{backgroundColor: 'clear', marginTop: '3pt', right: '10pt', position: 'absolute', height: '30pt', width: '30pt'}} src={this.user.photos ? this.user.photos[0].value : ''}/>) : null}
        <FlatButton onClick={() => this.checkLoggedIn()} className={this.isAuthenticated ? 'authIn' : 'auth' } label={ this.isAuthenticated ? "Log out" : "Log in"} />
      </a>
    );
  }
}