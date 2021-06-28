import axios from 'axios';
import { all, fork, put, takeLatest, call } from 'redux-saga/effects';
import {
  LOAD_RANDOM_MOVIE_REQUEST,
  LOAD_RANDOM_MOVIE_SUCCESS,
  LOAD_RANDOM_MOVIE_FAILURE,
  SEARCH_MOVIE_REQUEST,
  SEARCH_MOVIE_SUCCESS,
  SEARCH_MOVIE_FAILURE,
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

function* watchLoadRandomMovie() {
  yield takeLatest(LOAD_RANDOM_MOVIE_REQUEST, loadRandomMovie);
}

function* watchSearchMovie() {
  yield takeLatest(SEARCH_MOVIE_REQUEST, searchMovie);
}

export default function* movieSaga() {
  yield all([
    fork(watchLoadRandomMovie),
    fork(watchSearchMovie),
  ]);
}
