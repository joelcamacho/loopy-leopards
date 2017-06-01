import React from 'react';
import Paper from 'material-ui/Paper';

export default class AlertsPageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="alertsContainer">
          <h2 className="alertsTitle"> Notifications </h2>
          <Paper className="alertsItem"> Alert 1 </Paper>
          <Paper className="alertsItem"> Alert 2 </Paper>
          <Paper className="alertsItem"> Alert 3 </Paper>
          <Paper className="alertsItem"> Alert 4 </Paper>
          <Paper className="alertsItem"> Alert 5 </Paper>
        </div>
      </div>
    );
  }
}