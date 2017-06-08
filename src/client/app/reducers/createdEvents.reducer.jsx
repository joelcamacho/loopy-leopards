const { fromJS, Map, List } = require('immutable')

const eventsInit = fromJS([
  {
    date: '',
    events: [],
  },
  { 
    date: '',
    events: [],
  }
]);

export default function createdEvents(state = [], action) {
  switch (action.type) {
    case 'CREATED_EVENTS':
      return action.payload;
    default:
      return state;
  }
}