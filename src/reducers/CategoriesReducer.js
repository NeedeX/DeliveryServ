const initialState = [];


export default function CategoriesReducer (state = initialState, action) {
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