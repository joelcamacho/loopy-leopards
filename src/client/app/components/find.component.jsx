import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { HashRouter, Router, Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';

export default class FindPageComponent extends React.Component {
  constructor(props) {
    super(props);
    this.getEvent = this.getEvent.bind(this);
    this.backToEvents = this.backToEvents.bind(this);
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
        console.log("mixedEvents: ", mixedEvents);
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
    const { events } = this.props;
    const { event } = this.props;
    //console.log("state from state: ", events);
    //console.log("state from state: ", event);
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
      console.log("event: ", event)
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
            <Subheader>invite Group</Subheader>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;
                <label><input name="Group" type="checkbox" value="" />Group 01 </label> 
                <label><input name="Group" type="checkbox" value="" />Group 02 </label> 
                <label><input name="Group" type="checkbox" value="" />Group 03 </label>  
              </p>
            </div>
            <Divider/>
            </List>
            <List>
            <div>
            <Subheader>invite Friend</Subheader>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;
                <input className="drawFrame" name="chooseFriend" type="text" placeholder="Please enter a phone number"/><FlatButton className="drawerItem" label="Invent" />
              </p>
            </div>
            <Divider/>
            </List>
            <List>
            <div>
            <Subheader>Collection Time</Subheader>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;
                <select>
                  <option value="8">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
                <select>
                  <option value="00">00</option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="45">45</option>
                </select>
                <select>
                  <option value="00">am</option>
                  <option value="15">pm</option>
                </select>
                <input type="date" data-date-inline-picker="true" />
              </p>
            </div>
            <Divider/>
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