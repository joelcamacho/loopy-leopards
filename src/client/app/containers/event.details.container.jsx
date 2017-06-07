import { connect } from 'react-redux';
import EventDetailsPageComponent from '../components/event.details.component.jsx';
import action from '../actions/events.action.jsx';
import searchUserAction from '../actions/searchUsers.action.jsx';

export default connect(
  function mapStateToProps(state) {
    return { 
      profile: state.profile.toJS(),
      event: state.event,
      users: state.searchUsers,
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
    	searchUsers: function(users) {
        return dispatch(searchUserAction.searchUsers(users));
      },
    };
  }
)(EventDetailsPageComponent);
