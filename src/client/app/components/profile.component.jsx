import React from 'react';

export default class ProfilePageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.profile);
    return (<div> PROFILE COMPONENT </div>);
  }
}
