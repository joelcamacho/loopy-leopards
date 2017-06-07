import { connect } from 'react-redux';
import EventsPageComponent from '../components/events.component.jsx';
import action from '../actions/events.action.jsx';

export default connect(
  function mapStateToProps(state) {
    return {};
  },
  function mapDispatchToProps(dispatch) {
    return {     	
    	eventDetails: function(event) {
    		return dispatch(action.eventDetails(event));
    	},
      updateEvent: function(event) {
        return dispatch(action.updateEvent(event))
      }
    };
  }
)(EventsPageComponent);