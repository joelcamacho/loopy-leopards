import { connect } from 'react-redux';
import CreatePageComponent from '../components/create.component.jsx';
import searchUserAction from '../actions/searchUsers.action.jsx';
import action from '../actions/events.action.jsx';

export default connect(
  //App is listening to state
  function mapStateToProps(state) {
    return { 
      events: state.events,
      createEventData: state.createEvent.toJS(),
      users: state.searchUsers,
      profile: state.profile.toJS(),
    };
  },

  function mapDispatchToProps(dispatch) {
    return {
			addEvents: function(events) {
				return dispatch(action.addBulkEvents(events));
			},
      createEvent: function(event) {
        return dispatch(action.createEvent(event));
      },
      setStateBackToDefault: function(event) {
        return dispatch(action.setStateBackToDefault(event));
      },
    }
  }
)(CreatePageComponent);
