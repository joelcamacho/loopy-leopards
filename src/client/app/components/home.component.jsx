import React from 'react';

export default class HomePageComponent extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.state);
  }

  render() {
    return (<div> HOME PAGE COMPONENT</div>);
  }
}