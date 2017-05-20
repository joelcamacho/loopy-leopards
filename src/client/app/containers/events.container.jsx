import { connect } from 'react-redux';
import EventsPageComponent from '../components/events.component.jsx';

export default connect(
  function mapStateToProps(state) {
    return { state: state };
  },
  function mapDispatchToProps(dispatch) {
    return {dispatch: dispatch};
  }
)(EventsPageComponent);