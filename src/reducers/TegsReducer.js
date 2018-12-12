const INITIAL_STATE = [];

export default function TegsReducer (state = INITIAL_STATE, action) {
    switch (action.type) {
      case "LOAD_TEGS":
        return action.payload
        break;
      default:
        return state;
    }
}