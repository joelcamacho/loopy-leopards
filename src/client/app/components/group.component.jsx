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

// import helpers
import fetchHelpers from '../helpers/fetch.helper.jsx';

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
    this.sendInvitation = this.sendInvitation.bind(this);
    this.acceptRequest = this.acceptRequest.bind(this);
    this.createGroup = this.createGroup.bind(this);
    this.leaveGroup = this.leaveGroup.bind(this);
    this.getInvitations = this.getInvitations.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.acceptInvitation = this.acceptInvitation.bind(this);

    this.getGroup();
    this.getInvitations();
  }

  getGroup() {
    fetchHelpers.fetchCurrentGroupData().then(res => {
      if(typeof res.result === 'string') {
        this.props.resetGroup();
        console.log('fetchCurrentGroupData result not an object');
      } else {
        let userGroup = res.groupsBelongingTo.find(group => group._pivot_status === 'member');

        if(!userGroup) {
          this.props.resetGroup();
        } else {
          fetchHelpers.fetchGroupData(userGroup)
            .then(res => {
              res.invitees = res.members.filter(user => user._pivot_status === 'invited');
              res.requests = res.members.filter(user => user._pivot_status === 'requested');
              res.members = res.members.filter(user => user._pivot_status === 'member');

              this.props.updateGroup(res);
            })
        }
      }
    });
  }

  acceptRequest(profile) {
    console.log('accept request', profile);
    fetchHelpers.fetchAcceptGroupRequest(profile)
      .then(result => {
        this.getGroup();
        this.getInvitations();
      })
  }

  sendInvitation() {
    let phone = this.refs.inviteTextFieldPhone.getValue();
    this.refs.inviteTextFieldPhone.getInputNode().value = '';
    let group = this.props.group;
    console.log('send group invitation from', group, 'to', phone);
    fetchHelpers.fetchSendGroupInvitationToPhone(phone)
      .then(result => {
        this.getGroup();
      })
  }

  leaveGroup() {
    console.log('leave group', this.props.group);
    fetchHelpers.fetchLeaveCurrentGroup()
      .then(result => {
        this.getGroup();
        this.getInvitations();
      })
  }

  createGroup() {
    let groupName = this.refs.createTextField.getValue();
    this.refs.createTextField.getInputNode().value = '';
    fetchHelpers.fetchCreateNewGroup(groupName)
      .then(result => {
        this.getGroup();
        this.getInvitations();
      })
  }

  getInvitations() {
    fetchHelpers.fetchGroupInvitationsForCurrentUser().then(res => {
      if(typeof res.result === 'string') {
        this.props.resetInvitations();
        console.log('fetchGroupInvitationsForCurrentUser result not an object');
      } else {
        console.log('fetchGroupInvitationsForCurrentUser and got', res);
        this.props.updateInvitations(res);
      }
    });
  }

  sendRequest() {
    let groupName = this.refs.joinTextField.getValue();
    this.refs.joinTextField.getInputNode().value = '';
    console.log('send request to join group from', 'current user', 'to', groupName);
    fetchHelpers.fetchSendGroupRequestToGroupName(groupName)
      .then(res => {
        console.log('fetchSendGroupRequestToGroupName', res);
        this.getGroup();
        this.getInvitations();
      })
  }

  acceptInvitation(group) {
    console.log('accept invitation', group);
    fetchHelpers.fetchAcceptGroupInvitation(group)
      .then(res => {
        console.log('fetchAcceptGroupInvitation', res);
        this.getGroup();
        this.getInvitations();
      })
  }

  render() {
    console.log(this.props.group);
    console.log(this.props.invitations);
    console.log(this.props.requests);
    console.log(this.props.auth);

    return (
      <div>

      {!!this.props.auth.id ? (

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
                          key={!obj.phone ? 'Not Verified' : obj.phone}
                          primaryText={obj.first_name}
                          leftAvatar={<Avatar src={!!obj.photo ? obj.photo  : 'http://sites.austincc.edu/jrnl/wp-content/uploads/sites/50/2015/07/placeholder.gif'} />}
                          rightIcon={<span className="phone">{obj.phone}</span>}
                        />)) : null}
                      </List>
                      <Divider/>
                      <List>
                        <Subheader> Leave Group </Subheader>
                        <FlatButton onClick={() => this.leaveGroup()} className="addBtn" label="Leave Current Group" />
                      </List>
                    </div>
                  </Paper>
                </div>
              </div>
            </Tab>) : null }

          {!!this.props.group.name ? (
            <Tab className="tabsItem" label="Manage Members" >
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
                          <Subheader> Pending Invitations </Subheader>
                          {this.props.group.invitees && this.props.group.invitees.length > 0 ? this.props.group.invitees.map(obj => (<ListItem
                            key={!obj.phone ? 'Not Verified' : obj.phone}
                            primaryText={obj.first_name}
                            leftAvatar={<Avatar src={!!obj.photo ? obj.photo  : 'http://sites.austincc.edu/jrnl/wp-content/uploads/sites/50/2015/07/placeholder.gif'} />}
                            rightIcon={<span className="phone">{obj.phone}</span>}
                            />)) : (<ListItem primaryText={'No Pending Invitations'} />)}
                        </List>
                        <Divider/>
                        <List>
                          <Subheader> Pending Requests </Subheader>
                          {this.props.group.requests && this.props.group.requests.length > 0 ? this.props.group.requests.map(obj => (<ListItem
                            onClick={() => this.acceptRequest(obj)}
                            key={!obj.phone ? 'Not Verified' : obj.phone}
                            primaryText={obj.first_name}
                            leftAvatar={<Avatar src={!!obj.photo ? obj.photo  : 'http://sites.austincc.edu/jrnl/wp-content/uploads/sites/50/2015/07/placeholder.gif'} />}
                            rightIcon={(<ContentAdd />)}
                            />)) : (<ListItem primaryText={'No Pending Requests'}/>)}
                        </List>
                      </div>
                    </Paper>
                  </div>
              </div>
            </Tab>) : null }
          
          {!this.props.group.name ? ( 
            <Tab className="tabsItem" label="Join or Create Group">
            <div className="tabsPage">
              <div className="group">
                  <Paper className="container">
                    <div>
                      <List>
                        <Subheader> Request To Join Group </Subheader>
                        <TextField ref='joinTextField' className="add" floatingLabelText="Group Name"/>
                        <br />
                        <FlatButton onClick={() => this.sendRequest()} className="addBtn" label="Send Request" />
                      </List>
                      <Divider/>
                      <List>
                        <Subheader> Create New Group </Subheader>
                        <TextField ref='createTextField' className="add" floatingLabelText="Group Name"/>
                        <br />
                        <FlatButton onClick={() => this.createGroup()} className="addBtn" label="Create New Group" />
                      </List>
                      <Divider/>
                      <List>
                        <Subheader> Group Invitations </Subheader>
                        {this.props.invitations && this.props.invitations.length ? this.props.invitations.map(group => (<ListItem
                          onClick={() => this.acceptInvitation(group)}
                          key={group.name}
                          primaryText={group.name}
                          rightIcon={(<ContentAdd />)}
                          />)) : (<ListItem primaryText={'No Group Invitations'}/>)}
                      </List>
                    </div>
                  </Paper>
                </div>
            </div>
          </Tab>
          ) : null}
        </Tabs>

        ) : (

         <Tabs className="tabsContainer" tabItemContainerStyle={{backgroundColor: "lightslategrey", position: 'fixed', zIndex: '5'}}>

           <Tab className="tabsItem" label="Manage Group">
              <div className="tabsPage">
                <div className="group">
                    <Paper className="container">
                      <div style={{fontSize: '30pt', padding: '30pt'}}>
                        You must be authenticated to manage group!
                      </div>
                    </Paper>
                  </div>
              </div>
            </Tab>


         </Tabs>
        )
      }
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