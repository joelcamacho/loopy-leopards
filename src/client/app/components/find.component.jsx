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
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Dialog from 'material-ui/Dialog';
import Avatar from 'material-ui/Avatar';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import Chip from 'material-ui/Chip';



export default class FindPageComponent extends React.Component {
  constructor(props) {
    super(props);
    this.getEvent = this.getEvent.bind(this);
    this.backToEvents = this.backToEvents.bind(this);

    this.state = {
      controlledDate: null,
      value12: null,
      testValue: 'Anything you want to say?',
      open: false,
      userStatus: [],
      clickUserStatus: false,
      invitedUsers: [],
      userGroupData: [],
    };

    this.handleChangeDate = (event, date) => {
      this.setState({
        controlledDate: date,
      });
    };

    this.handleChangeTimePicker12 = (event, date) => {
      this.setState({value12: date});
    };

    this.handleChangeTestValue = (event) => {
      this.setState({
        testValue: event.target.value,
      });
    };

    this.handleOpen = () => {
      this.setState({open: true});
    };

    this.handleClose = () => {
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

    this.handleSubmit = () => {
      this.setState({open: false});
    };

    //this.group = this.state.userGroupData;

    this.handleSearchbar = (event, userInput) => {
      var users = [];
      !!userInput ? this.state.userGroupData.forEach(userInfo => {
        if(userInfo.name.indexOf(userInput) > -1 || userInfo.phone.indexOf(userInput) > -1) {
          users.push(userInfo)
        }
      }) : users = this.state.userGroupData;
      //console.log("user or users: ", users);
      this.props.searchUsers(users);
    }

    this.handleClickUser = this.handleClickUser.bind(this);
    this.getIndex = this.getIndex.bind(this);
  }
  //For yelp, give NYC temply
  componentDidMount() {

    var randomNumbers = [];
    var eventsArray = [];
    var eventsbriteData;
    var eventsYelpData;
    //pick up 10 events from api
    function pickupEvents(array) {
      let length = array.length;
        for (var i = 0; i < 13; i++) {
          var randomNumber = Math.floor(Math.random()*length);
          if (randomNumbers.indexOf(randomNumber) == -1) {
            randomNumbers.push(randomNumber);
            eventsArray.push(array[randomNumber]);
          } else {
            --i;
          }
        }
    }
    //filder the events
    function getUnique(arr) {
      var unique = {};
        arr.forEach(function(a){ unique[ JSON.stringify(a) ] = 1 });
        arr= Object.keys(unique).map(function(u){return JSON.parse(u) });
        return arr
    }

    fetch('/api/eventbrite', {credentials: 'include'})
      .then(res => res.json())
      .catch(error => {
        console.log("Can not received data from Eventbrite Api!!!");
      })
      .then(res => {
        //console.log('Received data from eventbrite api', res);
        pickupEvents(res.events);
        console.log("pickup 13 events: ", eventsArray);
        var eventsbrite = eventsArray.map(event => {
          return {
            img: event.logo.original.url,
            phone: '',
            address: '',
            city: '',
            state: '',
            latitude: '',
            longitude: '',
            title: event.name.text,
            description: event.description.text,
            date_time: event.start.local,
            url: event.url,
          }
        })
        eventsbriteData = eventsbrite;
        //this.props.addEvents(eventsbrite);
      })
      .then(res => {
        let params = {
          location: "NYC",
        };
        let esc = encodeURIComponent
        let query = Object.keys(params)
                     .map(k => esc(k) + '=' + esc(params[k]))
                     .join('&');
        let url = '/api/yelp?' + query;
        return fetch(url);
      })
      .then(res => res.json())
      .catch(error => {
        console.log("Can not received data from Yelp Api!!!");
      })
      .then(res =>{
        //console.log('received data from Yelo api: ', res);
        randomNumbers = [];
        eventsArray = [];
        pickupEvents(res.businesses);
        //console.log("pickup 13 events from yelp: ", eventsArray);
        var eventsYelp = eventsArray.map(event => {
          return {
            img: event.image_url,
            title: event.name,
            phone: event.display_phone,
            address: event.location.address1,
            city: event.location.city,
            state: event.location.state,
            latitude: event.coordinates.latitude,
            longitude: event.coordinates.longitude,
            description: event.categories.map(ele => ele.title).join(", ")
          }
        })
        eventsYelpData = eventsYelp;
      })
      .then(res => {
        randomNumbers = [];
        let mixedEvents = eventsbriteData.concat(eventsYelpData);
        //do random
        let result = []
        for(var i = 0; i < 26; i++) {
          var randomNumber = Math.floor(Math.random() * 26);
          if (randomNumbers.indexOf(randomNumber) === -1) {
            result.push(mixedEvents[randomNumber]);
          } else {
            i--;
          }
        }
        console.log("result: ", result)
        this.props.addEvents(getUnique(result));
      })
      .then(res => {
        fetch('/api/users', {credentials: 'include'})
        .then(res => res.json())
        .catch(error => {
          console.log("Can not received users data from database!!!");
        })
        .then(res => {
          //console.log("user response from databases: ", res);
          let userStatusArray = res.map(user => {
            var rObj = {};
            rObj.name = user.first_name + ' ' + user.last_name;
            rObj.rightIconDisplay = (<ContentAdd />);
            return rObj;
          })
          this.setState({userStatus: userStatusArray});
          let userGroup = res.map(user => {
            var rObj = {};
            rObj.name = user.first_name + ' ' + user.last_name;
            rObj.photo = null;
            rObj.phone = user.phone;
            return rObj;
          })
          this.setState({userGroupData: userGroup});
        })
      })
  }

  getEvent (event) {
    //console.log('userStatus!!!!!!!!: ',this.state.userStatus);
    //console.log('group!!!!!!!: ', this.state.userGroupData);
    this.props.createEvent(event);
  }

  backToEvents (events) {
    this.props.addEvents(events);
    this.props.setStateBackToDefault({status: 'first'});
  }

  handleConfirm () {
    // console.log("Date: ", this.state.controlledDate);
    // console.log("testValue: ", this.state.testValue);
    // console.log("time: ", this.state.value12);
    // console.log("invitedUsers: ", this.state.invitedUsers.map(user => user.name));
    // console.log("Event info: ", this.props.event);
    // console.log("Check This: ", this.props.auth.displayName);

    let init = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        {
          //need an img
          // img: event.img,
          name: this.props.event.title,
          //2 date time! now is event time
          date_Time: this.props.event.date_time,
          // time: this.state.value12
          // date: this.state.controlledDate
          description: this.props.event.description.slice(0,250),
          address: this.props.event.address,
          city: this.props.event.city,
          state: this.props.event.state,
          phone: this.props.event.phone,
          latitude: this.props.event.latitude,
          longitude: this.props.event.longitude,
          comments: this.state.testValue,
          url: this.props.event.url,
          //creator_id: this.state.auth.displayName,
          //group_id:
          //users: this.state.invitedUsers.map(user => user.name),
        }
      )
    }

