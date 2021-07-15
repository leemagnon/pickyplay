import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import Router from 'next/router';
import styled from 'styled-components';
import { END } from 'redux-saga';
import axios from 'axios';
import { LOG_IN_REQUEST, LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import Modal from '../../components/Modal';
import wrapper from '../../store/configureStore';
import AppContext from '../../contexts/appContext';
import OTPForm from '../../components/OTPForm';

/** css */
const Background = styled.div`
  overflow: hidden;
  overflow-y: scroll;
  background-image: url('/login_bg.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
`;

const Header = styled.div`
  width: 100%;
  height: 14%;
  border-bottom: transparent;
  margin-left: 20px;
`;

const Logo = styled.h1`
  color: white;
  font-size: 45px;
  & span {
    color: #9400d3;
  }
`;

const LogInBody = styled.div`
  margin: auto;
  margin-bottom: 50px;
  width: ${({ browserWidth }) => (browserWidth >= 510 ? 460 : browserWidth - 20)}px;
  padding: 30px ${({ browserWidth }) => (browserWidth >= 510 ? 65 : 30)}px;
  background-color: rgba(0, 0, 0, 0.75);
`;

const LoginText = styled.h1`
  color: #fff;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 30px;
`;

const Input = styled.input`
  background: #333;
  border-radius: 4px;
  border-right-style: initial;
  border-bottom-style: initial;
  box-sizing: border-box;
  margin: 0 0 20px;
  margin-bottom: 37px;
  width: 100%;
  color: #fff;
  padding: 16px;
  height: 50px;
  font-size: 16px;
  line-height: 1.33333333;

  &.error {
    border-bottom-style: solid;
    border-bottom-color: #ffff00;
    margin-bottom: 5px;
  }
`;

const InputError = styled.div`
  color: #ffff00;
  margin-bottom: 32px;
`;

const Button = styled.button`
  margin-top: 12px;
  width: 100%;
  max-width: 100%;
  color: #fff;
  background-color: #690096;
  border: none;
  font-size: 18px;
  font-weight: 900;
  height: 50px;
  min-width: 96px;
  padding: 0 16px 3px;
  transition: all 80ms linear;
  user-select: none;
  outline: none;
  cursor: pointer;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: rgba(99, 0, 142, 0.9);
    border: none;
  }
  &:focus {
    --saf-0: rgba(var(--sk_highlight, 18, 100, 163), 1);
    box-shadow: 0 0 0 1px var(--saf-0), 0 0 0 5px rgba(29, 155, 209, 0.3);
  }
`;

const SignUp = styled.div`
  color: #737373;
  font-size: 17px;
  font-weight: 600;
  text-align: end;
  margin-top: 32px;
`;

const Footer = styled.div`
  padding: 20px 40px;
  background-color: rgba(0, 0, 0, 0.75);
  color: #737373;
  font-size: 17px;
`;

const aTagStyle = {
  textDecoration: 'none',
  color: '#fff',
};

/* 로그인 컴포넌트 */
const LogIn = () => {
  const browserSize = useContext(AppContext);
  const dispatch = useDispatch();
  const {
    logInError,
    activate2FA,
    secondAuthError,
    me,
  } = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [emailRequiredError, setEmailRequiredError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordRequiredError, setPasswordRequiredError] = useState(false);
  const [showOTPFormModal, setShowOTPFormModal] = useState(false);

  const EmailInput = emailRequiredError ? 'error' : null;
  const PasswordInput = passwordRequiredError ? 'error' : null;

  useEffect(() => { // LOAD_MY_INFO_REQUEST
    if (me && me.userIdx) {
      Router.replace('/');
    }
  }, [me && me.userIdx]);

  useEffect(() => { // 로그인 에러
    if (logInError) {
      alert(logInError.message);
    }
  }, [logInError]);

  useEffect(() => { // 2fa
    if (secondAuthError) {
      alert(secondAuthError.message);
    }
  }, [secondAuthError]);

  useEffect(() => {
    if (activate2FA) {
      setShowOTPFormModal(true);
    }
  }, [activate2FA, showOTPFormModal]);

  const onChangeEmail = useCallback((e) => {
    setEmail(e.target.value);

    if (e.target.value !== '') {
      setEmailRequiredError(false);
    }
  }, [email]);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);

    if (e.target.value !== '') {
      setPasswordRequiredError(false);
    }
  }, [password]);

  const onSubmit = useCallback((e) => {
    e.preventDefault();

    if (email === '') {
      return setEmailRequiredError(true);
    }

    if (password === '') {
      return setPasswordRequiredError(true);
    }

    console.log(email, password);

    dispatch({
      type: LOG_IN_REQUEST,
      data: { email, password },
    });
  }, [email, password]);

  return (
    <Background>
      <Header>
        <Logo className="font-carter-one">
          <span>P</span>
          ICKY
          <span>P</span>
          LAY
        </Logo>
      </Header>
      <LogInBody browserWidth={browserSize.browserWidth}>
        <form onSubmit={onSubmit}>
          <LoginText className="font-nanum-gothic">로그인</LoginText>

          <Input
            type="email"
            className={EmailInput}
            id="email"
            name="email"
            value={email}
            onChange={onChangeEmail}
            placeholder="이메일 주소"
          />
          {emailRequiredError && (
            <InputError className="font-nanum-gothic">
              이메일을 입력하세요.
            </InputError>
          )}
          <Input
            type="password"
            className={PasswordInput}
            id="password"
            name="password"
            value={password}
            onChange={onChangePassword}
            placeholder="비밀번호"
          />
          {passwordRequiredError && (
            <InputError className="font-nanum-gothic">
              비밀번호를 입력하세요.
            </InputError>
          )}
          <Button type="submit">로그인</Button>
        </form>
        <SignUp className="font-nanum-gothic">
          PickyPlay 회원이 아니신가요?
          <br />
          <Link href="/signup" style={aTagStyle}>
            👉 지금 가입하세요!
          </Link>
        </SignUp>
      </LogInBody>
      <Modal visible={showOTPFormModal}>
        <OTPForm email={email} onCloseModal={() => setShowOTPFormModal(false)} />
      </Modal>
      <Footer className="font-nanum-gothic">
        <div>
          <div style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '60px' }}>
            <small>
              만든 이: leemagnon
              <br />
              이메일 주소: leemagnon@gmail.com
              <br />
              GitHub 주소:
              <a
                href="https://github.com/leemagnon/pickyplay"
                style={aTagStyle}
              >
                {' '}
                https://github.com/leemagnon/pickyplay
              </a>
              <br />
              블로그 주소:
              <a href="https://rat2.tistory.com/" style={aTagStyle}>
                {' '}
                https://rat2.tistory.com/
              </a>
              <br />
            </small>
          </div>
          <div
            style={{
              display: 'inline-block',
              verticalAlign: 'middle',
            }}
          >
            <small>
              copyright ⓒ 2021 by leemagnon All Pictures cannot be copied
              without permission
            </small>
          </div>
        </div>
      </Footer>
    </Background>
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

export default LogIn;
