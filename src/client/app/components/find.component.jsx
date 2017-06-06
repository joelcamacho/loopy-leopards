import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { HashRouter, Router, Link } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import helpers from '../helpers/fetch.helper.jsx';

export default class SearchPageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      userLocation: 'Please enter your location',
      latitude: 0,
      longitude: 0,
      toggleCheckBox: false,
      userSearchEvent: '',
      events: [],
      showMoreButton: false,
      searchButton: false,
    }

    this.handleExpandChange = this.handleExpandChange.bind(this);
    this.handleSearchResult = this.handleSearchResult.bind(this);
    this.handleGetCurrentLocation = this.handleGetCurrentLocation.bind(this);
    this.handleAddressTextFieldChange = this.handleAddressTextFieldChange.bind(this);
    this.handleSearchTextFieldChange = this.handleSearchTextFieldChange.bind(this);
    this.handleMoreSearchResult = this.handleMoreSearchResult.bind(this);
    this.handleBackToTop = this.handleBackToTop.bind(this);
    this.handleClickedEvent = this.handleClickedEvent.bind(this);
  }

  handleExpandChange (expanded) {
    this.setState({expanded: expanded});
  };

  handleAddressTextFieldChange (event) {
    this.setState({userLocation: event.target.value});
  }

  handleSearchTextFieldChange (event) {
    this.setState({userSearchEvent: event.target.value});
  }

  handleMoreSearchResult () {
    this.setState({events: this.props.events});
    this.setState({showMoreButton: true});
  }

  handleClickedEvent (event) {
    event.userLocation = this.state.userLocation;
    this.props.createEvent(event);
  }

  handleBackToTop () {
    window.scrollBy(0,-10);
    scrolldelay = setTimeout(this.handleBackToTop(),100);
  }

  componentDidMount() {
    fetch('/api/user', {credentials: 'include'})
    .then(res => res.json())
    .then(res => {
      this.props.updateProfile(res);
    })
  }

  handleSearchResult () {
    const userSearchEvent = this.state.userSearchEvent;
    const userLocation = this.state.userLocation === 'Please enter your location' ? null : this.state.userLocation
    ///////////////////Helper Functions///////////////////
    let randomNumbers = [];
    let eventsArray = [];
    let eventsbriteData;
    let eventsYelpData;
    //pick up 20 events from api
    function pickupEvents(array) {
      let length = array.length;
        for (var i = 0; i < 20; i++) {
          var randomNumber = Math.floor(Math.random()*length);
          if (randomNumbers.indexOf(randomNumber) == -1) {
            randomNumbers.push(randomNumber);
            eventsArray.push(array[randomNumber]);
          } else {
            --i;
          }
        }
    }
    //get unique
    function getUnique(arr) {
      var unique = {};
        arr.forEach(function(a){ unique[ JSON.stringify(a) ] = 1 });
        arr= Object.keys(unique).map(function(u){return JSON.parse(u) });
        return arr
    }

    ///////////////////////////////////////////////////////

    /////////////Get data from Eventbrite API//////////////
    let init = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      query: JSON.stringify({location: userLocation, q: userSearchEvent})
    }
    fetch('/api/eventbrite', init)
      .then(res => res.json())
      .catch(error => console.log("Can not received data from Eventbrite Api: ", error))
      .then(res => {
        pickupEvents(res.events);
        console.log("pickup 20 events from eventbrite: ", eventsArray);
        let eventsbrite = eventsArray.map(event => {
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
      })
    ///////////////////////////////////////////////////////

    //////////////////Get data from Yelp API///////////////
      .then(res => {
        let params = {
          location: userLocation,
          terms: userSearchEvent
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
        console.log("Can not received data from Yelp Api: ", error);
      })
      .then(res =>{
        //console.log('received data from Yelo api: ', res);
        randomNumbers = [];
        eventsArray = [];
        pickupEvents(res.businesses);
        console.log("pickup 20 events from yelp: ", eventsArray);
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
    ///////////////////////////////////////////////////////
      .then(res => {
        randomNumbers = [];
        let mixedEvents = eventsbriteData.concat(eventsYelpData);
        //do random
        let result = []
        for(var i = 0; i < mixedEvents.length; i++) {
          var randomNumber = Math.floor(Math.random() * mixedEvents.length);
          if (randomNumbers.indexOf(randomNumber) === -1) {
            result.push(mixedEvents[randomNumber]);
          } else {
            i--;
          }
        }
        result = getUnique(result);
        this.props.addEvents(result);
        this.setState({expanded: true});
        this.setState({searchButton: false});
        result.length > 20 ? this.setState({showMoreButton: false}) : this.setState({showMoreButton: true})
      })
    this.setState({searchButton: true});
  };

  handleGetCurrentLocation (event) {
    var that = this;
    that.setState({searchButton: true});
    if (!that.state.toggleCheckBox) {
      if (navigator.geolocation) { 
          navigator.geolocation.getCurrentPosition(function (position) { 
            helpers.fetchAddressFromCoordinates(position)
            .then(res => {
              that.setState({searchButton: false});
              that.setState({userLocation: res});
            })})}
      that.setState({toggleCheckBox: true});
    } else {
      that.setState({userLocation: 'Please enter your location'});
      that.setState({toggleCheckBox: false});
      that.setState({searchButton: false});
    }}

  render() {
    const { events } = this.props;
    const styles = {
      position: {
        marginLeft: 16,
      },
      position_searchButton: {
        marginBottom: 16,
        marginLeft: 16,
      },
      img: {
        height: 200,
        width: 500,
      }
    }; 

    return (
      <div>
        <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
          <CardHeader
            actAsExpander={true}
          />
          <TextField
            id="text-field-controlled"
            value={this.state.userLocation}
            onChange={this.handleAddressTextFieldChange}
            style={styles.position}
            multiLine={true}
          />
          <Checkbox
            label="Current Location"
            style={styles.position}
            onCheck={() => this.handleGetCurrentLocation(event)}
            checked={this.state.toggleCheckBox}
          />
          <TextField
            hintText="Hint Text"
            floatingLabelText="Search"
            onChange={this.handleSearchTextFieldChange}
            style={styles.position}
          />
          <br/>
          <FlatButton 
              label="Search" 
              onTouchTap={this.handleSearchResult} 
              style={styles.position_searchButton}
              disabled={this.state.searchButton}
          />
          <br/>
          {
            events.slice(2, 20).map(event => {
              return (
                <div>
                  <Link to='/create'>
                    <CardMedia
                      expandable={true}
                      overlay={<CardTitle title={event.title}/>}
                      onClick={() => this.handleClickedEvent(event)}
                    >
                      <img style={styles.img} src={event.img}/>
                    </CardMedia>
                    <br/>
                  </Link>
                </div>
              )
            })
          }
          <br/>
          {
            this.state.events.slice(20).map(event => {
              return (
                <div>
                  <Link to='/create'>
                    <CardMedia
                      expandable={true}
                      overlay={<CardTitle title={event.title}/>}
                      onClick={() => this.handleClickedEvent(event)}
                    >
                      <img style={styles.img} src={event.img}/>
                    </CardMedia>
                    <br/>
                    </Link>
                </div>
              )
            })
          }
          <FlatButton 
            expandable={true}
            label="Show more" 
            onTouchTap={this.handleMoreSearchResult} 
            style={styles.position_searchButton}
            disabled={this.state.showMoreButton}
          />
          <FlatButton
            expandable={true} 
            label="Top" 
            onTouchTap={this.handleBackToTop} 
            style={styles.position_searchButton}
          />
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
        </Card>
      </div>
    ); 
  }
}



// <CardMedia
//   expandable={true}
//   overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
// >
//   <img src="images/nature-600-337.jpg" />
// </CardMedia>

// this.handleReduce = this.handleReduce.bind(this);
// handleReduce () {
//   this.setState({expanded: false});
// };
//<FlatButton label="Reduce" onTouchTap={this.handleReduce} />

// <CardTitle title="Card title" subtitle="Card subtitle" expandable={true} />
// <CardText expandable={true}>
//   Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//   Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
//   Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
//   Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
// </CardText>