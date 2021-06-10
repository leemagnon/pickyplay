import axios from 'axios';
import { all, fork, put, takeLatest, call } from 'redux-saga/effects';
import {
  LOAD_RANDOM_MOVIE_REQUEST,
  LOAD_RANDOM_MOVIE_SUCCESS,
  LOAD_RANDOM_MOVIE_FAILURE,
} from '../reducers/movie';

function loadRandomMovieAPI() {
  console.log('/search/randomMovie api 요청');
  return axios.get('/search/randomMovie');
}

function* loadRandomMovie() {
  try {
    const result = yield call(loadRandomMovieAPI);
    console.log(result.data);
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

function* watchLoadRandomMovie() {
  yield takeLatest(LOAD_RANDOM_MOVIE_REQUEST, loadRandomMovie);
}

export default function* movieSaga() {
  yield all([
    fork(watchLoadRandomMovie),
  ]);
}
