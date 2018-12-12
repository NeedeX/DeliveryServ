
const INITIAL_STATE = {
  current: [],
  possible: [
    'Allie',
    'Gator',
    'Lizzie',
    'Reptar',
  ],
  cart: 0,
};
export default function friendReducer (state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'ADD_FRIEND':
      // Вытягивает текущее и возможное из предыдущего состояния
      // Мы не хотим напрямую изменять состояние в случае
      // другое действие изменяет его одновременно
      const {
        current,
        possible,
      } = state;

      // Извлеките друга из друзей.
      // Обратите внимание, что action.payload === friendIndex
      const addedFriend = possible.splice(action.payload, 1);

      // И поместите друга в friends.current
      current.push(addedFriend);

      // Finally, update our redux state
      const newState = { current, possible };
      return newState;
    default:
      return state;
  }
};