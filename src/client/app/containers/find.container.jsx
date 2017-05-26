import { connect } from 'react-redux';
import FindPageComponent from '../components/find.component.jsx';
import action from '../actions/events.action.jsx';
import searchUserAction from '../actions/searchUsers.action.jsx';

export default connect(
	//App is listening to state
  function mapStateToProps(state) {
    console.log("***************", state)
    return { 
      events: state.events,
      event: state.event,
      users: state.searchUsers,
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
      searchUsers: function(users) {
        return dispatch(searchUserAction.searchUsers(users));
      },
    }
  }
)(FindPageComponent);
