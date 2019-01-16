const INITIAL_STATE = 
{
  UIDClient: '519d772436da44bf1528',
  URL: 'http://mircoffee.by/deliveryserv/app/',
  CITY: 'Витебск', /// город введенный поумолчанию при оформлении заказа
  pushNotification: true, // вкл-выкл уведомлений
  addressSelect: undefined, // адрес для доставки
  addressPickup: undefined, // выбранный адрес для самовывоза
   
};


export default function OptionReducer (state = INITIAL_STATE, action) {
    switch (action.type) {
      case "LOAD_OPTIONS":
      return {
        ...state,
        ...action.payload,
      }
      break; 
      case "ADD_OPTION":{
          return {
            ...state,
            ...action.payload,
          }
      }
      break;
      case "ADD_OPTION_ID_PICKUP":{
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