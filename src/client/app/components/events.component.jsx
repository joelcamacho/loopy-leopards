import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import Skycons from 'react-skycons';
import helpers from '../helpers/fetch.helper.jsx';
import { HashRouter, Router, Link } from 'react-router-dom';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    minHeight: '85vh',
    padding: '10pt',
  },
  gridList: {
    width: 727,
    overflowY: 'auto',
  },
  customContentStyle: {
    width: '100%',
    maxWidth: 'none',
  },
  googleMapStyle: {
    width: '720px',
    height: '450px',
  },
  weather: {
    width: '150px',
    height: '100px',
  }
};

export default class EventsPageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userEvents: [],
      voteStatus: false,
      eventsDays: [],
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
  }

  handleOpen (event)  {
    this.props.eventDetails(event);
  };

  componentDidMount() {
    helpers.fetchAllEventData()
    .then(res => {
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
      this.setState({eventsDays: eventsDays})
    })
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

    return (
      <div>
        <Tabs className="tabsContainer" tabItemContainerStyle={{backgroundColor: "lightslategrey", position: 'fixed', zIndex: '5'}}>
        <Tab className="tabsItem" label="Schedule" >
          <div style={styles.root}>
            <h1 style={{margin:'40 20 0 0'}}>Today</h1>
            <GridList
              cols={1}
              cellHeight={180}
              style={styles.gridList}
            >
              <Subheader>&nbsp;</Subheader>
              {this.state.userEvents.filter(event => event.date_time.slice(0,10) === today).map((event) => 
                (<Link to='/details'>
                  <GridTile
                  key={event.date_time}
                  title={event.date_time.slice(11,16)}
                  subtitle={<span><b>{event.name}</b></span>}
                  onClick={() => this.handleOpen(event)}
                >
                  {event.img? (<img src={event.img}/>) : (<img src={'https://2.bp.blogspot.com/-SvN4VSH-w9Q/WAODvBuRtOI/AAAAAAAAAUA/FpfcOM7w2pQWYMGfX4l86bRISTGD-0D2wCEw/s1600/Talking-Tables-Illuminations-Party-light-Christmas-lifestyle-Portrait.png'} />)}

                </GridTile>
                </Link>
              ))}
            </GridList>
          </div>
        </Tab>
        <Tab className="tabsItem" label="All Plans" >
          {this.state.eventsDays.map(eventdate => (
            <div style={styles.root}>
              <h1 style={{margin:'40 20 0 0'}}>{eventdate.date.slice(0,10)}</h1>
              <GridList
                cols={1}
                padding={15}
                cellHeight={180}
                style={styles.gridList}
                key={eventdate.date_time}
              >
                <Subheader>&nbsp;</Subheader>
                {eventdate.events.map(event => 
                  (<Link to='/details'>
                    <GridTile 
                    key={event.date_time}
                    title={event.date_time.slice(11,16)}
                    subtitle={<span><b>{event.name}</b></span>}
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
    </div>);
  }
}