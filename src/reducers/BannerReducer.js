const initialState = [];


export default function BannerReduces (state = initialState, action) {
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