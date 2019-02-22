const INITIAL_STATE = {
  addressPickup: 0,
  addressDelivery: 0,
  addressDeliveryInput: 0,
};


export default function OrderReducer (state = INITIAL_STATE, action) {
    switch (action.type) {
      case "LOAD_ORDER":
        return [
          ...state,
          action.payload
        ]
        break;   
      case "ADD_ITEM":{
        return {
          ...state,
          ...action.payload,
        }
      }   
      case "ADD_ORDER":  
        return [
          ...state,
          action.payload
        ]
        break;  
      case "CLEAR_ORDER":
        //console.log("CLEAR_CART");
        return INITIAL_STATE;
        break;    
      case "DELETE_ORDER":
      //console.log(action.payload.id);
      
       return state.filter(order => order.id !== action.payload.id)

        break;
      default:
        return state;
    }
}