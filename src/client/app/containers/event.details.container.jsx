import { connect } from 'react-redux';
import EventDetailsPageComponent from '../components/event.details.component.jsx';
import action from '../actions/events.action.jsx';
import searchUserAction from '../actions/searchUsers.action.jsx';
import eventDetailsAction from '../actions/eventDetails.action.jsx';

export default connect(
	function mapStateToProps(state) {
		return { 
			profile: state.profile.toJS(),
			event: state.event.toJS(),
			eventDetails: state.event.toJS(),
			users: state.searchUsers,
      		groupUsersData: state.groupUsers.toJS(),
      		allUsers: state.allUsers.toJS(),
		};
	},
	function mapDispatchToProps(dispatch) {
		return {
			getEventDetails: function(event) {
				return dispatch(action.eventDetails(event));
			},
			searchUsers: function(users) {
        		return dispatch(searchUserAction.searchUsers(users));
      		},
      		getGroupUsers: function(groupUsers) {
      			return dispatch(eventDetailsAction.groupUsers(groupUsers));
      		},
      		getUsersData: function(usersData) {
      			return dispatch(eventDetailsAction.usersData(usersData));
      		},
			updateEvent: function(event) {
				return dispatch(action.updateEvent(event));
			}
		};
	}
)(EventDetailsPageComponent);
