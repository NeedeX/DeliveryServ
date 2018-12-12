const INITIAL_STATE = [];


export default function CategoriesReducer (state = INITIAL_STATE, action) {
    switch (action.type) {
      case "LOAD_CATEGORIES":
        return action.payload
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