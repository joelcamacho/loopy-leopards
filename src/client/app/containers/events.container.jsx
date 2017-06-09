import { connect } from 'react-redux';
import EventsPageComponent from '../components/events.component.jsx';
import action from '../actions/events.action.jsx';

export default connect(
  function mapStateToProps(state) {
    return {
      createdEventsData: state.createdEvents,
      profile: state.profile.toJS(),
    };
  },
  function mapDispatchToProps(dispatch) {
    return {     	
    	eventDetails: function(event) {
    		return dispatch(action.eventDetails(event));
    	},
      updateEvent: function(event) {
        return dispatch(action.updateEvent(event))
      },

      createdEvents: function(events) {
        return dispatch(action.createdEvents(events));

      }
    };
  }
)(EventsPageComponent);