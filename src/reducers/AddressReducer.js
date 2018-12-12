const INITIAL_STATE = [];


export default function AddressReducer (state = INITIAL_STATE, action) {
    switch (action.type) {
        case "LOAD_ADDERESSES":
            return action.payload
        break;
        case "ADD_ADDRESS":  
            return [
            ...state,
            action.payload
            ]
        break; 
        case "CLEAR_ADDRESSES":
            //console.log("CLEAR_CART");
            return INITIAL_STATE;
        break;
        case "DELETE_ADDRESS":
            //console.log(action.payload.idAddress)
            return state.filter(addresses => addresses.idAddress !== action.payload.idAddress)
        break;
        /*      
      case "ADD_CART":
       
       
        return [
          ...state,
          action.payload
        ]
        break;      
      */
      default:
        return state;
    }
}