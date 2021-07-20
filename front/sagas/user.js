import { all, fork, takeLatest, put, call } from '@redux-saga/core/effects';
import axios from 'axios';
import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOAD_MY_INFO_FAILURE,
  SECOND_AUTH_REQUEST,
  SECOND_AUTH_SUCCESS,
  SECOND_AUTH_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  UPLOAD_PROFILE_IMAGE_REQUEST,
  UPLOAD_PROFILE_IMAGE_SUCCESS,
  UPLOAD_PROFILE_IMAGE_FAILURE,
  UPDATE_USER_PROFILE_REQUEST,
  UPDATE_USER_PROFILE_SUCCESS,
  UPDATE_USER_PROFILE_FAILURE,
  UPDATE_USER_EMAIL_REQUEST,
  UPDATE_USER_EMAIL_SUCCESS,
  UPDATE_USER_EMAIL_FAILURE,
  UPDATE_USER_PASSWORD_REQUEST,
  UPDATE_USER_PASSWORD_SUCCESS,
  UPDATE_USER_PASSWORD_FAILURE,
} from '../reducers/user';

function logOutAPI() {
  return axios.post('/auth/logout');
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

function logInAPI(data) {
  return axios.post('/auth/login', data);
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

function secondAuthAPI(data) {
  return axios.post('/auth/2fa/authenticate', data);
}

function* secondAuth(action) {
  try {
    const result = yield call(secondAuthAPI, action.data);

    yield put({
      type: SECOND_AUTH_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: SECOND_AUTH_FAILURE,
      error: err.response.data,
    });
  }
}

function loadMyInfoAPI() {
  return axios.get('/auth/me');
}

function* loadMyInfo() {
  try {
    const result = yield call(loadMyInfoAPI);
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: err.response.data,
    });
  }
}

function signUpAPI(data) {
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

function uploadProfileImageAPI(data) {
  return axios.post('/user/uploadProfileImg', data);
}

function* uploadProfileImage(action) {
  try {
    const result = yield call(uploadProfileImageAPI, action.data);
    yield put({
      type: UPLOAD_PROFILE_IMAGE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UPLOAD_PROFILE_IMAGE_FAILURE,
      error: err.response.data,
    });
  }
}

function updateUserProfileAPI(data) {
  return axios.post('/user/newProfile', data);
}

function* updateUserProfile(action) {
  try {
    const result = yield call(updateUserProfileAPI, action.data);
    yield put({
      type: UPDATE_USER_PROFILE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UPDATE_USER_PROFILE_FAILURE,
      error: err.response.data,
    });
  }
}

function updateUserEmailAPI(data) {
  return axios.post('/user/newEmail', data);
}

function* updateUserEmail(action) {
  try {
    const result = yield call(updateUserEmailAPI, action.data);
    yield put({
      type: UPDATE_USER_EMAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UPDATE_USER_EMAIL_FAILURE,
      error: err.response.data,
    });
  }
}

function updateUserPasswordAPI(data) {
  return axios.post('/user/newPassword', data);
}

function* updateUserPassword(action) {
  try {
    const result = yield call(updateUserPasswordAPI, action.data);
    yield put({
      type: UPDATE_USER_PASSWORD_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UPDATE_USER_PASSWORD_FAILURE,
      error: err.response.data,
    });
  }
}

// 이벤트 리스너 역할
function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}
function* watchLogIn() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}
function* watchSecondAuth() {
  yield takeLatest(SECOND_AUTH_REQUEST, secondAuth);
}
function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}
function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}
function* watchUploadProfileImage() {
  yield takeLatest(UPLOAD_PROFILE_IMAGE_REQUEST, uploadProfileImage);
}
function* watchUpdateUserProfile() {
  yield takeLatest(UPDATE_USER_PROFILE_REQUEST, updateUserProfile);
}
function* watchUpdateUserEmail() {
  yield takeLatest(UPDATE_USER_EMAIL_REQUEST, updateUserEmail);
}
function* watchUpdateUserPassword() {
  yield takeLatest(UPDATE_USER_PASSWORD_REQUEST, updateUserPassword);
}

export default function* userSaga() {
  yield all([
    fork(watchLogOut),
    fork(watchLogIn),
    fork(watchSecondAuth),
    fork(watchLoadMyInfo),
    fork(watchSignUp),
    fork(watchUploadProfileImage),
    fork(watchUpdateUserProfile),
    fork(watchUpdateUserEmail),
    fork(watchUpdateUserPassword),
  ]);
}
