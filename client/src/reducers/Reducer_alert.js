import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

//receive state & type by dispatch function in action file
export default function (state = initialState, action) {

  // get obj "type" & "payload" from paramter "action"
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter(alert => alert.id !== payload); // payload is the id of current alert id in state
    default:
      return state;
  }

}
