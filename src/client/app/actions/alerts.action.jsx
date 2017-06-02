let actions = {
  addAlert: function(alert) {
    return {
      type: 'ADD_ALERT',
      payload: alert
    }
  },
  removeAlert: function(alert) {
    return {
      type: 'REMOVE_ALERT',
      payload: alert
    }
  },
  resetAlert: function() {
    return  {
      type: 'RESET_ALERT',
      payload: null
    }
  }
};

export default actions;