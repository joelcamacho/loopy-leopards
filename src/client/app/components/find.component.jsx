import React from 'react';

export default class FindPageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  //For yelp, give NYC temply
  componentDidMount() {

    var randomNumbers = [];
    var eventsArray = [];

    function pickupEvents(array) {
      ////pick up 10 events from api
      let length = array.length;
        for (var i = 0; i < 10; i++) {
          var randomNumber = Math.floor(Math.random()*length);
          if (randomNumbers.indexOf(randomNumber) == -1) {
            randomNumbers.push(randomNumber);
            eventsArray.push(array[randomNumber]);
          } else {
            --i;
          }
        }
    }

    fetch('/api/eventbrite', {credentials: 'include'})
      .then(res => res.json())
      .catch(error => {
        console.log("Can not received data from Eventbrite Api!!!");
      })
      .then(res => {
        console.log('Received data from eventbrite api', res);
        pickupEvents(res.events);
        //console.log("pickup 10 events: ", eventsArray);
        this.props.addEvents(eventsArray);
      })
      .then(res => fetch('/api/yelp', {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
          location: 'NYC'
        })
      })
      .then(res => res.json())
      .catch(error => {
        console.log("Can not received data from Yelp Api!!!");
      })
      .then(res =>{
        console.log('received data from Yelo api: ', res);
        randomNumbers = [];

        pickupEvents(res.businesses);
        console.log("pickup 10 events from yelp: ", eventsArray)
      }))
  }

  render() {
    //console.log(this.props.events);
    const { events } = this.props;
    console.log("state from state: ", events[0]);
    if(events[0].activeState === null && events[0].activeState === null && !events[2]) {
      return (
        <p>displayFirstTime</p>        
      );
    } else {
      console.log("Else events: ",events);
      return (
        <div>
          {
            events.slice(2).map(event => {
              return (
                <div className="find">
                  <div className="eventImg"><img src={event.logo.original.url} alt=""/></div>
                    <div className="info">
                        <div className="name">{event.name.text}</div>
                    </div>
                  <div className="btn-div">
                    <button>DETAL</button>
                    <button>ADD</button>
                  </div>
                </div>
              )
            })
          }
        </div>
      ); 
    }
  }
}

