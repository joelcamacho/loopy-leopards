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
      this.setState({open: false});
    };

    this.group = fakeGroupData;

    this.handleSearchbar = (event, userInput) => {
      var users = [];
      !!userInput ? this.group.list.forEach(userInfo => {
        if(userInfo.name.indexOf(userInput) > -1 || userInfo.phone.indexOf(userInput) > -1) {
          users.push(userInfo)
        }
      }) : users = this.group.list;
      console.log("user or users: ", users);
      this.props.searchUsers(users);
    }
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
            date_time: event.start.local
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
        //console.log("mixedEvents: ", mixedEvents);
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
        //console.log("result: ", result)
        this.props.addEvents(getUnique(result));
      })
  }

  getEvent (event) {
    //console.log("eventsGohere: ", event);
    this.props.createEvent(event);
  }

  backToEvents (events) {
    this.props.addEvents(events);
    this.props.setStateBackToDefault({status: 'first'});
  }

  render() {
    //console.log("datas: ", this.props.events);
    //console.log("data: ", this.props.event);
    //console.log("action", this.props);
    const { events } = this.props;
    const { event } = this.props;
    const { users } = this.props;
    console.log("state from state: ", users.size);
    //console.log("state from state: ", event);
    ///////////////////////////Dialog/////////////////////////

    /////////////////////////////////////////////////////////

    if(events.length === 0 && event.status === 'first') {
      //console.log(111)
      return (
        <p></p>
      );
    } else if (events.length > 0 && event.status === 'first') {
      //console.log("Else events: ",events);
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
      return (
        <div className="comfirm">
          <Paper className="container">
            <img src={event.img} alt="eventImg"/>
            {event.title !== '' ? (<List><div><Subheader>Event:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{event.title}</p></div><Divider/></List>) : null}
            {event.description !== '' ? (<List><div><Subheader>Description:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{event.description}</p></div><Divider/></List>) : null}
            {event.address !== '' ? (<List><div><Subheader>Address:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{event.address}</p></div><Divider/></List>) : null}
            {event.city !== '' ? (<List><div><Subheader>City:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{event.city}</p></div><Divider/></List>) : null}
            {event.state !== '' ? (<List><div><Subheader>State:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{event.state}</p></div><Divider/></List>) : null}
            {event.phone !== '' ? (<List><div><Subheader>Phone:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{event.phone}</p></div><Divider/></List>) : null}
            {event.date_time !== undefined ? (<List><div><Subheader>Event start:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{event.date_time}</p></div><Divider/></List>) : null}
            <List>
            <div>
            <Subheader>Invite Friends</Subheader>
              <RaisedButton label="Invite" onTouchTap={this.handleOpen} />
              <Dialog
                title="Invite your friends"
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
                    this.group.list.map(obj => (<ListItem
                    key={obj.phone }
                    primaryText={obj.name }
                    leftAvatar={<Avatar src={!!obj.photo ? obj.photo  : 'http://sites.austincc.edu/jrnl/wp-content/uploads/sites/50/2015/07/placeholder.gif'} />}
                    rightIcon={(<ContentRemove />)}
                  />)) :
                    users.map(obj => (<ListItem
                    key={!!obj.phone ? obj.phone : this.group.list.phone }
                    primaryText={!!obj.name ? obj.name : this.group.list.name }
                    leftAvatar={<Avatar src={!!obj.photo ? obj.photo  : 'http://sites.austincc.edu/jrnl/wp-content/uploads/sites/50/2015/07/placeholder.gif'} />}
                    rightIcon={(<ContentRemove />)}
                  />))}
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
                id="text-field-controlled"
                value={this.state.testValue}
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
              <FlatButton className="drawerItem" label="Confirm" onClick={() => this.backToEvents([])}/>
              </Link>
            </div>
            <br/>
          </Paper>
        </div>

      );
    }
  }
}