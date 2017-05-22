const { fromJS, Map, List } = require('immutable')

const groupInit = fromJS({
  name: 'Loopy Leopards',
  list: [
    {
      name: 'Giancarlo',
      phone: '123-123-1234'
    },
    { 
      name: 'Joe',
      phone: '987 merge sort'
    }
  ]
});

export default function group(state = groupInit, action) {
  switch (action.type) {
    case 'ADD_TO_GROUP':
      return state.map((v, k) => k === 'list' ? v.push(action.payload) : v);
    case 'REMOVE_FROM_GROUP':
      let idx;

      state.toJS().list.forEach((v, index) => {
        if(v.phone === action.payload.phone) {
          idx = index;
        }
      });

      return idx !== undefined ?
        state.map((v, k) => k === 'list' ? v.splice(idx, 1) : v)
        : state;
    case 'RESET_GROUP': 
   		return fromJS({
        name: '',
        list: []
      });
    default:
     	return state
  }
}