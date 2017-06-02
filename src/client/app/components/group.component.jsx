import React from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import ContentAdd from 'material-ui/svg-icons/content/add';
import CommunicationPhone from 'material-ui/svg-icons/communication/phone';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

export default class GroupPageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.getGroup = this.getGroup.bind(this);
    this.getInvitations = this.getInvitations.bind(this);
    this.sendInvitation = this.sendInvitation.bind(this);
    this.sendRequest = this.sendRequest.bind(this);

    this.leaveGroup = this.leaveGroup.bind(this);
    this.acceptRequest = this.acceptRequest.bind(this);
    this.acceptInvitation = this.acceptInvitation.bind(this);

    this.getGroup();
    this.getInvitations();
  }

  getGroup() {
    fetch('/api/group', {credentials: 'include'})
      .then(res => res.json())
      .then(res => {
        console.log(res);
        //this.props.updateGroup(res);
      })
  }

  getInvitations() {
    // switch this with user endpoint /api/user
    fetch('/api/group/invitations', {credentials: 'include'})
      .then(res => res.json())
      .then(res => {
        console.log(res);
        //this.props.updateInvitations(res);
      })
  }

  sendInvitation() {
    let phone = this.refs.inviteTextFieldPhone.getValue();
    this.refs.inviteTextFieldPhone.getInputNode().value = '';
    
    let group = this.props.group
    console.log('send group invitation from', group, 'to', phone);

    // fetch post to /api/group/send/invite
    // in callback
    // this.getGroup();
    // this.getInvitations();
  }

  sendRequest() {
    let groupName = this.refs.joinTextField.getValue();
    this.refs.joinTextField.getInputNode().value = '';
    
    let group = this.props.group
    console.log('send request to join group from', 'current user', 'to', groupName);

    // fetch post to /api/group/send/request
    // in callback
    // this.getGroup();
    // this.getInvitations();
  }

  leaveGroup() {
    console.log('leave group', this.props.group);

    // fetch delete to /api/group
    // in callback
    // this.getGroup();
    // this.getInvitations();
  }

  acceptInvitation(profile) {
    console.log('accept invitation', profile);

    // fetch post /api/group/invitations
    // in callback
    // this.getGroup();
    // this.getInvitations();
  }

  acceptRequest(profile) {
    console.log('accept request', profile);

    // fetch post /api/group/request
    // in callback
    // this.getGroup();
    // this.getInvitations();
  }

  render() {
    console.log(this.props.group);
    console.log(this.props.invitations);

    return (
      <div>
        <Tabs className="tabsContainer" tabItemContainerStyle={{backgroundColor: "lightslategrey", position: 'fixed', zIndex: '5'}}>
          
          {!!this.props.group.name ? (
            <Tab className="tabsItem" label="Members" >
              <div className="tabsPage">
                <div className="group">
                  <Paper className="container">
                    <div>
                      <h3> { this.props.group.name } </h3>
                      <Divider/>
                      <List>
                        <Subheader> Current Members </Subheader>
                        {this.props.group.members ? this.props.group.members.map(obj => (<ListItem
                          key={obj.phone}
                          primaryText={obj.name}
                          leftAvatar={<Avatar src={!!obj.photo ? obj.photo  : 'http://sites.austincc.edu/jrnl/wp-content/uploads/sites/50/2015/07/placeholder.gif'} />}
                          rightIcon={<span className="phone">{obj.phone}</span>}
                        />)) : null}
                      </List>
                    </div>
                  </Paper>
                </div>
              </div>
            </Tab>) : null }

          {!!this.props.group.name ? (
            <Tab className="tabsItem" label="Invite" >
              <div className="tabsPage">
                  <div className="group">
                    <Paper className="container">
                      <div>
                        <List>
                          <Subheader> Invite Friends </Subheader>
                          <TextField ref='inviteTextFieldPhone' className="add"  floatingLabelText="Phone Number"/>
                          <br />
                          <FlatButton onClick={() => this.sendInvitation()} className="addBtn" label="Send Invitation" />
                        </List>
                        <Divider/>
                        <List>
                          <Subheader> Pending Invitation Requests </Subheader>
                          {this.props.group.invited ? this.props.group.invited.map(obj => (<ListItem
                            onClick={() => this.acceptRequest(obj)}
                            key={obj.phone}
                            primaryText={obj.name}
                            leftAvatar={<Avatar src={!!obj.photo ? obj.photo  : 'http://sites.austincc.edu/jrnl/wp-content/uploads/sites/50/2015/07/placeholder.gif'} />}
                            rightIcon={(<ContentAdd />)}
                            />)) : null}
                        </List>
                      </div>
                    </Paper>
                  </div>
              </div>
            </Tab>) : null }

          {!!this.props.group.name ? (  <Tab className="tabsItem" label="Manage">
              <div className="tabsPage">
                <div className="group">
                    <Paper className="container">
                        <div>
                          <List>
                            <FlatButton onClick={() => this.leaveGroup()} className="addBtn" label="Leave Current Group" />
                          </List>
                        </div>
                    </Paper>
                  </div>
              </div>
            </Tab>) : null }
          
          {!this.props.group.name ? ( 
            <Tab className="tabsItem" label="Join Group">
            <div className="tabsPage">
              <div className="group">
                  <Paper className="container">
                    <div>
                      <List>
                        <Subheader> Join Group </Subheader>
                        <TextField ref='joinTextField' className="add" floatingLabelText="Group Name"/>
                        <br />
                        <FlatButton onClick={() => this.sendRequest()} className="addBtn" label="Send Invite Request" />
                      </List>
                      <Divider/>
                      <List>
                        <Subheader> Group Invitations </Subheader>
                        {this.props.invitations ? this.props.invitations.map(group => (<ListItem
                          onClick={() => this.acceptInvitation(group)}
                          key={group.name}
                          primaryText={group.name}
                          rightIcon={(<ContentAdd />)}
                          />)) : null}
                      </List>
                    </div>
                  </Paper>
                </div>
            </div>
          </Tab>
          ) : null}
        </Tabs>
      </div>
    );
  }
}

/* : (
<div>
  <List>
    <Subheader> Join Group </Subheader>
    <TextField ref='joinTextField' className="add" floatingLabelText="Group Name"/>
    <br />
    <FlatButton onClick={() => this.actionSendRequest()} className="addBtn" label="Send Invite Request" />
  </List>
  <Divider/>
  <List>
    <Subheader> Group Invitations </Subheader>
    {this.user.invitations ? this.user.invitations.map(group => (<ListItem
      onClick={() => this.actionAcceptInvitation(group)}
      key={group}
      primaryText={group}
      rightIcon={(<ContentAdd />)}
      />)) : null}
      */