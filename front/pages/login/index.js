import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { LOAD_QR_CODE_REQUEST } from '../../reducers/user';
import {
  Background,
  Header,
  Logo,
  LogInBody,
  LoginText,
  Input,
  InputError,
  Button,
  SignUp,
  Footer,
  aTagStyle,
} from './styles';

/* 로그인 컴포넌트 */
const LogIn = () => {
  const dispatch = useDispatch();
  const { loadQRCodeError, loadQRCodeDone, QRCode } = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [emailRequiredError, setEmailRequiredError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordRequiredError, setPasswordRequiredError] = useState(false);

  const EmailInput = emailRequiredError ? 'error' : null;
  const PasswordInput = passwordRequiredError ? 'error' : null;

  useEffect(() => {
    if (loadQRCodeDone) {
      alert(QRCode);
    }
  }, [loadQRCodeDone]);

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
      type: LOAD_QR_CODE_REQUEST,
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
      <LogInBody>
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
      <Footer className="font-nanum-gothic">
        <div style={{ minWidth: '929px' }}>
          <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
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
              marginLeft: '60px',
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
export default LogIn;
