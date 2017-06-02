import React from 'react';
import Paper from 'material-ui/Paper';
import { Image } from 'material-ui-image'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

// import helpers
import firebaseHelpers from '../helpers/firebase.helper.jsx';


export default class ProfilePageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.handleOpen = () => {
      this.setState({open: true});
    };

    this.handleClose = () => {
      this.setState({open: false});
    };

    firebaseHelpers.setMessageReceivedHandler((alert) => {
      this.props.addAlert(alert);
    })

    this.fetchAuthData = this.fetchAuthData.bind(this);
    this.fetchProfileData = this.fetchProfileData.bind(this);
    this.sendPhoneVerificationCode = this.sendPhoneVerificationCode.bind(this);

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
    //this.sendAuthPhone();
    //this.test();
    return fetch('/api/user', {credentials: 'include'})
      .then(res => res.json())
      .then(res => {
        // might need to check res.result and update photo
        console.log('got back profile', res);
        this.props.updateProfile(res);
      })
  }

  sendAuthPhone() {
    // var phone = '+16466411017';
    var phone = '+19734879888';
    
    return fetch('/api/twilio/phone', { method: 'POST', 
      body: JSON.stringify({phone:phone}),
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },});
  }

  sendPhoneVerificationCode() {
    var phone = this.refs.phoneTextField.getValue();
    return fetch('/api/twilio/phone', { method: 'POST', 
      body: JSON.stringify({phone:phone}),
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },});
  }

  test() {
    return fetch('/api/user', { method: 'PUT', 
      body: JSON.stringify({first_name:'Billy'}),
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },});
  }

  render() {
    console.log(this.props.profile, this.props.auth);

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={() => {
          this.handleClose();
          // send update request
          var profileUpdate = { 
            phone: this.props.profile.phone,
            address: !this.refs.addressTextField.getValue() ? this.props.profile.address : this.refs.addressTextField.getValue(),
            city: !this.refs.cityTextField.getValue() ? this.props.profile.city : this.refs.cityTextField.getValue(),
            state: !this.refs.stateTextField.getValue() ? this.props.profile.state : this.refs.stateTextField.getValue(),
            birthdate: !this.refs.birthdateTextField.getValue() ? this.props.profile.birthdate : this.refs.birthdateTextField.getValue(),
          }

          fetch("/api/users/" + this.props.profile.id,
          {
              method: "PUT",
              body: JSON.stringify(profileUpdate),
              credentials: 'include',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
          }).then((res) => this.fetchAuthData())

        }}
      />,
    ];

    var profileComponent = this.props.auth.id !== null ? (
      <div>
        <p> {this.props.profile.phone ? this.props.profile.phone : 'No Phone Number'} </p>
        <p> {this.props.profile.address ? this.props.profile.address + ' ' + this.props.profile.city + ' ' + this.props.profile.state : 'No Address'}</p>
        <p> {this.props.profile.birthdate ? this.props.profile.birthdate : 'No Birthday'} </p>
        <FlatButton
          label="Get Notifications"
          primary={true}
          onTouchTap={firebaseHelpers.requestPushNotificationPermissions}
        />
        <FlatButton
          label="Stop Notifications"
          primary={true}
          onTouchTap={firebaseHelpers.sendUnregisterToServer}
        />
        <FlatButton
          label="Send Test Notifications (check console)"
          primary={true}
          onTouchTap={firebaseHelpers.sendTestPushNotification}
        />
        <TextField ref='phoneTextField' floatingLabelText="Phone Number"/>
        <FlatButton
          label="Send Phone Verification Code"
          primary={true}
          onTouchTap={this.sendPhoneVerificationCode}
        />
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
            <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
              {this.props.profile.id ? <FlatButton onTouchTap={this.handleOpen} label="Edit"/> : null}
            </div>
            <Image 
            imageStyle={{borderRadius: '50%'}} 
            style={{backgroundColor: 'clear', height: '250px', width: '250px', margin: '25px 50px'}}
            src={this.props.auth.photo ? this.props.auth.photo : 'https://openclipart.org/download/247319/abstract-user-flat-3.svg'}/>
            <h3> {this.props.profile.id ? this.props.profile.first_name + ' ' + this.props.profile.last_name : 'Anonymous User'} </h3>
            {profileComponent}
          </Paper>
        </div>
        <Dialog
          title="Edit Profile"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField ref='addressTextField' floatingLabelText="Address"/>
          <TextField ref='cityTextField' floatingLabelText="City"/>
          <TextField ref='stateTextField' floatingLabelText="State"/>
          <TextField ref='birthdateTextField' floatingLabelText="Birthday"/>
        </Dialog>
      </div>
    );
  }
}
