import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import { HashRouter, Router, Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import TimePicker from 'material-ui/TimePicker';
import DatePicker from 'material-ui/DatePicker';
import TextField from 'material-ui/TextField';
import ContentAdd from 'material-ui/svg-icons/content/add';
import helpers from '../helpers/fetch.helper.jsx';

export default class CreatePageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      controlledDate: null,
      value12: null,
      commentTestValue: '',
      titleTestValue: '',
      addressTestValue: '',
      cityTestValue: '',
      stateTestValue: '',
      phoneTestValue: '',
      open: false,
      userStatus: [],
      clickUserStatus: false,
      invitedUsers: [],
      userGroupData: [],
      currentEvent: {description: ''},
      descriptionTestValue: '',
    };

    this.handleChangeTimePicker12 = this.handleChangeTimePicker12.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this.handleTitleTestValue = this.handleTitleTestValue.bind(this);
    this.handleDescriptionTestValue = this.handleDescriptionTestValue.bind(this);
    this.handleAddressTestValue = this.handleAddressTestValue.bind(this);
    this.handleCityTestValue = this.handleCityTestValue.bind(this);
    this.handleFetchEventbriteAddress = this.handleFetchEventbriteAddress.bind(this);
  }

  handleTitleTestValue (event) {
    this.setState({titleTestValue: event.target.value});
  }

  handleDescriptionTestValue (event) {
    this.setState({descriptionTestValue: event.target.value});
  }

  handleAddressTestValue (event) {
    this.setState({addressTestValue: event.target.value});
  }

  handleCityTestValue (event) {
    this.setState({cityTestValue: event.target.value});
  }

  handleChangeTimePicker12 (event, date) {
    this.setState({value12: date});
  };

  handleChangeDate (event, date) {
    this.setState({controlledDate: date});
  };

  handleFetchEventbriteAddress () {
    helpers.fetchEventbriteAddress(this.props.createEventData.venue_id)
    .then(res => {
      let currentEvent = this.props.createEventData;
      currentEvent.address = res.address.localized_address_display;
      currentEvent.city = res.address.city;
      currentEvent.latitude = res.latitude;
      currentEvent.longitude = res.longitude;
      this.setState({currentEvent: currentEvent});
    })
  }

  componentDidMount() {
    if (this.props.createEventData.venue_id) {
      this.handleFetchEventbriteAddress();
    } else {
      this.setState({currentEvent: this.props.createEventData});
    }
  }

  handleConfirm () {
    let event;
    let date;
    let time;
    let hour;
    let eventTime; 
    date = JSON.stringify(this.state.controlledDate).slice(1,12);
    time = JSON.stringify(this.state.value12).slice(12,20);
    hour = +time.slice(0,2);
    if (hour === 3) {
      hour = '23';
    } else if (hour === 2) {
      hour = '22';
    } else if (hour === 1) {
      hour = '21';
    } else if (hour === 0) {
      hour = '20';
    } else {
      hour = (hour - 4).toString();
    }
    time = date + hour + time.slice(2);
    time = time.replace('T', ' ');
    eventTime = this.props.createEventData.date_time
    if (eventTime) {
      eventTime = eventTime.replace('T', ' ');
    }
    event = {
              img: this.props.createEventData.img || '',
              date_time: eventTime || time,
              description: this.props.createEventData.description.slice(0,200) || this.state.descriptionTestValue,
              address: this.props.createEventData.address || this.state.addressTestValue,
              city: this.props.createEventData.city || this.state.cityTestValue,
              state: this.props.createEventData.state || this.state.stateTestValue,
              latitude: this.props.createEventData.latitude || '',
              longitude: this.props.createEventData.longitude || '',
            }
    helpers.fetchCreateNewEvent(this.props.createEventData.title || this.state.titleTestValue, event)
      .then(res => {
        console.log('fetchCreateNewEvent', res);
      })
    this.props.setStateBackToDefault({});
  }

  render() {
    const { event } = this.props;
    const { users } = this.props;
    const styles = {
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    };
    console.log("this.state.currentEvent: ", this.state.currentEvent)
    return (
      <div className="createContainer">
        <Paper className="container">
          {this.state.currentEvent.img !== '' ? (<img src={this.state.currentEvent.img} alt="eventImg"/>) : (<div><br/><h1>Create Your Own Event</h1><Divider/></div>)}
          {this.state.currentEvent.title !== '' ? (<List><div><Subheader>Event:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.currentEvent.title}</p></div><Divider/></List>) : (<div><TextField hintText="Hint Text" floatingLabelText="Title" onChange={this.handleTitleTestValue}/><br/></div>)}
          {this.state.currentEvent.description !== '' ? (<List><div><Subheader>Description:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.currentEvent.description.length > 100 ? this.state.currentEvent.description.slice(0,100) + '...' : this.state.currentEvent.description }{this.state.currentEvent.url ? (<a href={this.state.currentEvent.url} target="_blank">&nbsp;more details</a>) : null}</p></div><Divider/></List>) : (<div><TextField hintText="Hint Text" floatingLabelText="Description" onChange={this.handleDescriptionTestValue}/><br/></div>)}
          {this.state.currentEvent.address !== '' ? (<List><div><Subheader>Address:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.currentEvent.address}</p></div><Divider/></List>) : (<div><TextField hintText="Hint Text" floatingLabelText="Address" onChange={this.handleAddressTestValue}/><br/></div>)}
          {this.state.currentEvent.city !== '' ? (<List><div><Subheader>City & State:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.currentEvent.city}&nbsp;{this.state.currentEvent.state}</p></div><Divider/></List>) : (<div><TextField hintText="Hint Text" floatingLabelText="City & State" onChange={this.handleCityTestValue}/><br/></div>)}
          <List>
          </List>
          {this.state.currentEvent.date_time !== undefined ? (<List><div><Subheader>Date and Time:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.currentEvent.date_time}</p></div><Divider/></List>) : 
            (<List>
            <div>
              <TimePicker
                format="ampm"
                hintText="12hr Format"
                value={this.state.value12}
                onChange={this.handleChangeTimePicker12}
              />
              <br/>
              <DatePicker
                hintText="Controlled Date Input"
                value={this.state.controlledDate}
                onChange={this.handleChangeDate}
              />
            </div>
            </List>)
          }
           <br/>
          <div>
            <Link to="/plans">
            <FlatButton className="drawerItem" label="Confirm" onClick={() => this.handleConfirm()}/>
            </Link>
          </div>
          <br/>
        </Paper>
      </div>
    );
  }
}