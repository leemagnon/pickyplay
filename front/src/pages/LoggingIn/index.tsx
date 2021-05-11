import React from 'react';
import {
  Background, Header, Logo, LogInBody, LoginText, Input, InputError, Button, SignUp,
} from './styles';

const LoggingIn = () => {
  const IsEmailError = true;
  const IsPasswordError = false;

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
        <form>
          <LoginText className="font-nanum-gothic">로그인</LoginText>

          <Input type="email" className={IsEmailError ? 'error' : ''} id="email" name="email" placeholder="이메일 주소" />
          {IsEmailError && <InputError className="font-nanum-gothic">정확한 이메일 주소를 입력하세요.</InputError>}
          <Input type="password" className={IsPasswordError ? 'error' : ''} id="password" name="password" placeholder="비밀번호" />
          {IsPasswordError && <InputError className="font-nanum-gothic">비밀번호는 8 - 20자 사이여야 합니다.</InputError>}
          <Button type="submit">로그인</Button>
        </form>
        <SignUp className="font-nanum-gothic">
          PickyPlay 회원이 아니신가요?
          <br />
          <a href="/register" style={{ textDecoration: 'none', color: '#fff' }}>👉 지금 가입하세요!</a>
        </SignUp>
      </LogInBody>
    </Background>
  );
};
export default LoggingIn;

// const [IsError, setIsError] = useState(false);
