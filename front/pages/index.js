import React from 'react';
import { END } from 'redux-saga';
import axios from 'axios';

import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import { LOAD_RANDOM_MOVIE_REQUEST, LOAD_RECOMMENDED_MOVIES_REQUEST } from '../reducers/movie';

// 프론트랑 브라우저 둘 다에서 실행됨.
const Home = () => (
  <AppLayout />
);

// 프론트 서버에서 실행됨.
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  context.store.dispatch({
    type: LOAD_RANDOM_MOVIE_REQUEST,
  });

  context.store.dispatch({
    type: LOAD_RECOMMENDED_MOVIES_REQUEST,
  });

  // 쿠키
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';

  if (context.req && cookie) { // 프론트 서버가 한대라 브라우저들이 쿠키를 공유하게 되는 문제 예방
    axios.defaults.headers.Cookie = cookie;

    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
  }
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Home;
