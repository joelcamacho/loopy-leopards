let actions = {
  updateInvitations: function(invitations) {
    return {
      type: 'UPDATE_INVITATIONS',
      payload: invitations
    }
  },
  resetInvitations: function() {
    return  {
      type: 'RESET_INVITATIONS',
      payload: null
    }
  }
};

export default actions;