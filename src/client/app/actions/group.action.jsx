let actions = {
  updateGroup: function(group) {
    return {
      type: 'UPDATE_GROUP',
      payload: group
    }
  },
  resetGroup: function() {
    return  {
      type: 'RESET_GROUP',
      payload: null
    }
  }
};

export default actions;