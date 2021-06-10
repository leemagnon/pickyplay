import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import userSaga from './user';
import movieSaga from './movie';

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  yield all([fork(userSaga), fork(movieSaga)]);
}

/*
   all 은 배열을 받고 배열 안에 있는 것들을 동시에 실행시켜준다.
   fork 또는 call로 제너레이터 함수를 실행시켜준다.

   put = dispatch

   fork / call 차이 => fork는 비동기 함수 호출, call은 동기 함수 호출.
   call은 loginAPI가 리턴할 때까지 기다려서 result에다가 값을 넣어주는데
   fork는 요청을 보내버리고, 결과를 기다리는 것 없이 바로 다음 코드를 실행한다.
   즉 논블로킹이다.

   takeLatest => 요청이 실수로 여러번 갈 경우 마지막 응답 외의 응답은 취소시킴.
   단, 요청은 취소되지 않아 데이터는 서버에 여러번 저장되므로 서버에서 데이터가 중복된 것인지 확인을 해줘야함.
*/
