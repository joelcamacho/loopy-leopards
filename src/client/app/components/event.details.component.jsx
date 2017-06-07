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
import Avatar from 'material-ui/Avatar';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import Chip from 'material-ui/Chip';


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
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 5,
  },
};

export default class EventDetailsPageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userEvents: [],
      voteStatus: false,
      eventsDays: [],
      usersOpen: false,
      eventDetails: {},//////
      googleMapOpen: false,
      directionButton: true,
      directionButtonShowOrHide: true,
      directionDetails: {},
      displaydirectionDetails: false,
      transportationButton: false,
      weather: '',
      temperature: '',
      invitedUsers: [],//users who has been invited
      userStatus: [],//for user name and right icon which is + or -
      userGroupData: [],//this groupdata is only for search bar
      open: true,
    }

    // this.handleVote = this.handleVote.bind(this);
    // this.handleEventClick = this.handleEventClick.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    // this.handleClose = this.handleClose.bind(this);
    this.handleGoogleMapOpen = this.handleGoogleMapOpen.bind(this);
    this.handleGoogleMapClose = this.handleGoogleMapClose.bind(this);
    this.handleGetDirection = this.handleGetDirection.bind(this);
  
    this.handleDeleteChip = this.handleDeleteChip.bind(this);
    this.handleUsersOpen =this.handleUsersOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSearchbar = this.handleSearchbar.bind(this);
    this.handleClickUser = this.handleClickUser.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOpen (event)  {

    this.setState({eventDetails: event})
    this.setState({open: true});

    console.log("Hello, event is here: ", event);
    this.props.eventDetails(event);

    // if (event.creator_id === this.props.profile.id) {
    //   //go some where
    // } else {
    //   //go some where
    // }
  };

  // handleClose () {
  //   this.setState({open: false});
  // };

  handleGoogleMapOpen (event) {
    helpers.fetchCoordinatesForEvent(event.address)
    .then(res => {
      const coords = res.results[0].geometry.location;
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
    this.setState({displaydirectionDetails: false});
  }

  handleGetDirection (event, mode) {
    let currentAddress;
    let directionsService;
    let directionsDisplay;
    let originAddress;
    let that;
    let directionDetails;

    that = this
    that.setState({directionButton: true});
    that.setState({transportationButton: true});
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();

    if (navigator.geolocation) { 
        navigator.geolocation.getCurrentPosition(function (position) { 
          const latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); 
          helpers.fetchAddressFromCoordinates(position)
          .then(res => {
            currentAddress = res;
            return currentAddress;
          })
          .then(function(address) {
            currentAddress = address;
            var mapOptions = {
              zoom: 7,
              mapTypeId: google.maps.MapTypeId.ROADMAP,
              center: latlng
            }
            const map = new google.maps.Map(document.getElementById("map"), mapOptions);
            directionsDisplay.setMap(map);
            var way = google.maps.TravelMode[mode];
            var request = {
              origin: address,
              destination: event.address,
              travelMode: way,
            };
            directionsService.route(request, function(response, status) {
              if(status === 'OK') {
                directionsDisplay.setDirections(response);
              }
            });
            that.setState({directionButtonShowOrHide: false});
            return address;
          })
          .then(currentAddress => {
            helpers.fetchDirectionData(currentAddress, event.address, mode)
            .then(res => {
              directionDetails = {};
              directionDetails.transportation = mode;
              directionDetails.distance = res.routes[0].legs[0].distance.text;
              directionDetails.time = res.routes[0].legs[0].duration.text;
              directionDetails.currentAddress = currentAddress;
              that.setState({directionDetails: directionDetails});
              that.setState({displaydirectionDetails: true});
              that.setState({transportationButton: false});
            })
          })
        }
      )
    }
  }

  // handleVote (event) {
  //   let newUserEvents = []
  //   if (!event.voteStatus) {
  //     ++event.vote_count;
  //     event.voteStatus = true;
  //   } else {
  //     --event.vote_count;
  //     event.voteStatus = false;
  //   }

  //   this.state.userEvents.forEach(userEvent => {
  //     if(userEvent.name === event.name) {//check this when get real data!!!!!!
  //       userEvent.vote_count = event.vote_count;
  //     }
  //     newUserEvents.push(userEvent);
  //   })
  //   this.setState({userEvents: newUserEvents});

  //   //delete event.voteStatus;
  //   console.log("voted event is ready to save to database: ", event)
  //   //save event which include vote result in to database;
  //   //fetch(...)


  // }

  handleUsersOpen ()  {
    this.setState({usersOpen: true});
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
    this.setState({usersOpen: false});
  };

  handleSearchbar (event, userInput) {
    var users = [];
    !!userInput ? this.state.userGroupData.forEach(userInfo => {
      if(userInfo.name.indexOf(userInput) > -1 || userInfo.phone.indexOf(userInput) > -1) {
          users.push(userInfo)
        }
      }) : users = this.state.userGroupData;
    this.props.searchUsers(users);//////??????????
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

  getIndex (name) {
    let RIC; 
    this.state.userStatus.forEach((ele,ind) => {
      if(ele.name === name) {
        RIC = ele.rightIconDisplay
      }
    })
    return RIC;
  }

  handleSubmit () {
    this.setState({usersOpen: false});
  };



  componentDidMount() {
    let currentUserFirstName = this.props.profile.first_name || "";
    let currentUserLastName = this.props.profile.last_name || "";

    helpers.fetchWeatherData(event.latitude, event.longitude, event.time)//fix this later
    .then(res => {
      let icon = '' 
      res.currently.icon.split("").forEach(ele => ele === "-" ? icon += '_' : icon += ele.toUpperCase());
      this.setState({weather: {summary: res.currently.summary, temperature: res.currently.temperature, icon: icon}});
    });
    this.setState({eventDetails: this.props.event});

    helpers.fetchUsersData()
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

  render() {
    const { users } = this.props;
    console.log("THIS event is FROM PROPS: ", this.props.event)
    console.log("ThIS profile is FROM PROPS: ", this.props.profile)
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

    return this.props.event.creator_id === this.props.profile.id ? (
      <div>
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
        {this.state.weather !== '' ? (<List><div><Subheader>Weather:</Subheader><Skycons color='orange' icon={this.state.weather.icon} autoplay={true} style={styles.weather}/><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.weather.summary}</p><p>{this.state.weather.temperature}&#8451;</p></div><Divider/></List>) : null}
        {this.state.eventDetails.name !== '' ? (<List><div><Subheader>Event:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.name}</p></div><Divider/></List>) : null}
        {this.state.eventDetails.description !== undefined ? (<List><div><Subheader>Description:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.description.length > 100 ? this.state.eventDetails.description.slice(0,100) + '...' : this.state.eventDetails.description }{this.state.eventDetails.url ? (<a href={this.state.eventDetails.url} target="_blank">&nbsp;more details</a>) : null}</p></div><Divider/></List>) : null}
        {this.state.eventDetails.date_Time !== '' ? (<List><div><Subheader>Event start:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.date_time}</p></div><Divider/></List>) : null}
        {this.state.eventDetails.address !== '' ? (<List><div><Subheader>Address:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.address}</p><RaisedButton label="Map Open" onTouchTap={() => this.handleGoogleMapOpen(this.state.eventDetails)} /></div><br/><Divider/></List>) : null}
        {this.state.eventDetails.city !== '' ? (<List><div><Subheader>City & State:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.city}</p></div><Divider/></List>) : null}
        {this.state.eventDetails.date_Time !== '' ? (<List><div><Subheader>Group:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.date_Time}</p></div><Divider/></List>) : null}
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
          <RaisedButton label="Invite People" onTouchTap={this.handleUsersOpen} />
            
            <Dialog
              title="Invite your friends"
              actions={actions}
              modal={false}
              open={this.state.usersOpen}
              onRequestClose={this.handleUsersClose}
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
        { this.state.displaydirectionDetails ? 
          (<div>
            <div>
              <p>Current Address(A): {this.state.directionDetails.currentAddress}</p>
            </div>
            <div>
              <p>Derection Address(B): {this.state.eventDetails.address}</p>
            </div>
            <div>
              <p>Transportation: {this.state.directionDetails.transportation}</p>
            </div>
            <div>
              <p>Distance: {this.state.directionDetails.distance}</p>
            </div>
            <div>
              <p>Time: {this.state.directionDetails.time}</p>
            </div>
          </div>)
          : null
        }
        <div id="map" style={styles.googleMapStyle}></div>
        <br/>
        {this.state.directionButtonShowOrHide ? (<RaisedButton label="Direction" fullWidth="true" disabled={this.state.directionButton} onTouchTap={() => this.handleGetDirection(this.state.eventDetails, 'DRIVING')}/>) : null}
        {this.state.displaydirectionDetails ? (<RaisedButton label="TRANSIT" fullWidth="true" disabled={this.state.transportationButton} onTouchTap={() => this.handleGetDirection(this.state.eventDetails, 'TRANSIT')}/>) : null}
        {this.state.displaydirectionDetails ? (<RaisedButton label="DRIVING" fullWidth="true" disabled={this.state.transportationButton} onTouchTap={() => this.handleGetDirection(this.state.eventDetails, 'DRIVING')}/>) : null}
        {this.state.displaydirectionDetails ? (<RaisedButton label="BICYCLING" fullWidth="true" disabled={this.state.transportationButton} onTouchTap={() => this.handleGetDirection(this.state.eventDetails, 'BICYCLING')}/>) : null}
        {this.state.displaydirectionDetails ? (<RaisedButton label="WALKING" fullWidth="true" disabled={this.state.transportationButton} onTouchTap={() => this.handleGetDirection(this.state.eventDetails, 'WALKING')}/>) : null}
      </Dialog>
      </div>





      ) : (
      <Dialog
          title="Event Detail"
          actions={<FlatButton label="Confirm" primary={true} onTouchTap={this.handleClose} />}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          <p>Hello!!! Guest User!!!</p>
        </Dialog>
      )
  }
}