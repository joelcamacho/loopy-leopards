let events = [
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
];

export default function events(state = events, action) {
  switch (action.type) {
    case 'ADD_TO_EVENTS':
      state.push(action.payload);
      return state.slice();
    case 'REMOVE_FROM_EVENT':
      let idx = 0;
      state.forEach((event, i) => {
        if(event.title === action.payload.title) {
          idx = i;
        } 
      });
      state.splice(idx, 1);
      return state.slice();
    case 'RESET_GROUP': 
      return  [];
    default:
      return state
  }
}