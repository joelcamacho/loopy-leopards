const { fromJS, Map, List } = require('immutable')

const groupInit = fromJS({
  name: 'Loopy Leopards',
  creator_id: 1,
  members: [
    {
      name: 'Eric Hoffman',
      photo: null,
      phone: '123-123-1234'
    },
    {
      name: 'Kimmy J',
      photo: 'https://static.seekingalpha.com/uploads/2016/4/957061_14595169907724_rId15.jpg',
      phone: '123-123-KimJ'
    },
    {
      name: 'Brendan Lim',
      photo: null,
      phone: '123-123-1243'
    },
  ],
});

const emptyInit = fromJS({
  name: null,
  creator_id: null,
  members: [],
  invitees: [],
  requests: []
});

export default function group(state = emptyInit, action) {
  switch (action.type) {
    case 'UPDATE_GROUP':
      return fromJS(action.payload);
    case 'RESET_GROUP': 
   		return emptyInit;
    default:
     	return state;
  }
}