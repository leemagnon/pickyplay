import React from 'react';
import { render } from 'react-dom';
import App from '@layouts/App'; // = ./layouts/App
import { BrowserRouter } from 'react-router-dom';
     
render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector('#app'),
); // id가 app인 div 태그 안에다 렌더링하겠다.

// pages : 서비스 페이지. 페이지들의 진입점 (회원가입, 로그인, 워크스페이스, 채널 페이지)
// components : 자잘한 컴포넌트들
// layouts : 페이지들간의 공통 레이아웃
