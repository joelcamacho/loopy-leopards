import { connect } from 'react-redux';
import EventsPageComponent from '../components/events.component.jsx';

export default connect(
  function mapStateToProps(state) {
    return { 
      profile: state.profile.toJS(),
    };
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch: dispatch };
  }
)(EventsPageComponent);