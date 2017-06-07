import { connect } from 'react-redux';
import EventDetailsComponent from '../components/event.details.component.jsx';
import action from '../actions/events.action.jsx';

export default connect(
	function mapStateToProps(state) {
		return {
			profile: state.profile.toJS(),
			event: state.event,
		};
	},
	function mapDispatchToProps(dispatch) {
		return {
			dipatch
		};
	}
)