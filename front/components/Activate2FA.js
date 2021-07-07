import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import axios from 'axios';
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

const Activate2FA = () => {
  const dispatch = useDispatch();
  const { me, secondAuthError } = useSelector((state) => state.user);
  const [QRCodeUrl, setQRCodeUrl] = useState('');
  const [otp, setOTP] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!me) {
      router.replace('/');
    }
  }, [me]);

  useEffect(() => { // 로그인 된 상태일 때만 QRCode 불러오기
    async function fetchData() {
      const result = await axios.get('/user/QRCodeUrl');
      setQRCodeUrl(result.data);
    }
    if (me && me.id) {
      fetchData();
    }
  }, [me && me.id]);

  useEffect(() => { // OTP 틀림.
    if (secondAuthError) {
      alert(secondAuthError.message);
    }
  }, [secondAuthError]);

  const goBack = useCallback(() => {
    async function update() {
      await axios.patch('/user/Disable2FA');
    }
    update();
    router.back();
  }, []);

  const goNext = useCallback(() => {
    router.push('/UpdateUserInfo?component=Activate2FA&page=2', undefined, { shallow: true });
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
        isActivate2FAPage: true,
      },
    });
  }, [otp]);

  return (
    router.query.page === '2' ? (
      <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden', flexDirection: 'column' }}>
        <Title>OTP 설정</Title>
        <Contents>
          앱에 표시된 6자리 코드를 입력하세요.
          코드 입력
          <form id="otpForm" onSubmit="return false">
            <input type="text" value={otp} onChange={onChangeOTP} />
          </form>
        </Contents>
        <Buttons>
          <button type="button" onClick={goBack}>취소</button>
          <button type="submit" onClick={onSubmit}>확인</button>
        </Buttons>
      </div>
    )
      : (
        <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden', flexDirection: 'column' }}>
          <Title>OTP 설정</Title>
          <Contents>
            <ul>
              <li>Play 스토어 또는 App 스토어에서 Google OTP 앱을 다운로드합니다.</li>
              <li>앱에서 계정 설정 시 QR 코드 스캔을 선택합니다.</li>
            </ul>
            <img src={QRCodeUrl} alt="" style={{ width: '180px', height: '180px' }} />
          </Contents>
          <Buttons>
            <button type="button" onClick={goBack}>취소</button>
            <button type="button" onClick={goNext}>다음</button>
          </Buttons>
        </div>
      )
  );
};

export default Activate2FA;
