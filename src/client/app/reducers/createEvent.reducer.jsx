const { fromJS, Map, List } = require('immutable')

const createEventInit = fromJS({
  img: '',
  title: '',
  description: '',
  address: '',
  city: '',
  state: '',
  phone: '',
  activeState: 'In progress',
  invitees: [],
});

export default function createEvent(state = createEventInit, action) {
  switch (action.type) {
    case "CREATE_EVENT":
      return fromJS(action.payload);
    case "SET_STATE_BACK_TO_DEFAULT":
      return createEventInit;
    default:
      return state
  }
}