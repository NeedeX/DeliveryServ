const INITIAL_STATE = [];


export default function CartReduces (state = INITIAL_STATE, action) {
    switch (action.type) {
      case "LOAD_FAVORITES":
        return action.payload
        break;      
      case "ADD_FAVORITE":  
        return [
          ...state,
          action.payload
        ]
        break;      
      case "DELETE_FAVORITE":
      //console.log(action.payload.id)
       return state.filter(favorite => favorite.idFavorite !== action.payload.idFavorite)
        break;
      case "CLEAR_FAVORITE":
        //console.log("CLEAR_CART");
        return INITIAL_STATE;
        break;
      default:
        return state;
    }
}