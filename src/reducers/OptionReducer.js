const initialState = [];


export default function OptionReducer (state = initialState, action) {
    switch (action.type) {
      case "LOAD_OPTIONS":
        return action.payload
      break; 
      case "ADD_OPTION":{
          return {
            ...state,
            ...action.payload,
          }
      }
      break;  
      
      default:
        return state;
    }
}