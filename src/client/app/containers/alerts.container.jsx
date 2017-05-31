import { connect } from 'react-redux';
import AlertsPageComponent from '../components/alerts.component.jsx';

export default connect(
  //App is listening to state
  function mapStateToProps(state) {
    return {};
  },

  function mapDispatchToProps(dispatch) {
    return {};
  }
)(AlertsPageComponent);
