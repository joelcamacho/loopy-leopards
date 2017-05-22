import React from 'react';

export default class FindPageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.events);
    return (<div> FIND COMPONENT </div>);
  }
}