import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import useInput from '../hooks/useInput';
import { LOG_IN_REQUEST } from '../reducers/user';
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
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const IsEmailError = true;
  const IsPasswordError = false;

  const onSubmit = useCallback(() => {
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
      <LogInBody>
        <form onSubmit={onSubmit}>
          <LoginText className="font-nanum-gothic">로그인</LoginText>

          <Input
            type="email"
            className={IsEmailError ? 'error' : ''}
            id="email"
            name="email"
            value={email}
            onChange={onChangeEmail}
            placeholder="이메일 주소"
          />
          {IsEmailError && (
            <InputError className="font-nanum-gothic">
              정확한 이메일 주소를 입력하세요.
            </InputError>
          )}
          <Input
            type="password"
            className={IsPasswordError ? 'error' : ''}
            id="password"
            name="password"
            value={password}
            onChange={onChangePassword}
            placeholder="비밀번호"
          />
          {IsPasswordError && (
            <InputError className="font-nanum-gothic">
              비밀번호는 8 - 20자 사이여야 합니다.
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
