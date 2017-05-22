import React from 'react';

export default class HomePageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.profile);
    return (<div className="home"> HOME PAGE COMPONENT </div>);
  }
}