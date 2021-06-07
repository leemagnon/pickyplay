import React from 'react';
import styled from 'styled-components';
import AppLayout from '../components/AppLayout';

const PosterImg = styled.div`
  width: 100%;
  height: 30%;
  background-image: url('/login_bg.jpg');
  background-size: cover;
  background-repeat: no-repeat;
`;

const Home = () => <AppLayout><div style={{ width: '100%', height: '100%', backgroundColor: 'black' }}>movies<PosterImg /></div></AppLayout>;

export default Home;

// 메인 화면
