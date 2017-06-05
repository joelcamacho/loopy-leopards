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
  }
};

const fakeEvents = [
  {
    img: 'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F16579431%2F145182189853%2F1%2Foriginal.jpg?s=1e0dad5ec9b6b0bf86d48945bc23b5bd',
    name: "title01",
    date_Time: '6/3/2017 13:25:15',
    time: '13:25:15',
    date: '6/3/2017',
    description: 'Hello World!',
    address: '100 3rd Ave',
    city: 'NY',
    state: 'NY',
    phone: '6466210000',
    latitude: '',
    longitude: '',
    comments: 'Let\'s GO!!!',
    url: "www.google.com",
    creator_id: 1,
    vote_count: 5,
  },
  {
    img: 'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F30676000%2F25399112885%2F1%2Foriginal.jpg?s=aad7d5822407c610ad5a604bc9a55a98',
    name: "title02",
    date_Time: '6/3/2017 13:25:15',
    time: '14:25:15',
    date: '6/3/2017',
    description: 'Hello World!',
    address: '100 3rd Ave',
    city: 'NY',
    state: 'NY',
    phone: '6466210000',
    latitude: '',
    longitude: '',
    comments: 'Let\'s GO!!!',
    url: "www.google.com",
    creator_id: 1,
    vote_count: 6,
  },
  {
    img: 'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F16579431%2F145182189853%2F1%2Foriginal.jpg?s=1e0dad5ec9b6b0bf86d48945bc23b5bd',
    name: "title03",
    date_Time: '6/3/2017 13:25:15',
    time: '15:25:15',
    date: '6/3/2017',
    description: 'Hello World!',
    address: '100 3rd Ave',
    city: 'NY',
    state: 'NY',
    phone: '6466210000',
    latitude: '',
    longitude: '',
    comments: 'Let\'s GO!!!',
    url: "www.google.com",
    creator_id: 1,
    vote_count: 7,
  },
  {
    img: 'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F30676000%2F25399112885%2F1%2Foriginal.jpg?s=aad7d5822407c610ad5a604bc9a55a98',
    name: "title04",
    date_Time: '6/4/2017 13:25:15',
    time: '16:25:15',
    date: '6/4/2017',
    description: 'Hello World!',
    address: '100 3rd Ave',
    city: 'NY',
    state: 'NY',
    phone: '6466210000',
    latitude: '',
    longitude: '',
    comments: 'Let\'s GO!!!',
    url: "www.google.com",
    creator_id: 1,
    vote_count: 8,
  },
  {
    img: 'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F16579431%2F145182189853%2F1%2Foriginal.jpg?s=1e0dad5ec9b6b0bf86d48945bc23b5bd',
    name: "title05",
    date_Time: '6/5/2017 13:25:15',
    time: '17:25:15',
    date: '6/5/2017',
    description: 'Hello World!',
    address: '100 3rd Ave',
    city: 'NY',
    state: 'NY',
    phone: '6466210000',
    latitude: '',
    longitude: '',
    comments: 'Let\'s GO!!!',
    url: "www.google.com",
    creator_id: 1,
    vote_count: 9,
  }
]


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
    }

    this.handleVote = this.handleVote.bind(this);
    // this.handleEventClick = this.handleEventClick.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleGoogleMapOpen = this.handleGoogleMapOpen.bind(this);
    this.handleGoogleMapClose = this.handleGoogleMapClose.bind(this);
    this.handleGetDirection = this.handleGetDirection.bind(this);
  }

  handleOpen (event)  {
    console.log(event);
    this.setState({eventDetails: event})
    this.setState({open: true});
  };

  handleClose () {
    // this.state.invitedUsers = [];
    // var rightIconArray = this.state.userStatus.map((ele, ind) => {
    //   var rObj = {};
    //   rObj.name = ele.name;
    //   rObj.rightIconDisplay = (<ContentAdd />);
    //   return rObj;
    // })
    // this.setState({userStatus: rightIconArray});
    this.setState({open: false});
  };

  handleGoogleMapOpen (event) {
    let init = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({address: event.address})
    }
    fetch('/api/latlngMap', init)
    .then(res => res.json())
    .catch(err => console.log("can not get latlng code: ", err))
    .then(res => {
      const coords = res.results[0].geometry.location;
      //const latlng = new google.maps.LatLng(coords.latitude, coords.longitude); 
        const myOptions = { 
          zoom: 14, 
          center: coords,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        }; 
        const map = new google.maps.Map(document.getElementById("map"), myOptions); 
        const marker = new google.maps.Marker({ 
          position: coords, 
          map: map,
        }); 
        const infoWindow = new google.maps.InfoWindow({ 
          content: event.name,
        }); 
        infoWindow.open(map, marker); 
        this.setState({directionButton: false})
    })
    this.setState({googleMapOpen: true});
  }

  handleGoogleMapClose () {
    this.setState({directionButtonShowOrHide: true});
    this.setState({googleMapOpen: false});
  }

  handleGetDirection (event) {
    let currentAddress;
    let directionsService;
    let directionsDisplay;
    let originAddress;
    let that;
    that = this
    that.setState({directionButton: true})
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();

    

    if (navigator.geolocation) { 
        navigator.geolocation.getCurrentPosition(function (position) { 
          var coords = position.coords;
          const latlng = new google.maps.LatLng(coords.latitude, coords.longitude);  
          let init = {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({latlngCode: {lat: coords.latitude, lng: coords.longitude}})
          }
          fetch('/api/addressMap', init)
          .then(res => res.json())
          .catch(err => console.log("can not save event data: ", err))
          .then(res => {
            currentAddress = res.results[0].formatted_address;
            var mapOptions = {
              zoom: 7,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              center: latlng
            }
            const map = new google.maps.Map(document.getElementById("map"), mapOptions);
            directionsDisplay.setMap(map);
            return currentAddress;
          })
          .then(function(currentAddress) {
            var request = {
              origin: currentAddress,
              destination: event.address,
              travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function(response, status) {
              if(status === 'OK') {
                directionsDisplay.setDirections(response);
              }
            });
            that.setState({directionButtonShowOrHide: false});
            return currentAddress;
          })
        }
      )
    }
  }




  // handleEventClick () {
  //   console.log("Hello World!")
  // }

  handleVote (event) {
    let newUserEvents = []
    console.log(event.voteStatus)
    if (!event.voteStatus) {
      ++event.vote_count;
      event.voteStatus = true;
    } else {
      --event.vote_count;
      event.voteStatus = false;
    }

    this.state.userEvents.forEach(userEvent => {
      if(userEvent.name === event.name) {//check this when get real data!!!!!!
        userEvent.vote_count = event.vote_count;
      }
      newUserEvents.push(userEvent);
    })
    this.setState({userEvents: newUserEvents});

    //delete event.voteStatus;
    console.log("voted event is ready to save to database: ", event)
    //save event which include vote result in to database;
    //fetch(...)


  }
  //get user's events data from database
  componentDidMount() {
    // fetch('/api/events', {credentials: 'include'})
    // .then(res => res.json())
    // .catch(err => console.log("Can not get user's events from server: ", err))
    // .then(res => this.setState({userEvents: res}))
    let res = fakeEvents;
    let eventsDays = [];
    res.map(event => event.voteStatus = false);
    this.setState({userEvents: res});
    res.forEach(event => eventsDays.push(event.date));
    eventsDays = eventsDays
    .filter((ele,ind) => eventsDays.indexOf(ele) === ind)
    .map(date => {
      let rObj = {};
      rObj.date = date;
      rObj.events = res.filter(event => event.date === date);
      return rObj;
    })
    console.log("eventsDays: ", eventsDays)
    this.setState({eventsDays: eventsDays})
  }

  render() {
    //console.log("!!!!!!!", this.state.eventDays);
    let date = new Date();
    let today = date.toLocaleDateString();
    //console.log(today)
    console.log("description: ", this.state.eventDetails.date_Time)
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
              {this.state.userEvents.filter(event => event.date === today).map((event) => 
                (<GridTile
                  key={event.time}
                  title={event.time}
                  subtitle={<span><b>{event.description}</b></span>}
                  onClick={() => this.handleOpen(event)}
                >
                  <img src={event.img} />
                </GridTile>
              ))}
            </GridList>
          </div>
        </Tab>
        <Tab className="tabsItem" label="All Plans" >
          {this.state.eventsDays.map(eventdate => (
            <div style={styles.root}>
              <h1 style={{margin:'40 20 0 0'}}>{eventdate.date}</h1>
              <GridList
                cols={1}
                padding={15}
                cellHeight={180}
                style={styles.gridList}
                key={eventdate.date}
              >
                <Subheader>&nbsp;</Subheader>
                {eventdate.events.map(event => 
                  (<GridTile 
                    key={event.time}
                    title={event.time}
                    subtitle={<span><b>{event.description}</b></span>}
                    actionIcon={<span><b style={{color: "white"}}>{event.vote_count}</b><IconButton onClick={() => this.handleVote(event)}><ThumbUp color="white" /></IconButton></span>}
                  >
                    <img onClick={() => this.handleOpen(event)} src={event.img} />
                  </GridTile>
                ))}
              </GridList>
            </div>
          ))}
        </Tab>
      </Tabs>
      <Dialog
        title="Event Detail"
        actions={<FlatButton label="Confirm" primary={true} onTouchTap={this.handleClose} />}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose}
        autoScrollBodyContent={true}
      >
        <br/>
        {this.state.eventDetails.img !== '' ? (<img src={this.state.eventDetails.img} alt="eventImg"/>) : null}
        {this.state.eventDetails.name !== '' ? (<List><div><Subheader>Event:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.name}</p></div><Divider/></List>) : null}
        {this.state.eventDetails.description !== undefined ? (<List><div><Subheader>Description:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.description.length > 100 ? this.state.eventDetails.description.slice(0,100) + '...' : this.state.eventDetails.description }{this.state.eventDetails.url ? (<a href={this.state.eventDetails.url} target="_blank">&nbsp;more details</a>) : null}</p></div><Divider/></List>) : null}
        {this.state.eventDetails.date_Time !== '' ? (<List><div><Subheader>Event start:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.date_Time}</p></div><Divider/></List>) : null}
        {this.state.eventDetails.address !== '' ? (<List><div><Subheader>Address:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.address}</p><RaisedButton label="Map Open" onTouchTap={() => this.handleGoogleMapOpen(this.state.eventDetails)} /></div><br/><Divider/></List>) : null}
        {this.state.eventDetails.city !== '' ? (<List><div><Subheader>City:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.city}</p></div><Divider/></List>) : null}
        {this.state.eventDetails.state !== '' ? (<List><div><Subheader>State:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.state}</p></div><Divider/></List>) : null}
        {this.state.eventDetails.phone !== '' ? (<List><div><Subheader>Phone:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.phone}</p></div><Divider/></List>) : null}
        {this.state.eventDetails.date_Time !== '' ? (<List><div><Subheader>Group:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.date_Time}</p></div><Divider/></List>) : null}
          
      </Dialog>
      <Dialog
        title="The Location Of Your Event"
        actions={<FlatButton label="Cancle" primary={true} onTouchTap={this.handleGoogleMapClose} />}
        modal={false}
        open={this.state.googleMapOpen}
        onRequestClose={this.handleGoogleMapClose}
        autoScrollBodyContent={true}
      >
        <br/>
        <div>
          <div>
            <p>Current Address: </p>
          </div>
          <div>
            <p>Derection Address: </p>
          </div>
          <div>
            <p>Transportation: </p>
          </div>
          <div>
            <p>Distance: </p>
          </div>
          <div>
            <p>Time: </p>
          </div>
        </div>
        <div id="map" style={styles.googleMapStyle}></div>
        <br/>
        {this.state.directionButtonShowOrHide ? (<RaisedButton label="Direction" fullWidth="true" disabled={this.state.directionButton} onTouchTap={() => this.handleGetDirection(this.state.eventDetails)}/>) : null}
      </Dialog>
    </div>);
  }
}