    fetch('/api/events', init)
    .then(res => res.json())
    .catch(err => console.log("can not save event data!!!!!!"))
    .then(res => {
      let usersArray = this.state.invitedUsers.map(user => {
        let rObj = {};
        rObj.first_name = user.name.split(" ")[0];
        rObj.phone = user.phone;
        return rObj;
      })
      console.log(usersArray)
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
      let url = '/api/events/' + res.id + '/invite';
      fetch(url, init)
      .then(res => res.json())
      .catch(err => console.log("can not save users !!!!!!!!!"))
      .then(res => console.log(res))
    })
  }

  handleClickUser (user) {
    console.log("searchUsers: ", user)
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
    //console.log("!!!!!!!!!!: ", this.state.invitedUsers)
    this.setState({userStatus: rightIconArray});
  }

handleRequestDelete (name) {
  const chipToDelete = this.state.invitedUsers.map((user) => user.name).indexOf(name);
  this.state.invitedUsers.splice(chipToDelete, 1);
  //console.log("invitedUser state: ", this.state.invitedUsers)
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

getIndex (name) {
  //console.log(this.state);
  let RIC; 
  this.state.userStatus.forEach((ele,ind) => {
    if(ele.name === name) {
      RIC = ele.rightIconDisplay
    }
  })
  return RIC;
}

  render() {
    const { events } = this.props;
    const { event } = this.props;
    const { users } = this.props;
    console.log("Event: ", event);
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
    /////////////////////////////////////////////////////////

    if(events.length === 0 && event.status === 'first') {
      //console.log(111)
      return (
        <p></p>
      );
    } else if (events.length > 0 && event.status === 'first') {
      //console.log(222);
      return (
        <div>
          {
            events.slice(2).map(event => {
              return (
                <div className="find">
                  <div className="eventImg"><img src={event.img} alt=""/></div>
                    <div className="info">
                        <div className="name">{event.title}</div>
                    </div>
                  <div className="btn-div">
                    <FlatButton className="drawerItem" label="DETAIL" />
                    <FlatButton className="drawerItem" label="Confirm" onClick={() => this.getEvent(event)}/>
                  </div>
                </div>
              )
            })
          }
        </div>
      ); 
    } else {
      //console.log(333)
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
        <div className="comfirm">
          <Paper className="container">
            <img src={event.img} alt="eventImg"/>
            {event.title !== '' ? (<List><div><Subheader>Event:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{event.title}</p></div><Divider/></List>) : null}
            {event.description !== '' ? (<List><div><Subheader>Description:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{event.description.length > 100 ? event.description.slice(0,100) + '...' : event.description }{event.url ? (<a href={event.url} target="_blank">&nbsp;more details</a>) : null}</p></div><Divider/></List>) : null}
            {event.address !== '' ? (<List><div><Subheader>Address:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{event.address}</p></div><Divider/></List>) : null}
            {event.city !== '' ? (<List><div><Subheader>City:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{event.city}</p></div><Divider/></List>) : null}
            {event.state !== '' ? (<List><div><Subheader>State:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{event.state}</p></div><Divider/></List>) : null}
            {event.phone !== '' ? (<List><div><Subheader>Phone:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{event.phone}</p></div><Divider/></List>) : null}
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
                    onRequestDelete={() => this.handleRequestDelete(user.name)}
                  >
                    <Avatar src={user.photo} />
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
                onChange={this.handleChangeTestValue}
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
              <FlatButton className="drawerItem" label="Back" onClick={() => this.backToEvents([])} />
              <Link to="/home">
              <FlatButton className="drawerItem" label="Confirm" onClick={() => this.handleConfirm()}/>
              </Link>
            </div>
            <br/>
          </Paper>
        </div>

      );
    }
  }
}