import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { SECOND_AUTH_REQUEST } from '../reducers/user';

/** css */
const Title = styled.p`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 35px;
  color: black;
`;

const Contents = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 23px;
  & input {
    border-bottom-color: blue;
    border-top-style: none;
    border-left-style: none;
    border-right-style: none;
  }
  & span {
    font-size: 20px;
    color: blue
  }
`;

const Buttons = styled.div`
  flex: 1;
  display: flex;
  align-items: start;
  justify-content: space-evenly;
  & button {
    width: 55px;
    height: 38px;
  }
`;

const Deactivate2FA = () => {
  const dispatch = useDispatch();
  const { me, secondAuthDone, secondAuthError } = useSelector((state) => state.user);
  const [otp, setOTP] = useState('');
  const router = useRouter();

  useEffect(() => { // 로그인한 상태
    if (!me) {
      router.replace('/');
    }
  }, [me]);

  useEffect(() => {
    if (secondAuthDone) {
      alert('2단계 인증 비활성화 완료.');
      router.replace('/');
    }
  }, [secondAuthDone]);

  useEffect(() => { // OTP 틀림.
    if (secondAuthError) {
      alert(secondAuthError.message);
    }
  }, [secondAuthError]);

  const goBack = useCallback(() => {
    router.back();
  }, []);

  const onChangeOTP = useCallback((e) => {
    setOTP(e.target.value);
  }, [otp]);

  const onSubmit = useCallback(() => {
    dispatch({
      type: SECOND_AUTH_REQUEST,
      data: {
        twoFactorAuthenticationCode: otp,
        email: me.email,
        isDeactivate2FAPage: true,
      },
    });
  }, [otp]);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden', flexDirection: 'column' }}>
      <Title>OTP 설정</Title>
      <Contents style={{ textAlign: 'center' }}>
        2단계 인증을 비활성화합니다.
        <br />
        앱에 표시된 6자리 코드를 입력하세요.
        <br /><br />
        <span>코드 입력</span>
        <form id="otpForm" onSubmit="return false">
          <input type="text" value={otp} onChange={onChangeOTP} />
        </form>
      </Contents>
      <Buttons>
        <button type="button" onClick={goBack}>취소</button>
        <button type="submit" onClick={onSubmit}>확인</button>
      </Buttons>
    </div>
  );
};

export default Deactivate2FA;
