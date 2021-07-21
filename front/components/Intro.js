import React from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import styled from 'styled-components';

/** css */
const Logo = styled.a`
  flex: 1;
  display: flex;
  align-items: flex-end;
  margin-left: 65px;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  font-size: 35px;
  color: white;
  & span {
    color: #9400d3;
  }
`;

const Title = styled.p`
  flex: 1;
  display: flex;
  align-items: flex-end;
  font-size: 35px;
  color: #ffffff;
  margin-left: 65px;
`;

const Container = styled.div`
  flex: 6;

  display: flex;
  flex-wrap: wrap;

  justify-content: center;

  overflow-y: scroll;
  
  padding: 5px 40px 40px 40px;
`;

const Content = styled.div`
    margin: 12px;
    width: 45%;
    border: 1px solid #dadada;
    border-radius: 2px;
    border-style: none;
    background-color: #ffffff;
    padding: 40px 45px;
    font-size: 35px;

    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: #DDA0DD;
    }
    & a {
      text-decoration: none; 
      color: pink;
    }

    @media(max-width: 900px) {
         width: 100%;
         font-size: 25px;
    }
`;

const Intro = () => {
  const { me } = useSelector((state) => state.user);
  const router = useRouter();

  const goToRouter = (name) => router.push(`/UpdateUserInfo?component=${name}`);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden', flexDirection: 'column', backgroundColor: '#1d2327' }}>
      <Logo className="font-carter-one" href="/">
        <span>P</span>
        ICKY
        <span>P</span>
        LAY
      </Logo>
      <Title>😊 회원 정보 수정</Title>
      <Container>
        {me && !me.is2FAOn ? (
          <Content onClick={() => goToRouter('Activate2FA')}>
            2단계 인증 활성화
          </Content>
        ) : (
          <Content onClick={() => goToRouter('Deactivate2FA')}>
            2단계 인증 비활성화
          </Content>
        )}
        <Content onClick={() => goToRouter('UpdateProfile')}>
          프로필 변경
        </Content>
        <Content onClick={() => goToRouter('UpdateEmail')}>
          이메일 변경
        </Content>
        <Content onClick={() => goToRouter('UpdatePassword')}>
          비밀번호 변경
        </Content>
      </Container>
    </div>
  );
};

export default Intro;
