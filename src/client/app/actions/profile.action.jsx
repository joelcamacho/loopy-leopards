let actions = {
  updateProfile: function(profile) {
    return {
      type: 'UPDATE_PROFILE',
      payload: profile
    }
  },
  resetProfile: function() {
    return  {
      type: 'RESET_PROFILE',
      payload: null
    }
  }
};

export default actions;