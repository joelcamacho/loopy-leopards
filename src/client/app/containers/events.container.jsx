import { connect } from 'react-redux';
import EventsPageComponent from '../components/events.component.jsx';

export default connect(
  function mapStateToProps(state) {
    return { event: state.event.toJS() };
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch: dispatch };
  }
)(EventsPageComponent);