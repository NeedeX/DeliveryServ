const initialState = [];


export default function UserReducer (state = initialState, action) {
    switch (action.type) {
      case "LOAD_USER":
      return action.payload
        break; 
      case "EDIT_USER":
        return {
        ...state,
        ...action.payload
        }
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