import { connect } from 'react-redux';
import EventsPageComponent from '../components/events.component.jsx';
import action from '../actions/events.action.jsx';

export default connect(
  function mapStateToProps(state) {
    console.log("state.events: ", state.events)
    return {
      createdEventsData: state.createdEvents
    };
  },
  function mapDispatchToProps(dispatch) {
    return {     	
    	eventDetails: function(events) {
    		return dispatch(action.eventDetails(events));
    	},
      createdEvents: function(events) {
        return dispatch(action.createdEvents(events));
      }
    };
  }
)(EventsPageComponent);