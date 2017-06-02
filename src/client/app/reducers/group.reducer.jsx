const { fromJS, Map, List } = require('immutable')

const groupInit = fromJS({
  name: 'Loopy Leopards',
  creator_id: 1,
  creator: {
    name: 'Gangplank',
    photo: null,
    phone: '321-321-4321'
  },
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
  invited: [
    {
      name: 'Kimmy J J',
      photo: null,
      phone: '412-123-1234'
    },
    {
      name: 'Ra',
      photo: null,
      phone: '123-123-4124'
    }
  ],
  requested: [
    {
      name: 'Kimmy J Jd',
      photo: null,
      phone: '412-123-1234'
    },
    {
      name: 'Rae',
      photo: null,
      phone: '123-123-4124'
    }
  ]
});

const emptyInit = fromJS({
  name: null,
  creator_id: null,
  creator: {
    name: null,
    photo: null,
    phone: null
  },
  members: [],
  invited: [],
  requested: []
});

export default function group(state = emptyInit, action) {
  switch (action.type) {
    case 'UPDATE_GROUP':
      return fromJS(action.payload);
    case 'RESET_GROUP': 
   		return fromJS({
      name: null,
      creator_id: null,
      creator: {
        name: null,
        photo: null,
        phone: null
      },
      members: [],
      invited: [],
      requested: []
    });
    default:
     	return state
  }
}