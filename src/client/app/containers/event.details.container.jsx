import { connect } from 'react-redux';
import EventDetailsPageComponent from '../components/event.details.component.jsx';
import action from '../actions/events.action.jsx';

export default connect(
	function mapStateToProps(state) {
		return { 
			profile: state.profile.toJS(),
			event: state.event,
			eventDetails: state.event.toJS(),
		};
	},
	function mapDispatchToProps(dispatch) {
		return {
			getEventDetails: function(event) {
				return dispatch(action.eventDetails(event));
			},
			updateEvent: function(event) {
				return dispatch(action.updateEvent(event));
			}
		};
	}
)(EventDetailsPageComponent);
