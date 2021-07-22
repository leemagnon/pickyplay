import produce from 'immer';

export const initialState = {
  randomMovie: {
    DOCID: '',
    stlls: [],
    title: '',
    plots: '',
  },
  recommendedMovies: {
    top10Movies: [],
    randomMovies: [],
    randomGenre: '',
  },
  searchedMovies: [],
  currentMovieDetail: null,
  reviewImgPaths: [], // 미리보기용
  myMovies: null,
  loadMyMoviesLoading: false, // 사용자가 좋아요 누른 영화 가져오기 시도중
  loadMyMoviesDone: false,
  loadMyMoviesError: null,
  loadRandomMovieLoading: false, // 랜덤 스틸컷 로딩 중
  loadRandomMovieDone: false,
  loadRandomMovieError: null,
  loadRecommendedMoviesLoading: false, // 추천 영화 로딩 중
  loadRecommendedMoviesDone: false,
  loadRecommendedMoviesError: null,
  searchMovieLoading: false, // 영화 검색 중
  searchMovieDone: false,
  searchMovieError: null,
  loadMovieDetailLoading: false, // 상세정보 로딩 중
  loadMovieDetailDone: false,
  loadMovieDetailError: null,
  addLikeLoading: false, // 좋아요 추가 중
  addLikeDone: false,
  addLikeError: null,
  removeLikeLoading: false, // 좋아요 제거 중
  removeLikeDone: false,
  removeLikeError: null,
  addReviewLoading: false, // 리뷰 추가 중
  addReviewDone: false,
  addReviewError: null,
  uploadReviewImgsLoading: false, // 리뷰 이미지 업로드 중
  uploadReviewImgsDone: false,
  uploadReviewImgsError: null,
};

export const LOAD_RANDOM_MOVIE_REQUEST = 'LOAD_RANDOM_MOVIE_REQUEST';
export const LOAD_RANDOM_MOVIE_SUCCESS = 'LOAD_RANDOM_MOVIE_SUCCESS';
export const LOAD_RANDOM_MOVIE_FAILURE = 'LOAD_RANDOM_MOVIE_FAILURE';

export const LOAD_RECOMMENDED_MOVIES_REQUEST = 'LOAD_RECOMMENDED_MOVIES_REQUEST';
export const LOAD_RECOMMENDED_MOVIES_SUCCESS = 'LOAD_RECOMMENDED_MOVIES_SUCCESS';
export const LOAD_RECOMMENDED_MOVIES_FAILURE = 'LOAD_RECOMMENDED_MOVIES_FAILURE';

export const SEARCH_MOVIE_REQUEST = 'SEARCH_MOVIE_REQUEST';
export const SEARCH_MOVIE_SUCCESS = 'SEARCH_MOVIE_SUCCESS';
export const SEARCH_MOVIE_FAILURE = 'SEARCH_MOVIE_FAILURE';

export const LOAD_MOVIE_DETAIL_REQUEST = 'LOAD_MOVIE_DETAIL_REQUEST';
export const LOAD_MOVIE_DETAIL_SUCCESS = 'LOAD_MOVIE_DETAIL_SUCCESS';
export const LOAD_MOVIE_DETAIL_FAILURE = 'LOAD_MOVIE_DETAIL_FAILURE';

export const LOAD_MY_MOVIES_REQUEST = 'LOAD_MY_MOVIES_REQUEST';
export const LOAD_MY_MOVIES_SUCCESS = 'LOAD_MY_MOVIES_SUCCESS';
export const LOAD_MY_MOVIES_FAILURE = 'LOAD_MY_MOVIES_FAILURE';

export const ADD_LIKE_REQUEST = 'ADD_LIKE_REQUEST';
export const ADD_LIKE_SUCCESS = 'ADD_LIKE_SUCCESS';
export const ADD_LIKE_FAILURE = 'ADD_LIKE_FAILURE';

export const REMOVE_LIKE_REQUEST = 'REMOVE_LIKE_REQUEST';
export const REMOVE_LIKE_SUCCESS = 'REMOVE_LIKE_SUCCESS';
export const REMOVE_LIKE_FAILURE = 'REMOVE_LIKE_FAILURE';

