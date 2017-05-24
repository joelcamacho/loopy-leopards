import React from 'react';
import FlatButton from 'material-ui/FlatButton';

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
    console.log("datas: ", this.props.events);
    console.log("data: ", this.props.event);
    const { events } = this.props;
    const { event } = this.props;
    //console.log("state from state: ", events);
    //console.log("state from state: ", event);
    if(events.length === 0 && event.status === 'first') {
      console.log(111)
      return (
        <p></p>
      );
    } else if (events.length > 0 && event.status === 'first') {
      //console.log("Else events: ",events);
      console.log(222);
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
                    <button>DETAIL</button>
                    <button onClick={() => this.getEvent(event)}>ADD</button>
                  </div>
                </div>
              )
            })
          }
        </div>
      ); 
    } else {
      console.log(333)
      console.log("event: ", event)
      return (
        <div className="comfirm">
            <img src={event.img} alt="eventImg"/>
            {event.title !== '' ? (<div><h3>Event:</h3><p>{event.title}</p></div>) : null}
            {event.description !== '' ? (<div><h3>Description:</h3><p>{event.description}</p></div>) : null}
            {event.address !== '' ? (<div><h3>Address:</h3><p>{event.address}</p></div>) : null}
            {event.city !== '' ? (<div><h3>City:</h3><p>{event.city}</p></div>) : null}
            {event.state !== '' ? (<div><h3>State:</h3><p>{event.state}</p></div>) : null}
            {event.phone !== '' ? (<div><h3>Phone:</h3><p>{event.phone}</p></div>) : null}
            {event.date_time !== undefined ? (<div><h3>Date & Time:</h3><p>{event.date_time}</p></div>) : null}
        <div>
          <FlatButton className="drawerItem" label="Back" onClick={() => this.backToEvents([])} />
          <FlatButton className="drawerItem" label="Comfirm" />
        </div>
        <br/>
        <br/> 
        <br/> 
        </div>

      );
    }
  }
}

