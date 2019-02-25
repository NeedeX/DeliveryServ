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
        break; 
      case "EDIT_PUSH":

        state.userDB.iPushNotification = action.payload;
        var userDB = state.userDB;
        return{
          ...state,
          userDB
          };
        break; 
      case "EDIT_NAME":

        state.userDB.chFIO = action.payload;
        var userDB = state.userDB;
        return{
          ...state,
          userDB
          };
        break;
      case "EDIT_DateOfBirth":
        state.userDB.chDateOfBirth = action.payload;
        var userDB = state.userDB;
        return{
          ...state,
          userDB
          };
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