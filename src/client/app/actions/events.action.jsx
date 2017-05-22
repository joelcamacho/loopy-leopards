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
            payload: events
        }
    }
};

export default action;