export const ADD_REVIEW_REQUEST = 'ADD_REVIEW_REQUEST';
export const ADD_REVIEW_SUCCESS = 'ADD_REVIEW_SUCCESS';
export const ADD_REVIEW_FAILURE = 'ADD_REVIEW_FAILURE';

export const UPDATE_REVIEW_REQUEST = 'UPDATE_REVIEW_REQUEST';
export const UPDATE_REVIEW_SUCCESS = 'UPDATE_REVIEW_SUCCESS';
export const UPDATE_REVIEW_FAILURE = 'UPDATE_REVIEW_FAILURE';

export const REMOVE_REVIEW_REQUEST = 'REMOVE_REVIEW_REQUEST';
export const REMOVE_REVIEW_SUCCESS = 'REMOVE_REVIEW_SUCCESS';
export const REMOVE_REVIEW_FAILURE = 'REMOVE_REVIEW_FAILURE';

export const UPLOAD_REVIEW_IMAGES_REQUEST = 'UPLOAD_REVIEW_IMAGES_REQUEST';
export const UPLOAD_REVIEW_IMAGES_SUCCESS = 'UPLOAD_REVIEW_IMAGES_SUCCESS';
export const UPLOAD_REVIEW_IMAGES_FAILURE = 'UPLOAD_REVIEW_IMAGES_FAILURE';

export const REMOVE_REVIEW_IMAGE = 'REMOVE_REVIEW_IMAGE';

