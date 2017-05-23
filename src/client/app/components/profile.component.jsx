import React from 'react';
import Paper from 'material-ui/Paper';
import { Image } from 'material-ui-image'
import FlatButton from 'material-ui/FlatButton';

export default class ProfilePageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.profile);

    var profileComponent = this.props.profile ? (
      <div>
        <p> {this.props.profile.phone} </p>
        <p> {this.props.profile.address}, {this.props.profile.city}, {this.props.profile.state}</p>
        <p> {this.props.profile.birthday} </p>
      </div>
    ) : (<div> 
      <p> Please log in </p>
      <FlatButton label="Log in with google"/>
     </div>);

    return (
      <div> 
        <div className="profile">
          <Paper className="container">
            <Image 
            imageStyle={{borderRadius: '50%'}} 
            style={{backgroundColor: 'clear', height: '250px', width: '250px', margin: '25px 50px'}}
            src={this.props.profile.photo ? this.props.profile.photo : 'https://openclipart.org/download/247319/abstract-user-flat-3.svg'}/>
            <h3> {this.props.profile ? this.props.profile.name : 'Anonymous User'} </h3>
            {profileComponent}
          </Paper>
        </div>
      </div>
    );
  }
}
