import React from 'react';
import styled from 'styled-components';
import { END } from 'redux-saga';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

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
  console.log('getServerSideProps start');
  const cookie = context.req ? context.req.headers.cookie : '';
  if (cookie) {
    axios.defaults.headers.Cookie = cookie;
    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
  }
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Home;