export const REMOVE_CURRENT_MOVIE = 'REMOVE_CURRENT_MOVIE';

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
        title: action.data._source.title._cdata,
        plots: action.data._source.plots._cdata,
      };
      break;
    case LOAD_RANDOM_MOVIE_FAILURE:
      draft.loadRandomMovieLoading = false;
      draft.loadRandomMovieError = action.error;
      break;
    case LOAD_RECOMMENDED_MOVIES_REQUEST:
      draft.loadRecommendedMoviesLoading = true;
      draft.loadRecommendedMoviesDone = false;
      draft.loadRecommendedMoviesError = null;
      break;
    case LOAD_RECOMMENDED_MOVIES_SUCCESS:
      draft.loadRecommendedMoviesLoading = false;
      draft.loadRecommendedMoviesDone = true;
      draft.recommendedMovies = {
        top10Movies: action.data.top10Movies,
        randomMovies: action.data.randomMovies,
        randomGenre: action.data.randomGenre,
      };
      break;
    case LOAD_RECOMMENDED_MOVIES_FAILURE:
      draft.loadRecommendedMoviesLoading = false;
      draft.loadRecommendedMoviesError = action.error;
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
    case LOAD_MOVIE_DETAIL_REQUEST:
      draft.loadMovieDetailLoading = true;
      draft.loadMovieDetailDone = false;
      draft.loadMovieDetailError = null;
      draft.currentMovieDetail = [];
      break;
    case LOAD_MOVIE_DETAIL_SUCCESS:
      draft.loadMovieDetailLoading = false;
      draft.loadMovieDetailDone = true;
      draft.currentMovieDetail = action.data;
      break;
    case LOAD_MOVIE_DETAIL_FAILURE:
      draft.loadMovieDetailLoading = false;
      draft.loadMovieDetailError = action.error;
      break;
    case LOAD_MY_MOVIES_REQUEST:
      draft.loadMyMoviesLoading = true;
      draft.loadMyMoviesError = null;
      draft.loadMyMoviesDone = false;
      break;
    case LOAD_MY_MOVIES_SUCCESS:
      draft.loadMyMoviesLoading = false;
      draft.loadMyMoviesDone = true;
      draft.myMovies = action.data;
      break;
    case LOAD_MY_MOVIES_FAILURE:
      draft.loadMyMoviesLoading = false;
      draft.loadMyMoviesError = action.error;
      break;
    case ADD_LIKE_REQUEST:
      draft.addLikeLoading = true;
      draft.addLikeDone = false;
      draft.addLikeError = null;
      break;
    case ADD_LIKE_SUCCESS:
      draft.addLikeLoading = false;
      draft.addLikeDone = true;
      draft.currentMovieDetail.likers.push({ userIdx: action.data.userIdx });
      if (draft.myMovies) {
        draft.myMovies.push(action.data.likedMovie);
      }
      break;
    case ADD_LIKE_FAILURE:
      draft.addLikeLoading = false;
      draft.addLikeError = action.error;
      break;
    case REMOVE_LIKE_REQUEST:
      draft.removeLikeLoading = true;
      draft.removeLikeDone = false;
      draft.removeLikeError = null;
      break;
    case REMOVE_LIKE_SUCCESS:
      draft.removeLikeLoading = false;
      draft.removeLikeDone = true;
      draft.currentMovieDetail.likers = draft.currentMovieDetail.likers
        .filter((v) => v.userIdx !== action.data.userIdx);
      if (draft.myMovies) {
        draft.myMovies = draft.myMovies.filter((v) => v.DOCID !== action.data.DOCID);
      }
      break;
    case REMOVE_LIKE_FAILURE:
      draft.removeLikeLoading = false;
      draft.removeLikeError = action.error;
      break;
    case ADD_REVIEW_REQUEST:
      draft.addReviewLoading = true;
      draft.addReviewDone = false;
      draft.addReviewError = null;
      break;
    case ADD_REVIEW_SUCCESS:
      draft.addReviewLoading = false;
      draft.addReviewDone = true;
      draft.currentMovieDetail.reviews.unshift(action.data);
      draft.reviewImgPaths = [];
      break;
    case ADD_REVIEW_FAILURE:
      draft.addReviewLoading = false;
      draft.addReviewError = action.error;
      break;
    case UPDATE_REVIEW_REQUEST:
      draft.updateReviewLoading = true;
      draft.updateReviewDone = false;
      draft.updateReviewError = null;
      break;
    case UPDATE_REVIEW_SUCCESS:
      draft.updateReviewLoading = false;
      draft.updateReviewDone = true;
      draft.currentMovieDetail.reviews
        .find((v) => v.reviewIdx === action.data.reviewIdx)
        .content = action.data.content;
      break;
    case UPDATE_REVIEW_FAILURE:
      draft.updateReviewLoading = false;
      draft.updateReviewError = action.error;
      break;
    case REMOVE_REVIEW_REQUEST:
      draft.removeReviewLoading = true;
      draft.removeReviewDone = false;
      draft.removeReviewError = null;
      break;
    case REMOVE_REVIEW_SUCCESS:
      draft.removeReviewLoading = false;
      draft.removeReviewDone = true;
      draft.currentMovieDetail.reviews = draft.currentMovieDetail.reviews
        .filter((v) => v.reviewIdx !== action.data.reviewIdx);
      break;
    case REMOVE_REVIEW_FAILURE:
      draft.removeReviewLoading = false;
      draft.removeReviewError = action.error;
      break;
    case UPLOAD_REVIEW_IMAGES_REQUEST:
      draft.uploadReviewImgsLoading = true;
      draft.uploadReviewImgsDone = false;
      draft.uploadReviewImgsError = null;
      break;
    case UPLOAD_REVIEW_IMAGES_SUCCESS:
      draft.uploadReviewImgsLoading = false;
      draft.uploadReviewImgsDone = true;
      draft.reviewImgPaths = draft.reviewImgPaths.concat(action.data);
      break;
    case UPLOAD_REVIEW_IMAGES_FAILURE:
      draft.uploadReviewImgsLoading = false;
      draft.uploadReviewImgsError = action.error;
      break;
    case REMOVE_REVIEW_IMAGE:
      draft.reviewImgPaths = draft.reviewImgPaths.filter((v, i) => i !== action.data);
      break;
    case REMOVE_CURRENT_MOVIE:
      draft.currentMovieDetail = null;
      break;
    default:
      break;
  }
});

export default reducer;
