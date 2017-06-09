import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
// import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Skycons from 'react-skycons';
import helpers from '../helpers/fetch.helper.jsx';
import { HashRouter, Router, Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import CircularProgress from 'material-ui/CircularProgress';

export default class EventsPageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userEvents: [],
      voteStatus: false,
      daysWithEvents: [],
      open: false,
      eventDetails: {},
      googleMapOpen: false,
      directionButton: true,
      directionButtonShowOrHide: true,
      directionDetails: {},
      displaydirectionDetails: false,
      transportationButton: false,
      weather: '',
      temperature: '',
    }

    this.handleOpen = this.handleOpen.bind(this);
    this.handleSearchEvents = this.handleSearchEvents.bind(this);
    this.fetchEvents = this.fetchEvents.bind(this);
  }

  handleOpen (event)  {
    console.log("events components, handleOpen", event);
    this.props.updateEvent(event);
    // this.props.eventDetails(event);
  };

  fetchEvents () {
    helpers.fetchAllEventData()
    .then(res => {
      if (!res.created)  return;

      res = res.created;
      let eventsDays = [];
      res.map(event => event.voteStatus = false);
      this.setState({userEvents: res});
      res.forEach(event => eventsDays.push(event.date_time));
      eventsDays = eventsDays
      .filter((ele,ind) => eventsDays.indexOf(ele) === ind)
      .map(date => {
        let rObj = {};
        rObj.date = date;
        rObj.events = res.filter(event => event.date_time === date);
        return rObj;
      })
      this.setState({daysWithEvents: eventsDays});
      this.props.createdEvents(eventsDays);
    })
  }

  componentDidMount() {
    this.fetchEvents();
  }

  handleSearchEvents (event, userInput) {
    let searchEventsDays;
    if (!!userInput) {
      searchEventsDays = this.state.daysWithEvents
      .map(userEvents => 
        userEvents.events.filter(event => 
        event.name.toLowerCase().indexOf(userInput.toLowerCase()) > -1 
      ))
      let result = []
      for (var i = 0; i < searchEventsDays.length; i++) {
        if (searchEventsDays[i].length !== 0) {
          result.push({date: this.state.daysWithEvents[i].date, events: searchEventsDays[i]});
        } else {
          continue;
        }
      }
      console.log("user input: ", userInput);
      console.log("search Result: ", result);
      this.props.createdEvents(result);
    } else {
      this.fetchEvents();
    }
  } 

  render() {
    let date = new Date();
    let today = date.toLocaleDateString();
    today = today.split("/");
    let month = today[0];
    let day = today[1];
    let year = today[2];
    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }
    today = year + '-' + month + '-' + day;
    return !!this.props.profile.id ?
      (
        <div>
              <Tabs className="tabsContainer" inkBarStyle={{background: '#D7CCC8', zIndex: '6', position: 'fixed'}} tabItemContainerStyle={{position: 'fixed', zIndex: '5'}}>
                <Tab className="tabsItem" label="Today" >
                  <div className='root'>
                    <h1 style={{margin:'40 20 0 0'}}>Your Events for the Day</h1>
                    <GridList
                      cols={2}
                      cellHeight={180}
                      className='gridList'
                    >
                      <Subheader>&nbsp;</Subheader>
                      {this.state.userEvents.filter(event => event.date_time.slice(0,10) === today).map((event) => 
                        (<Link to='/details'>
                          <GridTile
                          key={event.date_time}
                          title={event.date_time.slice(11,16)}
                          subtitle={<span><b>{event.name}</b></span>}
                          onClick={() => this.handleOpen(event)}
                          actionIcon={<span><b style={{color: "white"}}>{event.status}</b></span>}
                        >
                          {event.img? (<img src={event.img}/>) : (<img src={'https://2.bp.blogspot.com/-SvN4VSH-w9Q/WAODvBuRtOI/AAAAAAAAAUA/FpfcOM7w2pQWYMGfX4l86bRISTGD-0D2wCEw/s1600/Talking-Tables-Illuminations-Party-light-Christmas-lifestyle-Portrait.png'} />)}
                        </GridTile>
                        </Link>
                      ))}
                    </GridList>
                  </div>
                </Tab>
                <Tab className="tabsItem" label="All Plans" >
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <TextField
                    hintText="Name of Event"
                    floatingLabelText="Filter Events:"
                    onChange={this.handleSearchEvents}
                  />
                    
                  {this.props.createdEventsData.sort((a,b) => {
                    return new Date(a.date) - new Date(b.date)
                  })
                  .map(event => {
                    event.events = event.events.filter(ev => ev.status === "active" || ev.status === "suggested");
                    return event;
                  })
                  .filter(event => {
                    return new Date(event.date) >= date;
                  })
                  .map(eventdate => (
                    <div className='root'>
                      
                      <GridList
                        cols={2}
                        cellHeight={180}
                        className='gridList'
                        key={eventdate.date_time}
                      >
                        <Subheader style={{color: "white"}}>{eventdate.date.slice(0,10)}</Subheader>
                        {eventdate.events.map(event => 
                          (<Link to='/details'>
                            <GridTile 
                            key={event.date_time}
                            title={event.date_time.slice(11,16)}
                            subtitle={<span><b>{event.name}</b></span>}
                            actionIcon={<span><b style={{color: "white"}}>{event.status}</b></span>}
                          >
                            {event.img ? (<img onClick={() => this.handleOpen(event)} src={event.img} />) : (<img onClick={() => this.handleOpen(event)} src={'https://2.bp.blogspot.com/-SvN4VSH-w9Q/WAODvBuRtOI/AAAAAAAAAUA/FpfcOM7w2pQWYMGfX4l86bRISTGD-0D2wCEw/s1600/Talking-Tables-Illuminations-Party-light-Christmas-lifestyle-Portrait.png'} />)}
                          </GridTile>
                          </Link>
                        ))}
                      </GridList>
                    </div>
                  ))}
                </Tab>
              </Tabs>
        </div>
      )
      : 
      (
        <div className="alertsContainer">
            <h2 className="alertsTitle"> Plans </h2>
            <div className="group">
                <Paper className="groupAuth">
                  <div> Please Sign In With Google To See Your Events Plans </div>
                  <br />
                  <a className="add" href="/#/profile">
                    <RaisedButton
                      labelColor="white"
                      backgroundColor="#009688"
                      className="add"
                      label="Go To Profile"
                    />
                  </a>
                  </Paper>
              </div>
          </div>
        )
  }
}