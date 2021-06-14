import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';
import useInput from '../../hooks/useInput';
import { Background, Logo, LoginForm, InputField, InputError } from './styles';
import { GET_EMAIL_AUTH_CODE_REQUEST, SIGN_UP_REQUEST } from '../../reducers/user';

const Signup = () => {
  const dispatch = useDispatch();
  const {
    getEmailAuthCodeLoading,
    signUpLoading,
    emailAuthCode,
  } = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [emailRequiredError, setEmailRequiredError] = useState(false);
  const [emailValidationError, setEmailValidationError] = useState(false);
  const [password, onChangePassword] = useInput('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // 클래스 명
  const EmailInput = emailRequiredError || emailValidationError ? 'error' : null;
  const PasswordInput = passwordError ? 'error' : null;

  const getEmailAuthCode = useCallback(
    () => {
      if (!email) {
        setEmailRequiredError(true);
        return 0;
      }
      return dispatch({
        type: GET_EMAIL_AUTH_CODE_REQUEST,
        data: email,
      });
    },
    [email],
  );

  const onChangeEmail = useCallback((e) => {
    setEmail(e.target.value);
    setEmailRequiredError(e.target.value === '');

    if (e.target.value !== '') {
      const reg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
      setEmailValidationError(!reg.test(e.target.value));
    } else {
      setEmailValidationError(false);
    }
  }, [password]);

  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
    setPasswordError(e.target.value !== password);
  }, [password]);

  /**
   * 여기서부터 다시 보기 => 회원가입 제출
   */
  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }

    console.log(email, password);
    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password },
    });
  }, [email, password, passwordCheck]);

  return (
    <Background>
      <Logo className="font-carter-one">
        <span>P</span>
        ICKY
        <span>P</span>
        LAY
      </Logo>
      <LoginForm onFinish={onSubmit}>
        <div>
          <label htmlFor="email">이메일</label>
          <br />
          <InputField
            name="email"
            className={EmailInput}
            value={email}
            onChange={onChangeEmail}
            required
            style={{ marginRight: 8 }}
          />
          {emailRequiredError && <InputError>이메일을 입력해야 합니다.</InputError>}
          {emailValidationError && <InputError>이메일 형식이 틀렸습니다.</InputError>}
          <Button
            type="primary"
            onClick={getEmailAuthCode}
            loading={getEmailAuthCodeLoading}
            style={{
              backgroundColor: '#690096',
              borderColor: '#690096',
              width: 120,
            }}
          >
            인증번호받기
          </Button>
        </div>
        <div>
          <label htmlFor="email">인증번호 입력</label>
          <br />
          <InputField name="email-authentication" required />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <br />
          <InputField
            name="password"
            value={password}
            onChange={onChangePassword}
            required
          />
        </div>
        <div>
          <label htmlFor="password-check">비밀번호 재확인</label>
          <br />
          <InputField name="password-check" className={PasswordInput} value={passwordCheck} onChange={onChangePasswordCheck} required />
          {passwordError && <InputError>비밀번호가 일치하지 않습니다.</InputError>}
        </div>
        <div>
          <Button
            type="primary"
            htmlType="submit"
            loading={signUpLoading}
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
