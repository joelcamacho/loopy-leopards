import { connect } from 'react-redux';
import FindPageComponent from '../components/find.component.jsx';
import action from '../actions/events.action.jsx';

export default connect(
	//App is listening to state
  function mapStateToProps(state) {
    return { 
    	state: state
    };
  },

  function mapDispatchToProps(dispatch) {
    return {
    	
    	addEvents: function(events) {
    		return dispatch(action.addBulkEvents(events));
    	}
    }
  }
)(FindPageComponent);
