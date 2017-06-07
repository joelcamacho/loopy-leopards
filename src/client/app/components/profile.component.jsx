import React from 'react';
import Paper from 'material-ui/Paper';
import { Image } from 'material-ui-image'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

// import helpers
import firebaseHelpers from '../helpers/firebase.helper.jsx';
import fetchHelpers from '../helpers/fetch.helper.jsx';

export default class ProfilePageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.fetchUserData = this.fetchUserData.bind(this);
    this.sendPhoneVerificationCode = this.sendPhoneVerificationCode.bind(this);

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.fetchUserData();
  }

  handleOpen() {
    this.setState({open: true});
  }

  handleClose() {
    this.setState({open: false});
  }

  fetchUserData() {
    return fetchHelpers.fetchGoogleProfile()
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
        if(!!res) this.props.updateProfile(res);
      })
  }

  sendPhoneVerificationCode() {
    var phone = this.refs.phoneTextField.getValue();
    return fetchHelpers.fetchSendVerifyCodeToPhone(phone);
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
            address: !this.refs.addressTextField.getValue() ? this.props.profile.address : this.refs.addressTextField.getValue(),
            city: !this.refs.cityTextField.getValue() ? this.props.profile.city : this.refs.cityTextField.getValue(),
            state: !this.refs.stateTextField.getValue() ? this.props.profile.state : this.refs.stateTextField.getValue(),
            birthdate: !this.refs.birthdateTextField.getValue() ? this.props.profile.birthdate : this.refs.birthdateTextField.getValue(),
          }

          fetchHelpers.fetchUpdateUserData(profileUpdate)
          .then((res) => this.fetchUserData());

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
        { !this.props.profile.phone ? (
          <div>
            <TextField ref='phoneTextField' floatingLabelText="Phone Number"/>
            <FlatButton
              label="Send Phone Verification Code"
              primary={true}
              onTouchTap={this.sendPhoneVerificationCode}
            />
          </div>) : null}

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
            src={this.props.profile.photo ? this.props.profile.photo : 'https://openclipart.org/download/247319/abstract-user-flat-3.svg'}/>
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
