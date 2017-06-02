const { fromJS, Map, List } = require('immutable')

const invitationInit = fromJS([
  {
    name: 'Loopy Leopards',
    creator_id: 1,
    creator: {
      name: 'Gangplank',
      photo: null,
      phone: '321-321-4321'
    },
    members: [],
    invited: [],
    requested: []
  },
  {
    name: 'Raging Rhinos',
    creator_id: 1,
    creator: {
      name: 'Gangplank',
      photo: null,
      phone: '321-321-4321'
    },
    members: [],
    invited: [],
    requested: []
  },
  {
    name: 'Jumping Giraffes',
    creator_id: 1,
    creator: {
      name: 'Gangplank',
      photo: null,
      phone: '321-321-4321'
    },
    members: [],
    invited: [],
    requested: []
  },
]);

export default function invitation(state = invitationInit, action) {
  switch (action.type) {
    case 'UPDATE_INVITATION':
      return fromJS(action.payload);
    case 'RESET_INVITATION': 
      return fromJS([]);
    default:
      return state
  }
}