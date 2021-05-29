import { Background, Logo, LoginForm } from './styles';
import { Input, Button } from 'antd';

const Signup = () => {
  return (
    <Background>
      <Logo className="font-carter-one">
        <span>P</span>
        ICKY
        <span>P</span>
        LAY
      </Logo>
      <LoginForm>
        <div>
          <label htmlFor="email">이메일</label>
          <br />
          <Input name="email" required style={{ marginRight: 8 }} />
          <Button
            type="primary"
            htmlType="submit"
            style={{
              backgroundColor: '#690096',
              borderColor: '#690096',
              width: 100,
            }}
          >
            인증번호받기
          </Button>
        </div>
        <div>
          <label htmlFor="email">인증번호 입력</label>
          <br />
          <Input name="email-authentication" required />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <br />
          <Input name="password" required />
        </div>
        <div>
          <label htmlFor="password-check">비밀번호 재확인</label>
          <br />
          <Input name="password-check" required />
        </div>
        <div>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              width: '400px',
              backgroundColor: '#690096',
              borderColor: '#690096',
            }}
          >
            가입하기
          </Button>
        </div>
      </LoginForm>
    </Background>
  );
};

export default Signup;
