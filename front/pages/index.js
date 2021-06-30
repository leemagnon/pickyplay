import React from 'react';
import styled from 'styled-components';
import { END } from 'redux-saga';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';
import { LOAD_MY_INFO_REQUEST, LOG_OUT_REQUEST } from '../reducers/user';

const Contents = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 9;
`;

// 프론트랑 브라우저 둘 다에서 실행됨.
const Home = () => (
  <AppLayout>
    <Contents>
      <div>sssssss</div>
      <div>sssssss</div>
      <div>sssssss</div>
      <div>sssssss</div>
      <div>sssssss</div>
      <div>sssssss</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>asd</div>
      <div>ddd</div>
      <div>ddd</div>
      <div>ddd</div>
      <div>ddd</div><div>duuu</div><div>uuu</div><div>uuu</div><div>uuu</div><div>dduuuud</div>
    </Contents>
  </AppLayout>
);

// 프론트 서버에서 실행됨.
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log(context.req.headers.cookie);
  // 쿠키
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';

  // 로그아웃 패러미터
  let param = context.req.url.split('?')[1];
  param = param?.substr(0, param.length);

  if (context.req && cookie) { // 프론트 서버가 한대라 브라우저들이 쿠키를 공유하게 되는 문제 예방
    axios.defaults.headers.Cookie = cookie;

    if (param === 'logout') {
      axios.defaults.headers.Cookie = '';
      context.store.dispatch({ type: LOG_OUT_REQUEST });
    } else {
      context.store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
      });
    }
  }
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Home;
