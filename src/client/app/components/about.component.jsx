import React from 'react';
import Paper from 'material-ui/Paper';

export default class AboutPageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="aboutContainer">
          <Paper className="aboutTitle"> Loopy Leopards, Hangin Hubs, Description etc... </Paper>
          <Paper className="aboutItem"> Developer 1, picture, details, contact information </Paper>
          <Paper className="aboutItem"> Developer 2, picture, details, contact information </Paper>
          <Paper className="aboutItem"> Developer 2, picture, details, contact information </Paper>
          <Paper className="aboutTechStack"> Techstack picture or list </Paper>
        </div>
      </div>
    );
  }
}