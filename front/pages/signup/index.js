import React, { useCallback, useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import Router from 'next/router';
import styled from 'styled-components';
import { END } from 'redux-saga';
import axios from 'axios';
import { SIGN_UP_REQUEST, LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import wrapper from '../../store/configureStore';
import AppContext from '../../contexts/appContext';

/** css */
const Background = styled.div`
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items:center;

  overflow-y: scroll;

  background-color: #1d2327;
`;

const Logo = styled.h1`
  color: white;
  font-size: 45px;
  & span {
    color: #9400d3;
  }
`;

const SignUpForm = styled(Form)`
  width: ${({ browserWidth }) => (browserWidth >= 510 ? '510px' : `${browserWidth - 30}px`)};

  & label {
    color: white;
  }
  & Input,
  Button {
    height: 40px;
    margin-bottom: 20px;
  }
`;

const InputField = styled(Input)`
  background: #1d2428;
  border-radius: 4px;
  color: #fff;

  &.error {
    margin-bottom: 5px;
    border-bottom-style: solid;
    border-bottom-color: #ffff00;
    border-bottom-width: 5px;
  }
  &.pass {
    margin-bottom: 5px;
    border-bottom-style: solid;
    border-bottom-color: #52c41a;
    border-bottom-width: 5px;
  }
`;

const InputError = styled.div`
  color: #ffff00;
  margin-bottom: 32px;
`;

const Signup = () => {
  const dispatch = useDispatch();
  const browserWidth = useContext(AppContext);
  console.log('browserWidth : ', browserWidth);
  const {
    getEmailAuthCodeLoading,
    checkDuplicatedNicknameLoading,
    checkDuplicatedNicknameError,
    signUpLoading,
    signUpDone,
    signUpError,
    me,
  } = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [emailRequiredError, setEmailRequiredError] = useState(false);
  const [emailValidationError, setEmailValidationError] = useState(false);
  const [emailAuthCode, setEmailAuthCode] = useState('');
  const [userEmailAuthCode, setUserEmailAuthCode] = useState(''); // 사용자가 입력한 인증 번호
  const [userEmailAuthCodeRequiredError, setUserEmailAuthCodeRequiredError] = useState(false);
  const [userEmailAuthCodeValidationError, setUserEmailAuthCodeValidationError] = useState(false);
  const [nickname, setNickname] = useState('');
  const [nicknameRequiredError, setNicknameRequiredError] = useState(false);
  const [nicknameValidationError, setNicknameValidationError] = useState(false);
  const [
    duplicatedNicknameCheckRequiredError,
    setDuplicatedNicknameCheckRequiredError,
  ] = useState(false);
  const [nicknamePassMsg, setNicknamePassMsg] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRequiredError, setPasswordRequiredError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordCheckRequiredError, setPasswordCheckRequiredError] = useState(false);
  const [passwordCheckError, setPasswordCheckError] = useState(false);

  const emailRule = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  const nicknameRule = /^[\w\Wㄱ-ㅎㅏ-ㅣ가-힣]{2,10}$/;
  const passwordRule = /^.*(?=^.{8,20}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

  // 클래스 명
  const EmailInput = emailRequiredError || emailValidationError ? 'error' : null;
  const UserEmailAuthCodeInput = userEmailAuthCodeRequiredError || userEmailAuthCodeValidationError ? 'error' : null;
  const NicknameInput = nicknameRequiredError || nicknameValidationError || duplicatedNicknameCheckRequiredError ? 'error' : null;
  const PasswordCheckInput = passwordCheckRequiredError || passwordCheckError ? 'error' : null;
  const PasswordInput = passwordRequiredError || passwordLengthError ? 'error' : null;

  useEffect(() => { // 로그인한 상태
    if (me && me.id) {
      Router.replace('/');
    }
  }, [me && me.id]);

  useEffect(() => {
    if (signUpDone) {
      Router.replace('/login');
    }
  }, [signUpDone]);

  useEffect(() => {
    if (signUpError) { // 이메일 중복 등의 에러 발생 시 alert 띄우기
      alert(signUpError.message);
    }
  }, [signUpError]);

  useEffect(() => {
    if (checkDuplicatedNicknameError) { // 닉네임 중복 등의 에러 발생 시 alert 띄우기
      alert(checkDuplicatedNicknameError.message);
    }
  }, [checkDuplicatedNicknameError]);

  useEffect(() => {
    if (nicknamePassMsg !== '') { // 닉네임 중복 검사 통과 메시지
      setDuplicatedNicknameCheckRequiredError(false);
      setNicknameValidationError(false);
      setNicknameRequiredError(false);
    }
  }, [nicknamePassMsg]);

  const getEmailAuthCode = useCallback(
    async () => {
      if (!email) {
        setEmailRequiredError(true);
        setEmailValidationError(false);
        return 0;
      }
      if (emailValidationError) {
        return 0;
      }

      const result = await axios.post('/auth/emailAuthCode', {
        email,
      });

      setEmailAuthCode(result.data);
    },
    [email, emailValidationError],
  );

  const checkDuplicatedNickname = useCallback(
    async () => {
      setDuplicatedNicknameCheckRequiredError(false);

      if (!nickname) {
        setNicknameRequiredError(true);
        setNicknameValidationError(false);
        setNicknamePassMsg('');
        return 0;
      }

      if (nicknameValidationError) {
        setNicknameRequiredError(false);
        setNicknamePassMsg('');
        return 0;
      }

      const result = await axios.post('/auth/nickname', {
        nickname,
      });

      setNicknamePassMsg(result.data);
    }, [nickname, nicknameValidationError],
  );

  const onChangeEmail = useCallback((e) => {
    setEmail(e.target.value);

    if (e.target.value !== '') {
      setEmailRequiredError(false);
      setEmailValidationError(!emailRule.test(e.target.value));
    } else {
      setEmailRequiredError(true);
      setEmailValidationError(false);
    }
  }, [email]);

  const onChangeUserEmailAuthCode = useCallback((e) => {
    setUserEmailAuthCode(e.target.value);

    if (e.target.value !== '') {
      setUserEmailAuthCodeRequiredError(false);
      setUserEmailAuthCodeValidationError(false);
    }
  }, [userEmailAuthCode]);

  const onChangeNickname = useCallback((e) => {
    setNicknamePassMsg('');
    setNickname(e.target.value);

    if (e.target.value !== '') {
      setNicknameRequiredError(false);
      setDuplicatedNicknameCheckRequiredError(true);
    }

    if (!nicknameRule.test(e.target.value)) {
      setNicknameValidationError(true);
      setNicknameRequiredError(false);
      setDuplicatedNicknameCheckRequiredError(false);
    } else {
      setNicknameValidationError(false);
    }
  }, [nickname, duplicatedNicknameCheckRequiredError]);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);

    if (e.target.value !== '') {
      setPasswordRequiredError(false);

      if (!passwordRule.test(e.target.value)) {
        setPasswordLengthError(true);
      } else {
        setPasswordLengthError(false);
      }
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

    if (nickname === '') {
      setNicknameValidationError(false);
      return setNicknameRequiredError(true);
    }

    if (password === '') {
      return setPasswordRequiredError(true);
    }

    if (password !== '' && passwordCheck === '') {
      setPasswordCheckError(false);
      return setPasswordCheckRequiredError(true);
    }

    if (email !== '' && !emailRule.test(email)) {
      setEmailRequiredError(false);
      return setEmailValidationError(true);
    }

    if (emailAuthCode !== userEmailAuthCode) {
      setUserEmailAuthCodeRequiredError(false);
      return setUserEmailAuthCodeValidationError(true);
    }

    if (nickname !== '' && !nicknameRule.test(nickname)) {
      setNicknameRequiredError(false);
      setDuplicatedNicknameCheckRequiredError(false);
      return setNicknameValidationError(true);
    }

    if (duplicatedNicknameCheckRequiredError || nicknamePassMsg === '') {
      setNicknameRequiredError(false);
      setNicknameValidationError(false);
      return setDuplicatedNicknameCheckRequiredError(true);
    }

    if (password !== passwordCheck) {
      setPasswordCheckRequiredError(false);
      return setPasswordCheckError(true);
    }

    console.log(email, userEmailAuthCode, password, passwordCheck, nickname);

    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname },
    });
  }, [email,
    emailAuthCode,
    userEmailAuthCode,
    nickname,
    password,
    passwordCheck,
    nicknamePassMsg,
    duplicatedNicknameCheckRequiredError]);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
      <Background>
        <Logo className="font-carter-one">
          <span>P</span>
          ICKY
          <span>P</span>
          LAY
        </Logo>
        <SignUpForm browserWidth={browserWidth} onFinish={onSubmit}>
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
            <label htmlFor="nickname">닉네임</label>
            <br />
            <InputField
              name="nickname"
              className={`${NicknameInput} ${nicknamePassMsg ? 'pass' : ''}`}
              value={nickname}
              onChange={onChangeNickname}
              style={{ marginRight: 8 }}
            />
            {nicknameRequiredError && <InputError>닉네임을 입력해야 합니다.</InputError>}
            {nicknameValidationError && <InputError>닉네임은 2자~10자 사이여야 합니다.</InputError>}
            {nicknamePassMsg !== '' && <div style={{ color: '#52c41a', marginBottom: '32px' }}>{nicknamePassMsg}</div>}
            {duplicatedNicknameCheckRequiredError && <InputError>닉네임 중복 여부를 확인해야 합니다.</InputError>}
            <Button
              type="primary"
              onClick={checkDuplicatedNickname}
              loading={checkDuplicatedNicknameLoading}
              style={{
                backgroundColor: '#690096',
                borderColor: '#690096',
              }}
            >
              닉네임중복확인
            </Button>
          </div>
          <div>
            <label htmlFor="password">비밀번호</label>
            <br />
            <InputField
              type="password"
              name="password"
              className={PasswordInput}
              value={password}
              onChange={onChangePassword}
            />
            {passwordRequiredError && <InputError>비밀번호를 입력해야 합니다.</InputError>}
            {passwordLengthError && <InputError>영문/숫자/특수문자 포함, 8자~20자</InputError>}
          </div>
          <div>
            <label htmlFor="password-check">비밀번호 재확인</label>
            <br />
            <InputField type="password" name="password-check" className={PasswordCheckInput} value={passwordCheck} onChange={onChangePasswordCheck} />
            {passwordCheckRequiredError && <InputError>비밀번호를 재확인해야 합니다.</InputError>}
            {passwordCheckError && <InputError>비밀번호가 일치하지 않습니다.</InputError>}
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={signUpLoading}
            style={{
              backgroundColor: '#690096',
              borderColor: '#690096',
              width: '100%',
            }}
          >
            가입하기
          </Button>

        </SignUpForm>
      </Background>
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

export default Signup;
