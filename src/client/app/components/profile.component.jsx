import React from 'react';
import Paper from 'material-ui/Paper';
import { Image } from 'material-ui-image'
import FlatButton from 'material-ui/FlatButton';

export default class ProfilePageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.fetchAuthData = this.fetchAuthData.bind(this);
    this.fetchProfileData = this.fetchProfileData.bind(this);

    this.fetchAuthData();
  }

  fetchAuthData() {
    fetch('/user', {credentials: 'include'})
      .then(res => res.json())
      .then(res => {
        // might need to check res.result and update photo
        console.log(res.result);
        if(typeof res.result === 'string') return;
        this.props.updateUser(res.result);
        return res.result.id;
      })
      .then(id => {
        id ? this.fetchProfileData(id) : null;
      })
  }

  fetchProfileData(id) {
    return fetch('/api/users/' + id, {credentials: 'include'})
      .then(res => res.json())
      .then(res => {
        // might need to check res.result and update photo
        console.log(res);
        this.props.updateProfile(res);
      })
  }

  render() {
    console.log(this.props.profile, this.props.auth);

    var profileComponent = this.props.auth.id !== null ? (
      <div>
        <p> {this.props.profile.phone ? this.props.profile.phone : 'No Phone Number'} </p>
        <p> {this.props.profile.address ? this.props.profile.address + ' ' + this.props.profile.city + ' ' + this.props.profile.state : 'No Address'}</p>
        <p> {this.props.profile.birthdate ? this.props.profile.birthdate : 'No Birthday'} </p>
      </div>
    ) : (<div> 
      <p> Please log in </p>
      <a href='/auth/google'> 
        <FlatButton label="Log in with google"/>
      </a>  
     </div>);

    return (
      <div> 
        <div className="profile">
          <Paper className="container">
            <Image 
            imageStyle={{borderRadius: '50%'}} 
            style={{backgroundColor: 'clear', height: '250px', width: '250px', margin: '25px 50px'}}
            src={this.props.auth.photo ? this.props.auth.photo : 'https://openclipart.org/download/247319/abstract-user-flat-3.svg'}/>
            <h3> {this.props.profile.id ? this.props.profile.first_name + ' ' + this.props.profile.last_name : 'Anonymous User'} </h3>
            {profileComponent}
          </Paper>
        </div>
      </div>
    );
  }
}
