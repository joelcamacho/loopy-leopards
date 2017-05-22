let group = {
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
};

export default function group(state = group, action) {
  switch (action.type) {
    case 'ADD_TO_GROUP':
      state.list.push(action.payload);
      return Object.assign({}, state);
    case 'REMOVE_FROM_GROUP':
      state.list = state.list.map((obj) => obj.name === action.payload.name && obj.phone === action.payload.phone ? null : obj);
      state.list = state.list.filter((obj) => !!obj);
      return Object.assign({}, state);
    case 'RESET_GROUP': 
   		return  {
        name: '',
        list: []
      };
    default:
     	return state
  }
}