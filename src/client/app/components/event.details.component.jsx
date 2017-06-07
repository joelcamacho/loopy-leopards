import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    minHeight: '85vh',
    padding: '10pt',
  },
  gridList: {
    width: 727,
    overflowY: 'auto',
  },
  customContentStyle: {
    width: '100%',
    maxWidth: 'none',
  },
  googleMapStyle: {
    width: '720px',
    height: '450px',
  }
};

export default class EventDetailsComponent extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			details,
			eventIsActive,
			userIsEventCreator,
			invitees,
			votes,
		};
	}

	render() {
		return this.props.profile.id === this.props.event.creator_id ? 
		(
			<div>
		        <Tabs className="tabsContainer" tabItemContainerStyle={{backgroundColor: "lightslategrey", position: 'fixed', zIndex: '5'}}>
		        <Tab className="tabsItem" label="Schedule" >
		          <div style={styles.root}>
		            <h1 style={{margin:'40 20 0 0'}}>Today</h1>
		            <GridList
		              cols={1}
		              cellHeight={180}
		              style={styles.gridList}
		            >
		              <Subheader>&nbsp;</Subheader>
		              {this.state.userEvents.filter(event => event.date === today).map((event) => 
		                (<GridTile
		                  key={event.time}
		                  title={event.time}
		                  subtitle={<span><b>{event.description}</b></span>}
		                  onClick={() => this.handleOpen(event)}
		                >
		                  <img src={event.img} />
		                </GridTile>
		              ))}
		            </GridList>
		          </div>
		        </Tab>
		        <Tab className="tabsItem" label="All Plans" >
		          {this.state.eventsDays.map(eventdate => (
		            <div style={styles.root}>
		              <h1 style={{margin:'40 20 0 0'}}>{eventdate.date}</h1>
		              <GridList
		                cols={1}
		                padding={15}
		                cellHeight={180}
		                style={styles.gridList}
		                key={eventdate.date}
		              >
		                <Subheader>&nbsp;</Subheader>
		                {eventdate.events.map(event => 
		                  (<GridTile 
		                    key={event.time}
		                    title={event.time}
		                    subtitle={<span><b>{event.description}</b></span>}
		                    actionIcon={<span><b style={{color: "white"}}>{event.vote_count}</b><IconButton onClick={() => this.handleVote(event)}><ThumbUp color="white" /></IconButton></span>}
		                  >
		                    <img onClick={() => this.handleOpen(event)} src={event.img} />
		                  </GridTile>
		                ))}
		              </GridList>
		            </div>
		          ))}
		        </Tab>
		      </Tabs>
		      <Dialog
		        title="Event Detail"
		        actions={<FlatButton label="Confirm" primary={true} onTouchTap={this.handleClose} />}
		        modal={false}
		        open={this.state.open}
		        onRequestClose={this.handleClose}
		        autoScrollBodyContent={true}
		      >
		        <br/>
		        {this.state.eventDetails.img !== '' ? (<img src={this.state.eventDetails.img} alt="eventImg"/>) : null}
		        {this.state.eventDetails.name !== '' ? (<List><div><Subheader>Event:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.name}</p></div><Divider/></List>) : null}
		        {this.state.eventDetails.description !== undefined ? (<List><div><Subheader>Description:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.description.length > 100 ? this.state.eventDetails.description.slice(0,100) + '...' : this.state.eventDetails.description }{this.state.eventDetails.url ? (<a href={this.state.eventDetails.url} target="_blank">&nbsp;more details</a>) : null}</p></div><Divider/></List>) : null}
		        {this.state.eventDetails.date_Time !== '' ? (<List><div><Subheader>Event start:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.date_Time}</p></div><Divider/></List>) : null}
		        {this.state.eventDetails.address !== '' ? (<List><div><Subheader>Address:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.address}</p><RaisedButton label="Map Open" onTouchTap={() => this.handleGoogleMapOpen(this.state.eventDetails)} /></div><br/><Divider/></List>) : null}
		        {this.state.eventDetails.city !== '' ? (<List><div><Subheader>City:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.city}</p></div><Divider/></List>) : null}
		        {this.state.eventDetails.state !== '' ? (<List><div><Subheader>State:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.state}</p></div><Divider/></List>) : null}
		        {this.state.eventDetails.phone !== '' ? (<List><div><Subheader>Phone:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.phone}</p></div><Divider/></List>) : null}
		        {this.state.eventDetails.date_Time !== '' ? (<List><div><Subheader>Group:</Subheader><p>&nbsp;&nbsp;&nbsp;&nbsp;{this.state.eventDetails.date_Time}</p></div><Divider/></List>) : null}
		          
		      </Dialog>
		      <Dialog
		        title="The Location Of Your Event"
		        actions={<FlatButton label="Cancle" primary={true} onTouchTap={this.handleGoogleMapClose} />}
		        modal={false}
		        open={this.state.googleMapOpen}
		        onRequestClose={this.handleGoogleMapClose}
		        autoScrollBodyContent={true}
		      >
		        <br/>
		        { this.state.displaydirectionDetails ? 
		          (<div>
		            <div>
		              <p>Current Address(A): {this.state.directionDetails.currentAddress}</p>
		            </div>
		            <div>
		              <p>Derection Address(B): {this.state.eventDetails.address}</p>
		            </div>
		            <div>
		              <p>Transportation: {this.state.directionDetails.transportation}</p>
		            </div>
		            <div>
		              <p>Distance: {this.state.directionDetails.distance}</p>
		            </div>
		            <div>
		              <p>Time: {this.state.directionDetails.time}</p>
		            </div>
		          </div>)
		          : null
		        }
		        <div id="map" style={styles.googleMapStyle}></div>
		        <br/>
		        {this.state.directionButtonShowOrHide ? (<RaisedButton label="Direction" fullWidth="true" disabled={this.state.directionButton} onTouchTap={() => this.handleGetDirection(this.state.eventDetails, 'DRIVING')}/>) : null}
		        {this.state.displaydirectionDetails ? (<RaisedButton label="TRANSIT" fullWidth="true" disabled={this.state.transportationButton} onTouchTap={() => this.handleGetDirection(this.state.eventDetails, 'TRANSIT')}/>) : null}
		        {this.state.displaydirectionDetails ? (<RaisedButton label="DRIVING" fullWidth="true" disabled={this.state.transportationButton} onTouchTap={() => this.handleGetDirection(this.state.eventDetails, 'DRIVING')}/>) : null}
		        {this.state.displaydirectionDetails ? (<RaisedButton label="BICYCLING" fullWidth="true" disabled={this.state.transportationButton} onTouchTap={() => this.handleGetDirection(this.state.eventDetails, 'BICYCLING')}/>) : null}
		        {this.state.displaydirectionDetails ? (<RaisedButton label="WALKING" fullWidth="true" disabled={this.state.transportationButton} onTouchTap={() => this.handleGetDirection(this.state.eventDetails, 'WALKING')}/>) : null}
		      </Dialog>
		    </div>);
		)
		: 
		(

		)

    let date = new Date();
    let today = date.toLocaleDateString();
    console.log("description: ", this.state.eventDetails.date_Time)
  }
}