const INITIAL_STATE = [];


export default function HistoryReducer (state = INITIAL_STATE, action) {
    switch (action.type) {
        case "LOAD_HISTORY":
            return action.payload
        break;
        case "EDIT_VIEW_HISTORY":
            // проходим по основному state
            const updatedRootItems = state.map(item => {
                if(item.idOrder === action.payload.idOrder){
                    console.log("action.payload.idOrder", action.payload.isView);
                    return {...item, ...action.payload};
                }
                return item;
            });
            return updatedRootItems;
        break;
        case "CLEAR_HISTORY":
        return INITIAL_STATE;
        break;   
    default:
        return state;
    }
}