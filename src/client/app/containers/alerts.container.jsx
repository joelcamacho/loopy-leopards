import { connect } from 'react-redux';
import AlertsPageComponent from '../components/alerts.component.jsx';
import AlertsAction from '../actions/alerts.action.jsx';

export default connect(
  //App is listening to state
  function mapStateToProps(state) {
    return {
      alerts: state.alerts.toJS(),
      profile: state.profile.toJS(),
      auth: state.auth.toJS()
    }
  },

  function mapDispatchToProps(dispatch) {
    return {
      addAlert: function(alert) {
        return dispatch(AlertsAction.addAlert(alert));
      },
      removeAlert: function(alert) {
        return dispatch(AlertsAction.removeAlert(alert));
      },
      resetAlert: function() {
        return dispatch(AlertsAction.resetAlert());
      },
    };
  }
)(AlertsPageComponent);
