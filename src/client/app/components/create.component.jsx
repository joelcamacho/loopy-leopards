import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { HashRouter, Router, Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import TimePicker from 'material-ui/TimePicker';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Dialog from 'material-ui/Dialog';
import Avatar from 'material-ui/Avatar';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import Chip from 'material-ui/Chip';
import firebaseHelpers from '../helpers/firebase.helper.jsx';
import helpers from '../helpers/fetch.helper.jsx';

export default class CreatePageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      controlledDate: null,
      value12: null,
      commentTestValue: '',
      titleTestValue: '',
      addressTestValue: '',
      cityTestValue: '',
      stateTestValue: '',
      phoneTestValue: '',
      open: false,
      userStatus: [],
      clickUserStatus: false,
      invitedUsers: [],
      userGroupData: [],
    };

    this.handleOpen =this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSearchbar = this.handleSearchbar.bind(this);
    this.handleCommentTestValue = this.handleCommentTestValue.bind(this);
    this.handleChangeTimePicker12 = this.handleChangeTimePicker12.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    // this.backToEvents = this.backToEvents.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDeleteChip = this.handleDeleteChip.bind(this);
    this.handleTitleTestValue = this.handleTitleTestValue.bind(this);
    this.handleDescriptionTestValue = this.handleDescriptionTestValue.bind(this);
    this.handleAddressTestValue = this.handleAddressTestValue.bind(this);
    this.handleCityTestValue = this.handleCityTestValue.bind(this);
    this.handleStateTestValue = this.handleStateTestValue.bind(this);
    this.handlePhoneTestValue = this.handlePhoneTestValue.bind(this);
  }

  handleCommentTestValue (event) {
    this.setState({commentTestValue: event.target.value});
  };

  handleTitleTestValue (event) {
    this.setState({titleTestValue: event.target.value});
  }

  handleDescriptionTestValue (event) {
    this.setState({descriptionTestValue: event.target.value});
  }

  handleAddressTestValue (event) {
    this.setState({addressTestValue: event.target.value});
  }

  handleCityTestValue (event) {
    this.setState({cityTestValue: event.target.value});
  }

  handleStateTestValue (event) {
    this.setState({stateTestValue: event.target.value});
  }

  handlePhoneTestValue (event) {
    this.setState({phoneTestValue: event.target.value});
  }

  handleChangeTimePicker12 (event, date) {
    this.setState({value12: date});
  };

  handleChangeDate (event, date) {
    this.setState({controlledDate: date});
  };

  handleSubmit () {
    this.setState({open: false});
  };

  handleOpen ()  {
    this.setState({open: true});
  };

  handleClose () {
    this.state.invitedUsers = [];
    var rightIconArray = this.state.userStatus.map((ele, ind) => {
      var rObj = {};
      rObj.name = ele.name;
      rObj.rightIconDisplay = (<ContentAdd />);
      return rObj;
    })
    this.setState({userStatus: rightIconArray});
    this.setState({open: false});
  };

  getIndex (name) {
    let RIC; 
    this.state.userStatus.forEach((ele,ind) => {
      if(ele.name === name) {
        RIC = ele.rightIconDisplay
      }
    })
    return RIC;
  }

  componentDidMount() {
    let currentUserFirstName = this.props.profile.first_name || "";
    let currentUserLastName = this.props.profile.last_name || "";
    helpers.fetchUserData()
    .then(res => {
      let userStatusArray = []
      res.forEach(user => {
        if (user.first_name !== currentUserFirstName && user.last_name !== currentUserLastName) {
          var rObj = {};
          rObj.name = user.first_name + ' ' + user.last_name;
          rObj.rightIconDisplay = (<ContentAdd />);
          userStatusArray.push(rObj);
        }
      })
      this.setState({userStatus: userStatusArray});
      let userGroup = [];
      res.forEach(user => {
        if (user.first_name !== currentUserFirstName && user.last_name !== currentUserLastName) {
          var rObj = {};
          rObj.name = user.first_name + ' ' + user.last_name;
          rObj.photo = null;
          rObj.phone = user.phone || null;
          userGroup.push(rObj);
        }
      })
      this.setState({userGroupData: userGroup});
    })
  }

  handleSearchbar (event, userInput) {
    var users = [];
    !!userInput ? this.state.userGroupData.forEach(userInfo => {
      if(userInfo.name.indexOf(userInput) > -1 || userInfo.phone.indexOf(userInput) > -1) {
          users.push(userInfo)
        }
      }) : users = this.state.userGroupData;
    this.props.searchUsers(users);
  }

  handleDeleteChip (name) {
    const chipToDelete = this.state.invitedUsers.map((user) => user.name).indexOf(name);
    this.state.invitedUsers.splice(chipToDelete, 1);
    let rightIconArray = this.state.userStatus.map((ele, ind) => {
      var rObj = {};
      if (ele.name === name) {
        rObj.name = name;
        rObj.rightIconDisplay = (<ContentAdd />);
      } else {
        rObj.name = ele.name;
        rObj.rightIconDisplay = ele.rightIconDisplay;
      }
      return rObj;
    })
    this.setState({userStatus: rightIconArray});
  }

  handleClickUser (user) {
    let rightIconArray;
    let position
    rightIconArray = this.state.userStatus.map((ele, ind) => {
    var rObj = {};
      if(ele.name === user.name && ele.rightIconDisplay.type.displayName === "ContentAdd") {
        rObj.name = user.name;
        rObj.rightIconDisplay = (<ContentRemove />);
        position = ind;
      } else if (ele.name === user.name && ele.rightIconDisplay.type.displayName === "ContentRemove") {
        rObj.name = user.name;
        rObj.rightIconDisplay = (<ContentAdd />);
        position = ind;
      } else {
        rObj.name = ele.name;
        rObj.rightIconDisplay = ele.rightIconDisplay;
      }
      return rObj;
    })
    if (this.state.userStatus[position].rightIconDisplay.type.displayName === "ContentAdd") {
        this.state.invitedUsers.push({name: user.name, photo: user.photo, phone: user.phone});
    } else {
        const chipToDelete = this.state.invitedUsers.map((user) => user.name).indexOf(user.name);
        this.state.invitedUsers.splice(chipToDelete, 1);
    }
    this.setState({userStatus: rightIconArray});
  }

  handleConfirm () {
    let init = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          img: this.props.event.img,
          name: this.props.event.title || this.state.titleTestValue,
          date_Time: this.props.event.date_time,
          time: this.state.value12,
          date: this.state.controlledDate,
          description: this.props.event.description.slice(0,250) || this.state.descriptionTestValue,
          address: this.props.event.address || this.state.addressTestValue,
          city: this.props.event.city || this.state.cityTestValue,
          state: this.props.event.state || this.state.stateTestValue,
          phone: this.props.event.phone || this.state.phoneTestValue,
          latitude: this.props.event.latitude,
          longitude: this.props.event.longitude,
          comments: this.state.commentTestValue,
          url: this.props.event.url,
          creator_id: this.props.profile.id,
        }
      )
    }
    fetch('/api/events', init)
    .then(res => res.json())
    .catch(err => console.log("can not save event data: ", err))
    .then(res => {
      let usersArray = this.state.invitedUsers.map(user => {
        let rObj = {};
        rObj.first_name = user.name.split(" ")[0];
        rObj.phone = user.phone;
        return rObj;
      })
      let init = {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(
          {
            invitees: usersArray
          }
        )
      }
      let url = '/api/events/' + res.event.id + '/invite';
      fetch(url, init)
      .then(res => res.json())
      .catch(err => console.log("can not save users: ", err))
      .then(res => this.props.setStateBackToDefault({}))
    })
  }

  render() {
    const { event } = this.props;
    const { users } = this.props;
    //console.log('event: ',event)
    ///////////////////////////Dialog/////////////////////////
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
        onTouchTap={this.handleSubmit}
      />,
    ];
    const styles = {
      chip: {
        margin: 5,
      },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    };

    return (
      <div className="createContainer">
        <Paper className="container">
          {event.img !== '' ? (<img src={event.img} alt="eventImg"/>) : (<div><br/><h1>Create Your Own Event</h1><Divider/></div>)}
          {event.title !== '' ? (<List><div><Subheader>Event:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{event.title}</p></div><Divider/></List>) : (<div><TextField hintText="Hint Text" floatingLabelText="Title" onChange={this.handleTitleTestValue}/><br/></div>)}
          {event.description !== '' ? (<List><div><Subheader>Description:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{event.description.length > 100 ? event.description.slice(0,100) + '...' : event.description }{event.url ? (<a href={event.url} target="_blank">&nbsp;more details</a>) : null}</p></div><Divider/></List>) : (<div><TextField hintText="Hint Text" floatingLabelText="Description" onChange={this.handleDescriptionTestValue}/><br/></div>)}
          {event.address !== '' ? (<List><div><Subheader>Address:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{event.address}</p></div><Divider/></List>) : (<div><TextField hintText="Hint Text" floatingLabelText="Address" onChange={this.handleAddressTestValue}/><br/></div>)}
          {event.city !== '' ? (<List><div><Subheader>City:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{event.city}</p></div><Divider/></List>) : (<div><TextField hintText="Hint Text" floatingLabelText="City" onChange={this.handleCityTestValue}/><br/></div>)}
          {event.state !== '' ? (<List><div><Subheader>State:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{event.state}</p></div><Divider/></List>) : (<div><TextField hintText="Hint Text" floatingLabelText="State" onChange={this.handleStateTestValue}/><br/></div>)}
          {event.phone !== '' ? (<List><div><Subheader>Phone:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{event.phone}</p></div><Divider/></List>) : (<div><TextField hintText="Hint Text" floatingLabelText="Your phone number" onChange={this.handlePhoneTestValue}/><br/></div>)}
          {event.date_time !== undefined ? (<List><div><Subheader>Event start:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{event.date_time}</p></div><Divider/></List>) : null}
          <List>
          <div>
          <Subheader>Invite Friends</Subheader>
          <div style={styles.wrapper}>
            {
              this.state.invitedUsers.map(user => (
                <Chip
                  key={user.name} 
                  style={styles.chip}
                  onRequestDelete={() => this.handleDeleteChip(user.name)}
                >
                  <Avatar src={!!user.photo ? user.photo : 'http://sites.austincc.edu/jrnl/wp-content/uploads/sites/50/2015/07/placeholder.gif'} />
                  {user.name}
                </Chip>
              ))
            }
          </div>
          <RaisedButton label="Invite" onTouchTap={this.handleOpen} />
            
            <Dialog
              title="Invite your friends"
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose}
              autoScrollBodyContent={true}
            >
              <TextField
                hintText="Hint Text"
                floatingLabelText="Search"
                onChange={this.handleSearchbar}
              />

              <List>
                <Subheader> Current Members </Subheader>
                {
                  !!users.size ? 
                  this.state.userGroupData.map((obj, ind) => (<ListItem
                  key={obj.phone }
                  primaryText={obj.name }
                  leftAvatar={<Avatar src={!!obj.photo ? obj.photo  : 'http://sites.austincc.edu/jrnl/wp-content/uploads/sites/50/2015/07/placeholder.gif'} />}
                  rightIcon={this.state.userStatus[ind].rightIconDisplay}
                  onClick={() => this.handleClickUser(obj)}
                />)) :
                  users.map((obj, ind) => (<ListItem
                  key={!!obj.phone ? obj.phone : this.group.list.phone }
                  primaryText={!!obj.name ? obj.name : this.group.list.name }
                  leftAvatar={<Avatar src={!!obj.photo ? obj.photo  : 'http://sites.austincc.edu/jrnl/wp-content/uploads/sites/50/2015/07/placeholder.gif'} />}
                  rightIcon={this.getIndex(obj.name)}
                  onClick={() => this.handleClickUser(obj)}
                />))
                }
              </List>
            </Dialog>
          </div>
          <br/>
          <Divider/>
          </List>
          <List>
          <div>
          <Subheader>Comment</Subheader>
            <TextField
              floatingLabelText="Anything you want to say?"
              onChange={this.handleCommentTestValue}
              multiLine={true}
            />
          </div>
          </List>
          <List>
          <div>
          <Subheader>Collection Time</Subheader>
            <TimePicker
              format="ampm"
              hintText="12hr Format"
              value={this.state.value12}
              onChange={this.handleChangeTimePicker12}
            />
            <DatePicker
              hintText="Controlled Date Input"
              value={this.state.controlledDate}
              onChange={this.handleChangeDate}
            />
          </div>
          </List>
          <br/>
          <div>
            <Link to="/plans">
            <FlatButton className="drawerItem" label="Confirm" onClick={() => this.handleConfirm()}/>
            </Link>
          </div>
          <br/>
        </Paper>
      </div>
    );
  }
}