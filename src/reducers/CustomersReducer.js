const INITIAL_STATE = [];


export default function CustomersReduces (state = INITIAL_STATE, action) {
    switch (action.type) {
      case "LOAD_CUSTOMERS":
        return action.payload
        break; 
      
      default:
        return state;
    }
}