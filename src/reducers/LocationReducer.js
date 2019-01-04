const INITIAL_STATE = [];


export default function LocationReduces (state = INITIAL_STATE, action) {
    switch (action.type) {
      case "LOAD_LOCATION":
        return action.payload
        break; 
      
      default:
        return state;
    }
}