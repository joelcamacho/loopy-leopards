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
]);

const emptyInit = fromJS([]);

export default function invitation(state = invitationInit, action) {
  switch (action.type) {
    case 'UPDATE_INVITATIONS':
      return fromJS(action.payload);
    case 'RESET_INVITATIONS': 
      return emptyInit;
    default:
      return state
  }
}