const { fromJS, Map, List } = require('immutable')

const allUsers = fromJS([
    {
      name: null,
      photo: null,
      id: null,
    },
    {
      name: null,
      photo: null,
      id: null,
    }
]);

export default function getAllUsers(state = allUsers, action) {
  switch (action.type) {
    case 'USERS_DATA':
    return fromJS(action.payload);
    default:
     	return state;
  }
}