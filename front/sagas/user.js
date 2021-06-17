import { all, fork, takeLatest, put, call } from '@redux-saga/core/effects';
import axios from 'axios';
import {
  GET_EMAIL_AUTH_CODE_REQUEST,
  GET_EMAIL_AUTH_CODE_SUCCESS,
  GET_EMAIL_AUTH_CODE_FAILURE,
  LOAD_QR_CODE_REQUEST,
  // LOAD_QR_CODE_SUCCESS,
  LOAD_QR_CODE_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
} from '../reducers/user';

function logInAPI(data) {
  return axios.post('/auth/2fa/authenticate', data); // 서버로 요청을 보내는 코드
}

function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data,
    });
  }
}

function logOutAPI() {
  return axios.post('/api/logout');
}

function* logOut() {
  try {
    yield call(logOutAPI);
    yield put({
      type: LOG_OUT_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response.data,
    });
  }
}

function getEmailAuthCodeAPI(data) {
  return axios.post('/auth/emailAuthCode', {
    email: data,
  });
}

function* getEmailAuthCode(action) {
  try {
    const result = yield call(getEmailAuthCodeAPI, action.data);
    yield put({
      type: GET_EMAIL_AUTH_CODE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: GET_EMAIL_AUTH_CODE_FAILURE,
      error: err.response.data,
    });
  }
}

function loadQRCodeAPI(data) {
  return axios.post('/auth/login', data);
}

function* loadQRCode(action) {
  try {
    const result = yield call(loadQRCodeAPI, action.data);
    console.log(result);
    // yield put({
    //   type: LOAD_QR_CODE_SUCCESS,
    //   data: result.data,
    // });
  } catch (err) {
    yield put({
      type: LOAD_QR_CODE_FAILURE,
      error: err.response.data,
    });
  }
}

function signUpAPI(data) {
  console.log('signUpAPI 데이터 : ', data);
  return axios.post('/auth/register', data);
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    yield put({
      type: SIGN_UP_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
  }
}

// 이벤트 리스너 역할
function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn); // 'LOG_IN'이라는 액션이 실행되면 logIn 함수를 실행한다.
}
function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}
function* watchGetEmailAuthCode() {
  yield takeLatest(GET_EMAIL_AUTH_CODE_REQUEST, getEmailAuthCode);
}
function* watchLoadQRCode() {
  yield takeLatest(LOAD_QR_CODE_REQUEST, loadQRCode);
}
function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
  yield all([
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchGetEmailAuthCode),
    fork(watchLoadQRCode),
    fork(watchSignUp),
  ]);
}
