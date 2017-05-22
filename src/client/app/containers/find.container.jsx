import { connect } from 'react-redux';
import FindPageComponent from '../components/find.component.jsx';

export default connect(
  function mapStateToProps(state) {
    return { events: state.events.toJS() };
  },
  function mapDispatchToProps(dispatch) {
    return { dispatch: dispatch };
  }
)(FindPageComponent);
