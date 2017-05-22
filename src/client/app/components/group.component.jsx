import React from 'react';

export default class GroupPageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.group);
    return (<div> GROUP COMPONENT </div>);
  }
}