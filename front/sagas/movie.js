import axios from 'axios';
import { all, fork, put, takeLatest, call } from 'redux-saga/effects';
import {
  LOAD_RANDOM_MOVIE_REQUEST,
  LOAD_RANDOM_MOVIE_SUCCESS,
  LOAD_RANDOM_MOVIE_FAILURE,
  LOAD_RECOMMENDED_MOVIES_REQUEST,
  LOAD_RECOMMENDED_MOVIES_SUCCESS,
  LOAD_RECOMMENDED_MOVIES_FAILURE,
  SEARCH_MOVIE_REQUEST,
  SEARCH_MOVIE_SUCCESS,
  SEARCH_MOVIE_FAILURE,
  LOAD_MOVIE_DETAIL_REQUEST,
  LOAD_MOVIE_DETAIL_SUCCESS,
  LOAD_MOVIE_DETAIL_FAILURE,
  ADD_LIKE_REQUEST,
  ADD_LIKE_SUCCESS,
  ADD_LIKE_FAILURE,
  REMOVE_LIKE_REQUEST,
  REMOVE_LIKE_SUCCESS,
  REMOVE_LIKE_FAILURE,
  ADD_REVIEW_REQUEST,
  ADD_REVIEW_SUCCESS,
  ADD_REVIEW_FAILURE,
  UPLOAD_REVIEW_IMAGES_REQUEST,
  UPLOAD_REVIEW_IMAGES_SUCCESS,
  UPLOAD_REVIEW_IMAGES_FAILURE,
  REMOVE_REVIEW_REQUEST,
  REMOVE_REVIEW_SUCCESS,
  REMOVE_REVIEW_FAILURE,
  UPDATE_REVIEW_REQUEST,
  UPDATE_REVIEW_SUCCESS,
  UPDATE_REVIEW_FAILURE,
} from '../reducers/movie';

function loadRandomMovieAPI() {
  return axios.get('/search/randomMovie');
}
function* loadRandomMovie() {
  try {
    const result = yield call(loadRandomMovieAPI);
    yield put({
      type: LOAD_RANDOM_MOVIE_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_RANDOM_MOVIE_FAILURE,
      error: error.response.data,
    });
  }
}

function loadRecommendedMoviesAPI() {
  return axios.get('/search/recommendedMovies');
}
function* loadRecommendedMovies() {
  try {
    const result = yield call(loadRecommendedMoviesAPI);
    yield put({
      type: LOAD_RECOMMENDED_MOVIES_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_RECOMMENDED_MOVIES_FAILURE,
      error: error.response.data,
    });
  }
}

function searchMovieAPI(data) {
  return axios.get(`/search/movie/${data}`);
}
function* searchMovie(action) {
  try {
    const result = yield call(searchMovieAPI, action.data);
    yield put({
      type: SEARCH_MOVIE_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: SEARCH_MOVIE_FAILURE,
      error: error.response.data,
    });
  }
}

function loadMovieDetailAPI(data) {
  return axios.get(`/search/detail/${data}`);
}
function* loadMovieDetail(action) {
  try {
    const result = yield call(loadMovieDetailAPI, action.data);
    yield put({
      type: LOAD_MOVIE_DETAIL_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: LOAD_MOVIE_DETAIL_FAILURE,
      error: error.response.data,
    });
  }
}

function addLikeAPI(data) {
  return axios.patch(`/movie/like/${data}`);
}
function* addLike(action) {
  try {
    const result = yield call(addLikeAPI, action.data);
    yield put({
      type: ADD_LIKE_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: ADD_LIKE_FAILURE,
      error: error.response.data,
    });
  }
}

function removeLikeAPI(data) {
  return axios.delete(`/movie/like/${data}`);
}
function* removeLike(action) {
  try {
    const result = yield call(removeLikeAPI, action.data);
    yield put({
      type: REMOVE_LIKE_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: REMOVE_LIKE_FAILURE,
      error: error.response.data,
    });
  }
}

function addReviewAPI(data) {
  return axios.post('/movie/review', data);
}
function* addReview(action) {
  try {
    const result = yield call(addReviewAPI, action.data);
    yield put({
      type: ADD_REVIEW_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: ADD_REVIEW_FAILURE,
      error: error.response.data,
    });
  }
}

function uploadReviewImgsAPI(data) {
  return axios.post('/movie/upload/reviewImg', data);
}
function* uploadReviewImgs(action) {
  try {
    const result = yield call(uploadReviewImgsAPI, action.data);
    yield put({
      type: UPLOAD_REVIEW_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: UPLOAD_REVIEW_IMAGES_FAILURE,
      error: error.response.data,
    });
  }
}

function removeReviewAPI(data) {
  return axios.delete(`/movie/review/${data}`);
}
function* removeReview(action) {
  try {
    const result = yield call(removeReviewAPI, action.data);
    yield put({
      type: REMOVE_REVIEW_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: REMOVE_REVIEW_FAILURE,
      error: error.response.data,
    });
  }
}

function updateReviewAPI(data) {
  return axios.post('/movie/update/review', data);
}
function* updateReview(action) {
  try {
    const result = yield call(updateReviewAPI, action.data);
    yield put({
      type: UPDATE_REVIEW_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    console.error(error);
    yield put({
      type: UPDATE_REVIEW_FAILURE,
      error: error.response.data,
    });
  }
}

function* watchLoadRandomMovie() {
  yield takeLatest(LOAD_RANDOM_MOVIE_REQUEST, loadRandomMovie);
}
function* watchLoadRecommendedMovies() {
  yield takeLatest(LOAD_RECOMMENDED_MOVIES_REQUEST, loadRecommendedMovies);
}
function* watchSearchMovie() {
  yield takeLatest(SEARCH_MOVIE_REQUEST, searchMovie);
}
function* watchLoadMovieDetail() {
  yield takeLatest(LOAD_MOVIE_DETAIL_REQUEST, loadMovieDetail);
}
function* watchAddLike() {
  yield takeLatest(ADD_LIKE_REQUEST, addLike);
}
function* watchRemoveLike() {
  yield takeLatest(REMOVE_LIKE_REQUEST, removeLike);
}
function* watchAddReview() {
  yield takeLatest(ADD_REVIEW_REQUEST, addReview);
}
function* watchUploadReviewImgs() {
  yield takeLatest(UPLOAD_REVIEW_IMAGES_REQUEST, uploadReviewImgs);
}
function* watchRemoveReview() {
  yield takeLatest(REMOVE_REVIEW_REQUEST, removeReview);
}
function* watchUpdateReview() {
  yield takeLatest(UPDATE_REVIEW_REQUEST, updateReview);
}

export default function* movieSaga() {
  yield all([
    fork(watchLoadRandomMovie),
    fork(watchLoadRecommendedMovies),
    fork(watchSearchMovie),
    fork(watchLoadMovieDetail),
    fork(watchAddLike),
    fork(watchRemoveLike),
    fork(watchAddReview),
    fork(watchUploadReviewImgs),
    fork(watchRemoveReview),
    fork(watchUpdateReview),
  ]);
}
