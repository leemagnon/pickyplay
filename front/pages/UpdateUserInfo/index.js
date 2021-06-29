/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { React } from 'react';
import styled from 'styled-components';

const Content = styled.div`
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 500px;
    height: 500px;
    border: 1px solid #dadada;
    border-radius: 2px;
`;

const UpdateUserInfo = () => (
  <div style={{ backgroundColor: 'pink', height: '100%' }}>
    <Content>
      <div className="header">프로필 변경</div>
      <p><a href="">수정</a></p>
    </Content>
    <Content>
      <div className="header">이메일 변경</div>
      <p><a href="">수정</a></p>
    </Content>
    <Content>
      <div className="header">비밀번호 변경</div>
      <p><a href="">수정</a></p>
    </Content>

  </div>
);

export default UpdateUserInfo;
