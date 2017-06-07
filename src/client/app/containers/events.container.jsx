import { connect } from 'react-redux';
import EventsPageComponent from '../components/events.component.jsx';
import action from '../actions/events.action.jsx';

export default connect(
  function mapStateToProps(state) {
    return {};
  },
  function mapDispatchToProps(dispatch) {
    return {     	
    	eventDetails: function(events) {
    		return dispatch(action.eventDetails(events));
    	},
    };
  }
)(EventsPageComponent);