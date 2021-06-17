import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';
import { Background, Logo, SignUpForm, InputField, InputError } from './styles';
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
  const [userEmailAuthCode, setUserEmailAuthCode] = useState(''); // 사용자가 입력한 인증 번호
  const [userEmailAuthCodeRequiredError, setUserEmailAuthCodeRequiredError] = useState(false);
  const [userEmailAuthCodeValidationError, setUserEmailAuthCodeValidationError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordRequiredError, setPasswordRequiredError] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordCheckRequiredError, setPasswordCheckRequiredError] = useState(false);
  const [passwordCheckError, setPasswordCheckError] = useState(false);
  const reg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

  // 클래스 명
  const EmailInput = emailRequiredError || emailValidationError ? 'error' : null;
  const UserEmailAuthCodeInput = userEmailAuthCodeRequiredError || userEmailAuthCodeValidationError ? 'error' : null;
  const PasswordCheckInput = passwordCheckRequiredError || passwordCheckError ? 'error' : null;
  const PasswordInput = passwordRequiredError ? 'error' : null;

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

    if (e.target.value !== '') {
      setEmailRequiredError(false);
      setEmailValidationError(!reg.test(e.target.value));
    } else {
      setEmailRequiredError(true);
      setEmailValidationError(false);
    }
  }, [email]);

  const onChangeUserEmailAuthCode = useCallback((e) => {
    setUserEmailAuthCode(e.target.value);

    if (e.target.value !== '') {
      setUserEmailAuthCodeRequiredError(false);
    }
  }, [userEmailAuthCode]);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);

    if (e.target.value !== '') {
      setPasswordRequiredError(false);
    }
  }, [password]);

  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
    setPasswordCheckError(e.target.value !== password);

    if (e.target.value !== '') {
      setPasswordCheckRequiredError(false);
    }
  }, [password, passwordCheck]);

  const onSubmit = useCallback(() => {
    if (email === '') {
      setEmailValidationError(false);
      return setEmailRequiredError(true);
    }

    if (userEmailAuthCode === '') {
      setUserEmailAuthCodeValidationError(false);
      return setUserEmailAuthCodeRequiredError(true);
    }

    if (password === '') {
      return setPasswordRequiredError(true);
    }

    if (password !== '' && passwordCheck === '') {
      setPasswordCheckError(false);
      return setPasswordCheckRequiredError(true);
    }

    if (email !== '' && !reg.test(email)) {
      setEmailRequiredError(false);
      return setEmailValidationError(true);
    }

    if (emailAuthCode !== userEmailAuthCode) {
      setUserEmailAuthCodeRequiredError(false);
      return setUserEmailAuthCodeValidationError(true);
    }

    if (password !== passwordCheck) {
      setPasswordCheckRequiredError(false);
      return setPasswordCheckError(true);
    }

    console.log(email, userEmailAuthCode, password, passwordCheck);

    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password },
    });
  }, [email, userEmailAuthCode, password, passwordCheck]);

  return (
    <Background>
      <Logo className="font-carter-one">
        <span>P</span>
        ICKY
        <span>P</span>
        LAY
      </Logo>
      <SignUpForm onFinish={onSubmit}>
        <div>
          <label htmlFor="email">이메일</label>
          <br />
          <InputField
            name="email"
            className={EmailInput}
            value={email}
            onChange={onChangeEmail}
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
          <InputField name="email-authentication" className={UserEmailAuthCodeInput} value={userEmailAuthCode} onChange={onChangeUserEmailAuthCode} />
          {userEmailAuthCodeRequiredError && <InputError>인증번호를 입력해야 합니다.</InputError>}
          {userEmailAuthCodeValidationError && <InputError>인증번호가 틀렸습니다.</InputError>}
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <br />
          <InputField
            name="password"
            className={PasswordInput}
            value={password}
            onChange={onChangePassword}
          />
          {passwordRequiredError && <InputError>비밀번호를 입력해야 합니다.</InputError>}
        </div>
        <div>
          <label htmlFor="password-check">비밀번호 재확인</label>
          <br />
          <InputField name="password-check" className={PasswordCheckInput} value={passwordCheck} onChange={onChangePasswordCheck} />
          {passwordCheckRequiredError && <InputError>비밀번호를 재확인해야 합니다.</InputError>}
          {passwordCheckError && <InputError>비밀번호가 일치하지 않습니다.</InputError>}
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
      </SignUpForm>
    </Background>
  );
};

export default Signup;
