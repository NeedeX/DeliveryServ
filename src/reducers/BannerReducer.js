const INITIAL_STATE = [];


export default function BannerReduces (state = INITIAL_STATE, action) {
    switch (action.type) {
      case "LOAD_BANNERS":
        return action.payload

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