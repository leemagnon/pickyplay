import produce from 'immer';

export const initialState = {
  randomMovie: {
    _id: '',
    stlls: [],
  },
  loadRandomMovieLoading: false, // 랜덤 포스터 로딩 중
  loadRandomMovieDone: false,
  loadRandomMovieError: null,
};

export const LOAD_RANDOM_MOVIE_REQUEST = 'LOAD_RANDOM_MOVIE_REQUEST';
export const LOAD_RANDOM_MOVIE_SUCCESS = 'LOAD_RANDOM_MOVIE_SUCCESS';
export const LOAD_RANDOM_MOVIE_FAILURE = 'LOAD_RANDOM_MOVIE_FAILURE';

const reducer = (state = initialState, action) => produce(state, (draft) => {
  console.log('action 데이터', action.data);
  switch (action.type) {
    case LOAD_RANDOM_MOVIE_REQUEST:
      draft.loadRandomMovieLoading = true;
      draft.loadRandomMovieDone = false;
      draft.loadRandomMovieError = null;
      break;
    case LOAD_RANDOM_MOVIE_SUCCESS:
      draft.loadRandomMovieLoading = false;
      draft.loadRandomMovieDone = true;
      draft.randomMovie = {
        _id: action.data._id,
        stlls: action.data._source.stlls._cdata,
      };
      break;
    case LOAD_RANDOM_MOVIE_FAILURE:
      draft.loadRandomMovieLoading = false;
      draft.loadRandomMovieError = action.error;
      break;
    default:
      break;
  }
});

export default reducer;
