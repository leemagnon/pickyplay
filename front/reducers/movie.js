import produce from 'immer';

export const initialState = {
  randomMovie: {
    DOCID: '',
    stlls: [],
  },
  searchedMovies: [],
  loadRandomMovieLoading: false, // 랜덤 포스터 로딩 중
  loadRandomMovieDone: false,
  loadRandomMovieError: null,
  searchMovieLoading: false, // 영화 검색 중
  searchMovieDone: false,
  searchMovieError: null,
};

export const LOAD_RANDOM_MOVIE_REQUEST = 'LOAD_RANDOM_MOVIE_REQUEST';
export const LOAD_RANDOM_MOVIE_SUCCESS = 'LOAD_RANDOM_MOVIE_SUCCESS';
export const LOAD_RANDOM_MOVIE_FAILURE = 'LOAD_RANDOM_MOVIE_FAILURE';
export const SEARCH_MOVIE_REQUEST = 'SEARCH_MOVIE_REQUEST';
export const SEARCH_MOVIE_SUCCESS = 'SEARCH_MOVIE_SUCCESS';
export const SEARCH_MOVIE_FAILURE = 'SEARCH_MOVIE_FAILURE';

const reducer = (state = initialState, action) => produce(state, (draft) => {
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
        DOCID: action.data._source.DOCID._cdata,
        stlls: action.data._source.stlls._cdata,
      };
      break;
    case LOAD_RANDOM_MOVIE_FAILURE:
      draft.loadRandomMovieLoading = false;
      draft.loadRandomMovieError = action.error;
      break;
    case SEARCH_MOVIE_REQUEST:
      draft.searchMovieLoading = true;
      draft.searchMovieDone = false;
      draft.searchMovieError = null;
      break;
    case SEARCH_MOVIE_SUCCESS:
      draft.searchMovieLoading = false;
      draft.searchMovieDone = true;
      draft.searchedMovies = action.data;
      break;
    case SEARCH_MOVIE_FAILURE:
      draft.loadRandomMovieLoading = false;
      draft.loadRandomMovieError = action.error;
      break;
    default:
      break;
  }
});

export default reducer;
