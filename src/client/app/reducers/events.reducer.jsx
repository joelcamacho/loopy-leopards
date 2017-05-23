const { fromJS, Map, List } = require('immutable')

const eventsInit = fromJS([
  {
    photo: '',
    title: '',
    date: Date.now(),
    description: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    cost: '',
    list: [
      {
        name: '',
        phone: ''
      }
    ],
    activeState: null
  },
  {
    photo: '',
    title: '',
    date: Date.now(),
    description: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    cost: '',
    list: [
      {
        name: '',
        phone: ''
      }
    ],
    activeState: null
  }
]);
//[35].logo.original.url
export default function events(state = eventsInit, action) {
  switch (action.type) {
    case 'ADD_BULK_TO_EVENTS':
      state = state.concat(action.payload);
      console.log("Now the state looks like: ", state);
      return state.slice();
    case 'ADD_TO_EVENTS':
      return state.push(action.payload);
    case 'REMOVE_FROM_EVENT':
      let idx;

      state.toJS().forEach((v, index) => {
        if(v.title === action.payload.title) {
          idx = index;
        }
      });

      return idx !== undefined ? state.splice(idx, 1) : state;
    case 'RESET_GROUP': 
      return fromJS([]);
    default:
      return state
  }
}