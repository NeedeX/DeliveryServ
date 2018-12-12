const initialState = [];


export default function CommercialOfferReducer (state = initialState, action) {
    switch (action.type) {
      case "LOAD_OFFERS":
        return [
          ...state,
          action.payload
        ]
        break; 
        /*     
      case "ADD_CART":
       
       
        return [
          ...state,
          action.payload
        ]
        break;     */ 
      
      default:
        return state;
    }
}