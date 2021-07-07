import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Router, { useRouter } from 'next/router';
import styled from 'styled-components';
import axios from 'axios';
import { END } from 'redux-saga';
import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST, SECOND_AUTH_REQUEST } from '../../reducers/user';

/** css */
const Title = styled.p`
  flex: 1;
  display: flex;
  align-items: flex-end;
  font-size: 35px;
  color: #ffffff;
  margin-left: 65px;
`;

const Contents = styled.div`
  flex: 6;

  display: flex;

  justify-content: center;
  
  padding: 5px 40px 40px 40px;
`;

const Buttons = styled.div`
  flex: 1;
`;

const Activate2FA = () => {
  const dispatch = useDispatch();
  const { me, secondAuthError } = useSelector((state) => state.user);
  const [otp, setOTP] = useState('');
  const router = useRouter();

  useEffect(() => { // 로그인한 상태
    if (!me) {
      Router.replace('/');
    }
  }, [me]);

  useEffect(() => { // OTP 틀림.
    if (secondAuthError) {
      alert(secondAuthError.message);
    }
  }, [secondAuthError]);

  const goBack = useCallback(() => {
    router.push('/UpdateUserInfo', undefined, { shallow: true });
  }, []);

  const onChangeOTP = useCallback((e) => {
    setOTP(e.target.value);
  }, [otp]);

  const onSubmit = useCallback(() => {
    document.getElementById('otpForm').submit();
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
      <Contents>
        2단계 인증을 비활성화합니다.
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

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
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

export default Activate2FA;
