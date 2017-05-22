import React from 'react';

export default class AuthComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
      	<a href="/auth/google"> LOG IN </a>
      	<a href="/logout"> LOG OUT </a>
      	<a href="/user"> USER DATA </a>
      	<a href="/auth"> ISAUTHENTICATED </a>
      </div>
    );
  }
}