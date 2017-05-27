const { fromJS, Map, List } = require('immutable')

const userSimpleData = fromJS([
    {
      name: null,
      photo: null,
      phone: null,
    },
    {
      name: null,
      photo: null,
      phone: null,
    }

]);

export default function profile(state = userSimpleData, action) {
  switch (action.type) {
    case 'SEARCH_USERS':
    return action.payload;
    default:
     	return state;
  }
}