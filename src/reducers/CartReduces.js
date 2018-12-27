const INITIAL_STATE = [];


export default function CartReduces (state = INITIAL_STATE, action) {
    switch (action.type) {
      case "LOAD_CATEGORIES_SUCCESS":
        return [
          ...state,
          action.payload
        ]
        break;      
      case "ADD_CART":  
        return [
          ...state,
          action.payload
        ]
        break;      
      case "EDIT_CART":
        // проходим по основному state
        const updatedRootItems = state.map(item => {
          if(item.idInCart === action.payload.idInCart){
            //console.log("item.idInCart", item.idInCart);
            
            return {...item, ...action.payload};
          }
          return item;
        });
        return updatedRootItems;
        break;
      case "DELETE_CART":
      //console.log(action.payload.id)
        return state.filter(cart => cart.idInCart !== action.payload.idInCart)
        break;
      case "CLEAR_CART":
        //console.log("CLEAR_CART");
        return INITIAL_STATE;
        break;
      default:
        return state;
    }
}