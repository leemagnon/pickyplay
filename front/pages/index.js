import React from 'react';
import styled from 'styled-components';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

const Contents = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 9;
`;

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

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('getServerSideProps start');
  console.log('getServerSideProps | ', context.req.headers);
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
});
export default Home;

// 메인 화면
