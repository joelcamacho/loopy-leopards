const { fromJS, Map, List } = require('immutable')

const groupUsers = fromJS([
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

export default function getGroupUsers(state = groupUsers, action) {

  switch (action.type) {
    case 'GROUP_USERS':
    return fromJS(action.payload);
    default:
     	return state;
  }
}