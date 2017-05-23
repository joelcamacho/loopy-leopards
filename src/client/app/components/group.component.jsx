import React from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import ContentAdd from 'material-ui/svg-icons/content/add';
import CommunicationPhone from 'material-ui/svg-icons/communication/phone';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

export default class GroupPageComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.group);
    return (
      <div>
        <div className="group">
          <Paper className="container">
            <h3> GROUP </h3>
            <Divider/>
            <List>
              <Subheader> Loopy Leopards </Subheader>
              <ListItem
                primaryText="Brendan Lim"
                leftAvatar={<Avatar src="images/ok-128.jpg" />}
                rightIcon={<span className="phone">123-456-1234</span>}
              />
              <ListItem
                primaryText="Eric Hoffman"
                leftAvatar={<Avatar src="images/kolage-128.jpg" />}
                rightIcon={<span className="phone">123-456-1234</span>}
              />
              <ListItem
                primaryText="Grace Ng"
                leftAvatar={<Avatar src="images/uxceo-128.jpg" />}
                rightIcon={<span className="phone">123-456-1234</span>}
              />
              <ListItem
                primaryText="Kerem Suer"
                leftAvatar={<Avatar src="images/kerem-128.jpg" />}
                rightIcon={<span className="phone">123-456-1234</span>}
              />
              <ListItem
                primaryText="Raquel Parrado"
                leftAvatar={<Avatar src="images/raquelromanp-128.jpg" />}
                rightIcon={<span className="phone">123-456-1234</span>}
              />
            </List>
            <Divider />
            <List>
              <Subheader> Recent Guests </Subheader>
              <ListItem
                primaryText="Chelsea Otakan"
                leftAvatar={<Avatar src="images/chexee-128.jpg" />}
                rightIcon={<ContentAdd />}
              />
              <ListItem
                primaryText="James Anderson"
                leftAvatar={<Avatar src="images/jsa-128.jpg" />}
                rightIcon={<ContentAdd />}
              />
              </List>
            <Divider/>
            <List>
              <Subheader> Add to Group </Subheader>
              <TextField className="add" floatingLabelText="Name"/>
              <TextField className="add"  floatingLabelText="Phone Number"/>
              <br />
              <FlatButton className="addBtn" label="Add Friend" />
            </List>
            <Divider/>
            <List>
              <Subheader> Join Another Group </Subheader>
              <TextField className="add" floatingLabelText="Group Name"/>
              <br />
              <FlatButton className="addBtn" label="Join Group" />
            </List>
          </Paper>
        </div>
      </div>
    );
  }
}