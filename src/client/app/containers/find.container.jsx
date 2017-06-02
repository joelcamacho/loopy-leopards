import { connect } from 'react-redux';
import FindPageComponent from '../components/find.component.jsx';
import action from '../actions/events.action.jsx';
import profileActions from '../actions/profile.action.jsx';

export default connect(
	//App is listening to state
  function mapStateToProps(state) {
    return { 
      events: state.events,
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
      updateProfile: function(profile) {
        return dispatch(profileActions.updateProfile(profile));
      },
    }
  }
)(FindPageComponent);
