import React from 'react';

export default class EventsPageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.event);
    return (<div> EVENTS COMPONENT </div>);
  }
}


