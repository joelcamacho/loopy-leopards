import { connect } from 'react-redux';
import NavComponent from '../components/nav.component.jsx';
import authActions from '../actions/auth.action.jsx';
import profileActions from '../actions/profile.action.jsx';
import alertsActions from '../actions/alerts.action.jsx';

export default connect(
  function mapStateToProps(state) {
    return {
      auth: state.auth.toJS(),
      profile: state.profile.toJS()
    };
  },
  function mapDispatchToProps(dispatch) {
    return { 
      updateUser: (user) => dispatch(authActions.updateUser(user)),
      resetUser: () => dispatch(authActions.resetUser()),
      updateProfile: (profile) => dispatch(profileActions.updateProfile(profile)),
      resetProfile: () => dispatch(profileActions.resetProfile()),
      addAlert: (alert) => dispatch(alertsActions.addAlert(alert))
    };
  }
)(NavComponent);
