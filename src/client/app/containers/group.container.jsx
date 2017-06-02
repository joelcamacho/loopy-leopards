import { connect } from 'react-redux';
import GroupPageComponent from '../components/group.component.jsx';
import GroupAction from '../actions/group.action.jsx';
import InvitationsAction from '../actions/invitations.action.jsx';

export default connect(
  function mapStateToProps(state) {
    return {
      group: state.group.toJS(),
      invitations: state.invitations.toJS()
    };
  },
  function mapDispatchToProps(dispatch) {
    return { 
      updateGroup: function(group) {
        return dispatch(GroupAction.updateGroup(group));
      },
      resetGroup: function() {
        return dispatch(GroupAction.resetGroup());
      },
      updateInvitations: function(invitations) {
        return dispatch(InvitationsAction.updateInvitations(invitations));
      },
      resetInvitations: function() {
        return dispatch(InvitationsAction.resetInvitations());
      },
    };
  }
)(GroupPageComponent);