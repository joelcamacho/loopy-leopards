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

const fakeGroupData = {
  name: 'Loopy Leopards',
  list: [
    {
      name: 'Eric Hoffman',
      photo: null,
      phone: '123-123-1234'
    },
    {
      name: 'Kimmy J',
      photo: 'https://static.seekingalpha.com/uploads/2016/4/957061_14595169907724_rId15.jpg',
      phone: '123-123-KimJ'
    },
    {
      name: 'Brendan Lim',
      photo: null,
      phone: '123-123-1243'
    },
    {
      name: 'Grace Ng',
      photo: null,
      phone: '578-123-1234'
    },
    {
      name: 'Raquel Parrado',
      photo: null,
      phone: '123-234-1234'
    }
  ],
  guests: [
    {
      name: 'Kimmy J J',
      photo: null,
      phone: '412-123-1234'
    },
    {
      name: 'Ra',
      photo: null,
      phone: '123-123-4124'
    }
  ],
  requests: [
    {
      name: 'Kimmy J Jd',
      photo: null,
      phone: '412-123-1234'
    },
    {
      name: 'Rae',
      photo: null,
      phone: '123-123-4124'
    }
  ]
}

const userInvitations = [
  'Loopy Leopards',
  'Raging Rhinos',
  'Jumping Giraffes'
]

export default class GroupPageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.group = {};
    this.user = {
      invitations: []
    }

    this.getGroup = this.getGroup.bind(this);
    this.getInvitations = this.getInvitations.bind(this);
    this.actionSendInvitation = this.actionSendInvitation.bind(this);
    this.actionLeaveGroup = this.actionLeaveGroup.bind(this);
    this.actionInviteGuest = this.actionInviteGuest.bind(this);
    this.actionAcceptRequest = this.actionAcceptRequest.bind(this);
    this.actionSendRequest = this.actionSendRequest.bind(this);
    this.actionAcceptInvitation = this.actionAcceptInvitation.bind(this);

    this.getGroup();
    this.getInvitations();
  }

  getGroup() {
    // switch this with group endpoint /api/groups
    fetch('/auth', {credentials: 'include'})
      .then(res => res.json())
      .then(res => {
        //this.group = res.result;

        //this.group = {};
        this.group = fakeGroupData;

        this.forceUpdate();
      })
  }

  getInvitations() {
    // switch this with user endpoint /api/user
    fetch('/auth', {credentials: 'include'})
      .then(res => res.json())
      .then(res => {
        //this.user = res.result;

        this.user.invitations = userInvitations;

        this.forceUpdate();
      })
  }

  actionSendInvitation() {
    // should dispatch send invitation action
    var groupInvite = { 
      name: this.refs.inviteTextFieldName.getValue(), 
      phone: this.refs.inviteTextFieldPhone.getValue(),
      group: this.group.name
    }

    this.refs.inviteTextFieldName.getInputNode().value = '';
    this.refs.inviteTextFieldPhone.getInputNode().value = '';

    console.log('should dispatch send invitation action', groupInvite);
  }

  actionLeaveGroup() {
    // should dispatch leave group action
    console.log('should dispatch leave group action', this.group.name);
  }

  actionInviteGuest(profile) {
    // should dispatch invite guest
    console.log('should dispatch invite guest', profile);
  }

  actionAcceptRequest(profile) {
    // should dispatch accept request
    console.log('should dispatch accept request', profile);
  }

  actionSendRequest() {
    // should dispatch send invitation request
    this.refs.joinTextField.getInputNode().value = '';
    console.log('should dispatch send invitation request', this.refs.joinTextField.getValue());
  }

  actionAcceptInvitation(group) {
    // should dispatch accept invitation
    console.log('should dispatch accept invitation', group);
  }

  render() {
    console.log(this.props.group);
    return (
      <div>
        <div className="group">
          <Paper className="container">
            { this.group.name ?  (
              <div>
                <h3> { this.group.name } </h3>
                <Divider/>
                <List>
                  <Subheader> Current Members </Subheader>
                  {this.group.list ? this.group.list.map(obj => (<ListItem
                    key={obj.phone}
                    primaryText={obj.name}
                    leftAvatar={<Avatar src={!!obj.photo ? obj.photo  : 'http://sites.austincc.edu/jrnl/wp-content/uploads/sites/50/2015/07/placeholder.gif'} />}
                    rightIcon={<span className="phone">{obj.phone}</span>}
                  />)) : null}
                </List>
                <Divider />
                <List>
                  <Subheader> Recent Guests </Subheader>
                  {this.group.list ? this.group.guests.map(obj => (<ListItem
                    onClick={() => this.actionInviteGuest(obj)}
                    key={obj.phone}
                    primaryText={obj.name}
                    leftAvatar={<Avatar src={!!obj.photo ? obj.photo  : 'http://sites.austincc.edu/jrnl/wp-content/uploads/sites/50/2015/07/placeholder.gif'} />}
                    rightIcon={(<ContentAdd />)}
                    />)) : null}
                  </List>
                <Divider/>
                <List>
                  <Subheader> Pending Invitation Requests </Subheader>
                  {this.group.list ? this.group.requests.map(obj => (<ListItem
                    onClick={() => this.actionAcceptRequest(obj)}
                    key={obj.phone}
                    primaryText={obj.name}
                    leftAvatar={<Avatar src={!!obj.photo ? obj.photo  : 'http://sites.austincc.edu/jrnl/wp-content/uploads/sites/50/2015/07/placeholder.gif'} />}
                    rightIcon={(<ContentAdd />)}
                    />)) : null}
                  </List>
                <Divider/>
                <List>
                  <Subheader> Invite Friends </Subheader>
                  <TextField ref='inviteTextFieldName' className="add" floatingLabelText="Name"/>
                  <TextField ref='inviteTextFieldPhone' className="add"  floatingLabelText="Phone Number"/>
                  <br />
                  <FlatButton onClick={() => this.actionSendInvitation()} className="addBtn" label="Send Invitation" />
                </List>
                <Divider/>
                <List>
                  <FlatButton onClick={() => this.actionLeaveGroup()} className="addBtn" label="Leave Current Group" />
                </List>
              </div>
            ) : (
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
                </List>
              </div>
          )}

          </Paper>
        </div>
      </div>
    );
  }
}