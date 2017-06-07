let action = {

  // getEvents: function() {

  //         fetch('/api/eventbrite')
  //             .then(res => {
  //                 console.log("Received data from Api: ", res);
  //                 dispatch(action.getEvent(events));
  //             }).catch(error => {
  //             console.log("Can not received data from Api!!!");
  //         });
  // },

  // getEvent: event => ({
  //     type: 'ADD_TO_EVENTS',
  //     payload: event
  // }),

  addBulkEvents: function(events) {
    return {
        type: 'ADD_BULK_TO_EVENTS',
        payload: events,
    }
  },

  createEvent: function(event) {
    return {
      type: "CREATE_EVENT",
      payload: event,
    }
  },

  setStateBackToDefault: function(event) {
    return {
      type: "SET_STATE_BACK_TO_DEFAULT",
      payload: event,
    }
  },

  eventDetails: function(event) {
    return {
      type: "EVENT_DETAILS",
      payload: event
    }
  }
};

export default action;