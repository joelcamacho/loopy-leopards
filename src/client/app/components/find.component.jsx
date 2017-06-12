import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { HashRouter, Router, Link } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import helpers from '../helpers/fetch.helper.jsx';
import CircularProgress from 'material-ui/CircularProgress';

export default class SearchPageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      userLocation: null,
      latitude: 0,
      longitude: 0,
      toggleCheckBox: false,
      userSearchEvent: '',
      events: [],
      showMoreButton: false,
      searchButton: false,
      hasSearched: false
    }

    this.handleExpandChange = this.handleExpandChange.bind(this);
    this.handleSearchResult = this.handleSearchResult.bind(this);
    this.handleGetCurrentLocation = this.handleGetCurrentLocation.bind(this);
    this.handleAddressTextFieldChange = this.handleAddressTextFieldChange.bind(this);
    this.handleSearchTextFieldChange = this.handleSearchTextFieldChange.bind(this);
    this.handleMoreSearchResult = this.handleMoreSearchResult.bind(this);
    this.handleBackToTop = this.handleBackToTop.bind(this);
    this.handleClickedEvent = this.handleClickedEvent.bind(this);
    this.getCurrentUserAddress = this.getCurrentUserAddress.bind(this);
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
    helpers.fetchEventbriteData(userLocation, userSearchEvent)
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
            venue_id: event.venue_id,
          }
        })
        eventsbriteData = eventsbrite;
      })
    ///////////////////////////////////////////////////////

    //////////////////Get data from Yelp API///////////////
      .then(res => helpers.fetchYelpData(userLocation, userSearchEvent))
      .then(res =>{
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
        this.setState({hasSearched: true});
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

  getCurrentUserAddress() {
    this.props.profile && this.props.profile.address ? 
    this.setState({userLocation: this.props.profile.address + ' ' + this.props.profile.city + ' ' + this.props.profile.state})
    : this.setState({userLocation: 'Please enter your location'})
  }

  componentDidMount() {
    this.getCurrentUserAddress();
  }

  render() {
    const { events } = this.props;

    return (
      <div>
        <div className="find">
          <Card className="findPaper" expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
            <CardHeader title="Search for Events and Places"/>
            <TextField
              className='inputs'
              id="text-field-controlled"
              value={this.state.userLocation}
              onChange={this.handleAddressTextFieldChange}
              multiLine={true}
            />
            <Checkbox
              className='inputs'
              label="Current Location"
              style={{marginLeft: '16', maxWidth: '80%'}}
              onCheck={() => this.handleGetCurrentLocation(event)}
              checked={this.state.toggleCheckBox}
            />
            <TextField
              className='inputs'
              hintText="Hint Text"
              floatingLabelText="Search"
              onChange={this.handleSearchTextFieldChange}
            />
            <br/>
            <RaisedButton
              labelColor="white"
              backgroundColor="#009688"
              className="findBtn"
              label="Search" 
              onTouchTap={this.handleSearchResult} 
              disabled={this.state.searchButton}
            />
          </Card>

          {this.state.searchButton ? (
            <CircularProgress color="#009688" className='progress' size={120} thickness={8} />
          ) : null}

          <div className="findResults">
            {
              events.slice(2, 20).map(event => {
                return (
                  <div className='findCard'>
                    <Link to='/create'>
                      <CardMedia
                        key={event.title}
                        expandable={true}
                        overlay={<CardTitle title={event.title.length > 50 ? event.title.slice(0,50) + '...' : event.title}/>}
                        onClick={() => this.handleClickedEvent(event)}
                      >
                        <img className='findMedia' src={event.img}/>
                      </CardMedia>
                    </Link>
                  </div>
                )
              })
            }
            <br/>
            {
              this.state.events.slice(20).map(event => {
                return (
                  <div className='findCard'>
                    <Link to='/create'>
                      <CardMedia
                        key={event.title}
                        expandable={true}
                        overlay={<CardTitle title={event.title.length > 50 ? event.title.slice(0,50) + '...' : event.title}/>}
                        onClick={() => this.handleClickedEvent(event)}
                      >
                        <img className='findMedia' src={event.img}/>
                      </CardMedia>
                      </Link>
                  </div>
                )
              })
            }
            </div>
            { this.state.hasSearched ? (
              <div>
                <br/>
                <RaisedButton
                  labelColor="white"
                  backgroundColor="#009688"
                  className='findShowBtn'
                  label="Show more" 
                  onTouchTap={this.handleMoreSearchResult} 
                  disabled={this.state.showMoreButton}
                />
                <br/>
                <RaisedButton
                  labelColor="white"
                  backgroundColor="#009688"
                  className='findShowBtn'
                  label="Top" 
                  onTouchTap={this.handleBackToTop} 
                />
                <br/>
              </div>) : null
            }

        </div>
      </div>
    ); 
  }
}