const initialState = [];


export default function ProductsReducer (state = initialState, action) {
    switch (action.type) {
      case "LOAD_PRODUCTS":
        return action.payload;
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