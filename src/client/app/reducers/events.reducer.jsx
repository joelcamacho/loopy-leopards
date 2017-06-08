const { fromJS, Map, List } = require('immutable')

const eventsInit = fromJS([
  {
    status: 'first',
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
    status: 'first',
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

export default function events(state = [], action) {
  switch (action.type) {
    case 'ADD_BULK_TO_EVENTS':
      return action.payload;
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
    case 'CREATED_EVENTS':
      return action.payload;
    default:
      return state
  }
}