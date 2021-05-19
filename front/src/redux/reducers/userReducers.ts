import { LOG_IN, LOG_OUT } from '../actions/userActions';

const initialState = {
  isLoggedIn: false,
  user: null,
};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case LOG_IN:
      return {
        ...state,
        isLoggedIn: true,
        user: action.data,
      };
    case LOG_OUT:
      return initialState;
    default:
      return {
        ...state,
      };
  }
};

export default reducer;
