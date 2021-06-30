import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';
import user from './user';
import movie from './movie';

// (이전 상태, 액션) => 다음 상태. reducer 초기화 시 default 부분 실행됨.
const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log('HYDRATE', action);
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        user,
        movie,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;
