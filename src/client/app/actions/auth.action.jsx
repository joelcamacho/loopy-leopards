let actions = {
  updateUser: function(user) {
    return {
      type: 'UPDATE_USER',
      payload: user
    }
  },
  resetUser: function() {
    return  {
      type: 'RESET_USER',
      payload: null
    }
  }
};

export default actions;