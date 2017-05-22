import React from 'react';

export default class FindPageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

    fetch('/api/eventbrite', {credentials: 'include'})
      .then(res => res.json())
      .catch(error => {
        console.log("Can not received data from Api!!!");
      })
      .then(res => {
        console.log('Received data from eventbrite api', res);
        this.props.addEvents(res.events);
    });

  }

  render() {
    console.log(this.props.events);


    const { state } = this.props;
    console.log("state from state: ", state);
    if(state.event) {
      return (

        //state.slice(2).map(event => {

        <div className="appleItem">
          <div className="apple"><img src={state.event.photo} alt=""/></div>
            <div className="info">
                <div className="name">Event Title</div>
            </div>
          <div className="btn-div">
            <button>DETAL</button>
            <button>ADD</button>
          </div>
        </div>

        //})
        
      );
    }




    return (

      //state.slice(2).map(event => {

      <div className="appleItem">
        <div className="apple"><img src={state.event.photo} alt=""/></div>
          <div className="info">
              <div className="name">Event Title</div>
          </div>
        <div className="btn-div">
          <button>DETAL</button>
          <button>ADD</button>
        </div>
      </div>

      //})
    	
    );
  }
}