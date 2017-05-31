import React from 'react';
import Paper from 'material-ui/Paper';

export default class CreatePageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="createContainer">
        <Paper className="createItem"> CreatePageComponent, Please update this page component David </Paper>
      </div>
    );
  }
}