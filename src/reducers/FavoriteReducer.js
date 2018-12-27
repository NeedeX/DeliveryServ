const INITIAL_STATE = [];


export default function FavoriteReduces (state = INITIAL_STATE, action) {
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
       return state.filter(favorite => favorite.idFavorite !== action.payload.idFavorite)
        break;
      case "CLEAR_FAVORITE":

        return INITIAL_STATE;
        break;
      default:
        return state;
    }
}