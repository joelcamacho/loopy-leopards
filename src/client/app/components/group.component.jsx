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

const fakeGroupData = {
  name: 'Loopy Leopards',
  list: [
    {
      name: 'Eric Hoffman',
      photo: null,
      phone: '123-123-1234'
    },
    {
      name: 'Kimmy J',
      photo: 'https://static.seekingalpha.com/uploads/2016/4/957061_14595169907724_rId15.jpg',
      phone: '123-123-KimJ'
    },
    {
      name: 'Brendan Lim',
      photo: null,
      phone: '123-123-1243'
    },
    {
      name: 'Grace Ng',
      photo: null,
      phone: '578-123-1234'
    },
    {
      name: 'Raquel Parrado',
      photo: null,
      phone: '123-234-1234'
    }
  ],
  recent: [
    {
      name: 'Kimmy J J',
      photo: null,
      phone: '412-123-1234'
    },
    {
      name: 'Ra',
      photo: null,
      phone: '123-123-4124'
    }
  ]
}


export default class GroupPageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.group = {};

    this.getGroup = this.getGroup.bind(this);
    this.getGroup();
  }

  getGroup() {
    // switch this with group endpoint /api/groups
    fetch('/auth', {credentials: 'include'})
      .then(res => res.json())
      .then(res => {
        //this.group = res.result;
        this.group = fakeGroupData;
        this.forceUpdate();
      })
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
              {this.group.list ? this.group.list.map(obj => (<ListItem
                key={obj.phone}
                primaryText={obj.name}
                leftAvatar={<Avatar src={!!obj.photo ? obj.photo  : 'http://sites.austincc.edu/jrnl/wp-content/uploads/sites/50/2015/07/placeholder.gif'} />}
                rightIcon={<span className="phone">{obj.phone}</span>}
              />)) : null}
            </List>
            <Divider />
            <List>
              <Subheader> Recent Guests </Subheader>
              {this.group.list ? this.group.recent.map(obj => (<ListItem
                key={obj.phone}
                primaryText={obj.name}
                leftAvatar={<Avatar src={!!obj.photo ? obj.photo  : 'http://sites.austincc.edu/jrnl/wp-content/uploads/sites/50/2015/07/placeholder.gif'} />}
                rightIcon={<span className="phone">{obj.phone}</span>}
              />)) : null}
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