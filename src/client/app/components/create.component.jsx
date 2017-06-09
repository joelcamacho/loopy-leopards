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
import RaisedButton from 'material-ui/RaisedButton';

export default class CreatePageComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      controlledDate: null,
      value12: null,
      commentTestValue: '',
      titleTestValue: null,
      addressTestValue: null,
      cityTestValue: null,
      stateTestValue: '',
      phoneTestValue: '',
      open: false,
      userStatus: [],
      clickUserStatus: false,
      invitedUsers: [],
      userGroupData: [],
      currentEvent: {description: ''},
      descriptionTestValue: null,
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
        // console.log('fetchCreateNewEvent', res);
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
    return !!this.props.profile.id ?
      (<div className="create">
        <Paper className="createPaper">
          {this.props.createEventData.img !== '' ? 
            (<img className="imgStyle" 
                  src={this.state.currentEvent.img} 
                  alt="eventImg"/>
            ) 
            : 
            (<div>
              <br/>
              <h1>Create Your Own Event</h1>
              <Divider/>
             </div>
            )
          }
          {this.props.createEventData.title !== '' ? 
            (<List>
              <div className='inputs'>
                <Subheader>Event:</Subheader>
                <p>
                  {this.state.currentEvent.title}
                </p>
                </div>
                <Divider/>
             </List>
            ) 
            : 
            (<div>
              <TextField 
                className='inputs' 
                hintText="Hint Text" 
                floatingLabelText="Title" 
                onChange={this.handleTitleTestValue}
              />
              <br/>
             </div>
            )
          }
          {this.props.createEventData.description !== '' ?
            (<List>
              <div className='inputs'>
                <Subheader>Description:</Subheader>
                <p>
                  {this.props.createEventData.description.length > 100 ?
                   this.props.createEventData.description.slice(0,100) + '...' 
                   : 
                   this.props.createEventData.description 
                  }
                  {this.props.createEventData.url ?
                    (<a href={this.props.createEventData.url} target="_blank">&nbsp;more details</a>
                    ) 
                    : 
                    null
                  }
                </p>
              </div>
              <Divider/>
             </List>
            ) 
            : 
            (<div>
              <TextField 
                className='inputs' 
                hintText="Hint Text" 
                floatingLabelText="Description" 
                onChange={this.handleDescriptionTestValue}
              />
              <br/>
             </div>
            )
          }
          {this.props.createEventData.address !== '' ? 
            (<List>
              <div className='inputs'>
                <Subheader>Address:</Subheader>
                <p>
                  {this.props.createEventData.address}
                </p>
              </div>
              <Divider/>
             </List>) 
            : 
            (<div>
              <TextField 
                className='inputs' 
                hintText="Hint Text" 
                floatingLabelText="Address" 
                onChange={this.handleAddressTestValue}
              />
              <br/>
             </div>
            )
          }
          {this.props.createEventData.city !== '' ? 
            (<List>
                <div className='inputs'>
                <Subheader>City & State:</Subheader>
                <p>
                {this.props.createEventData.city}&nbsp;
                {this.props.createEventData.state}
                </p>
              </div>
              <Divider/>
             </List>) 
            : 
            (<div>
              <TextField 
                className='inputs' 
                hintText="Hint Text" 
                floatingLabelText="City & State" 
                onChange={this.handleCityTestValue}
              />
              <br/>
             </div>
            )
          }
          <List>
          </List>
          {this.props.createEventData.date_time !== undefined ? 
            (<List>
              <div>
                <Subheader>Date and Time:</Subheader>
                <p className='inputs'>
                  {this.props.createEventData.date_time}
                </p>
              </div>
              <Divider/>
             </List>
            ) 
            : 
            (<List>
            <div>
              <TimePicker
                className='inputs'
                format="ampm"
                hintText="12hr Format"
                value={this.state.value12}
                onChange={this.handleChangeTimePicker12}
              />
              <br/>
              <DatePicker
                className='inputs'
                hintText="Controlled Date Input"
                value={this.state.controlledDate}
                onChange={this.handleChangeDate}
              />
            </div>
            </List>)
          }
          <br/>
          <div>
          {
            !!this.props.createEventData.title ?
            (
              (!!this.state.value12 && !!this.state.controlledDate) || !!this.props.createEventData.date_time ?
              (
                <Link to="/plans">
                  <RaisedButton labelColor="white" backgroundColor="#009688" className="createBtn" label="Confirm" disabled={false} onClick={() => this.handleConfirm()}/>
                </Link>
              )
              : 
              (
                <RaisedButton labelColor="white" backgroundColor="#009688" className="createBtn" label="Confirm" disabled={true} onClick={() => this.handleConfirm()}/>
              )
            )
            : 
            (
              !!this.state.value12 && !!this.state.controlledDate && !!this.state.addressTestValue ?
              (
                <Link to="/plans">
                  <RaisedButton labelColor="white" backgroundColor="#009688" className="createBtn" label="Confirm" disabled={false} onClick={() => this.handleConfirm()}/>
                </Link>
              ) 
              : 
              (
                <RaisedButton labelColor="white" backgroundColor="#009688" className="createBtn" label="Confirm" disabled={true} onClick={() => this.handleConfirm()}/>         
              )
            )
          }
          </div>
          <br/>
        </Paper>
       </div>
      )
      : 
      (<div className="alertsContainer">
        <h2 className="alertsTitle"> Create </h2>
        <div className="group">
          <Paper className="groupAuth">
          <div> Please Sign In With Google To Create Events </div>
          <br />
          <a className="add" href="/#/profile">
            <RaisedButton
              labelColor="white"
              backgroundColor="#009688"
              className="add"
              label="Go To Profile"
            />
          </a>
          </Paper>
        </div>
       </div>
      )
  }
}