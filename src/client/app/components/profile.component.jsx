import React from 'react';
import Paper from 'material-ui/Paper';
import { Image } from 'material-ui-image'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Tabs, Tab} from 'material-ui/Tabs';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import ActionAnnouncement from 'material-ui/svg-icons/action/announcement';
import CommunicationPhone from 'material-ui/svg-icons/communication/phone';
import Divider from 'material-ui/Divider';


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
        <Tabs className="tabsContainer" tabItemContainerStyle={{backgroundColor: "lightslategrey", position: 'fixed', zIndex: '5'}}>
          <Tab className="tabsItem" label="Profile Details" >
            <div className="tabsPage">
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
            </div>
          </Tab>
          <Tab className="tabsItem" label="User Settings" >
            <div className="tabsPage">

              <Card className="profileCard">
                <CardHeader
                  title="Push Notifications"
                  subtitle="Enable or Disable Push Notifications to Current Device"
                  avatar={<ActionAnnouncement />}
                  showExpandableButton={false}
                />
                <Divider />
                <CardText>
                  <RaisedButton
                    className="notifyBtn"
                    label="Allow Notifications"
                    primary={true}
                    onTouchTap={firebaseHelpers.requestPushNotificationPermissions}
                  />
                  <RaisedButton
                    className="notifyBtn"
                    label="Block Notifications"
                    primary={true}
                    onTouchTap={firebaseHelpers.sendUnregisterToServer}
                  />
                  <RaisedButton
                    className="notifyBtn"
                    label="Send A Test Notification"
                    primary={true}
                    onTouchTap={firebaseHelpers.sendTestPushNotification}
                  />
                </CardText>
              </Card>

              <Card className="profileCard">
                <CardHeader
                  title="SMS / Text Messages"
                  subtitle="Verify your phone number and get all your event and group invitations"
                  avatar={<CommunicationPhone />}
                  showExpandableButton={false}
                />
                <Divider />
                <CardText>
                  <CardTitle title="Verify Your Phone Number" subtitle="Instructions on verifying your phone number" />
                  <ol>
                    <li>
                      <CardText>
                        Insert your phone number into the text field below in the format +1[phone number]. (e.g "+19993338080")
                      </CardText>
                    </li>
                    <li>
                      <CardText>
                        Press Send Verification Code Button. This will send a text message to the phone number provided
                      </CardText>
                    </li>
                    <li>
                      <CardText>
                        Send a reply with the verification code. It should look like 5 digits _ #. (e.g 12345_21)
                      </CardText>
                    </li>
                  </ol>
                  <Divider />
                   <CardTitle title="Send Verification Code" subtitle="Insert Phone Number"/>
                   <CardText>
                    <TextField
                      hintText="+19993338080"
                      className="notifyBtn"
                      ref='phoneTextField'
                      floatingLabelText="Phone Number"/>
                    <RaisedButton
                      className="notifyBtn"
                      label="Send Verification Code"
                      primary={true}
                      onTouchTap={this.sendPhoneVerificationCode}
                    />
                  </CardText>

                </CardText>
              </Card>

            </div>
          </Tab>
        </Tabs>



        <Dialog
          title="Edit Profile"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField className='textFields' ref='addressTextField' floatingLabelText="Address"/>
          <TextField className='textFields' ref='cityTextField' floatingLabelText="City"/>
          <TextField className='textFields' ref='stateTextField' floatingLabelText="State"/>
          <TextField className='textFields' ref='birthdateTextField' floatingLabelText="Birthday"/>
        </Dialog>

      </div>
    );
  }
}
