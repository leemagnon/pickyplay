import axios from 'axios';
import { all, fork, put, takeLatest, call } from 'redux-saga/effects';
import {
  LOAD_RANDOM_MOVIE_REQUEST,
  LOAD_RANDOM_MOVIE_SUCCESS,
  LOAD_RANDOM_MOVIE_FAILURE,
  SEARCH_MOVIE_REQUEST,
  SEARCH_MOVIE_SUCCESS,
  SEARCH_MOVIE_FAILURE,
  LOAD_MOVIE_DETAIL_REQUEST,
  LOAD_MOVIE_DETAIL_SUCCESS,
  LOAD_MOVIE_DETAIL_FAILURE,
  ADD_REVIEW_REQUEST,
  ADD_REVIEW_SUCCESS,
  ADD_REVIEW_FAILURE,
  UPLOAD_REVIEW_IMAGES_REQUEST,
  UPLOAD_REVIEW_IMAGES_SUCCESS,
  UPLOAD_REVIEW_IMAGES_FAILURE,
  REMOVE_REVIEW_IMAGE,
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

function* watchLoadRandomMovie() {
  yield takeLatest(LOAD_RANDOM_MOVIE_REQUEST, loadRandomMovie);
}
function* watchSearchMovie() {
  yield takeLatest(SEARCH_MOVIE_REQUEST, searchMovie);
}
function* watchLoadMovieDetail() {
  yield takeLatest(LOAD_MOVIE_DETAIL_REQUEST, loadMovieDetail);
}
function* watchAddReview() {
  yield takeLatest(ADD_REVIEW_REQUEST, addReview);
}
function* watchUploadReviewImgs() {
  yield takeLatest(UPLOAD_REVIEW_IMAGES_REQUEST, uploadReviewImgs);
}

export default function* movieSaga() {
  yield all([
    fork(watchLoadRandomMovie),
    fork(watchSearchMovie),
    fork(watchLoadMovieDetail),
    fork(watchAddReview),
    fork(watchUploadReviewImgs),
  ]);
}
