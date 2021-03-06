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
import { emailRule, nicknameRule, passwordRule } from '../../util/regexp';

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
  const browserSize = useContext(AppContext);
  const {
    getEmailAuthCodeLoading,
    signUpLoading,
    signUpDone,
    signUpError,
    me,
  } = useSelector((state) => state.user);
  const [email, setEmail] = useState('');
  const [emailRequiredError, setEmailRequiredError] = useState(false);
  const [emailValidationError, setEmailValidationError] = useState(false);
  const [emailAuthCode, setEmailAuthCode] = useState('');
  const [userEmailAuthCode, setUserEmailAuthCode] = useState(''); // ???????????? ????????? ?????? ??????
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
  const [nicknameFailMsg, setNicknameFailMsg] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRequiredError, setPasswordRequiredError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordCheckRequiredError, setPasswordCheckRequiredError] = useState(false);
  const [passwordCheckError, setPasswordCheckError] = useState(false);

  // ????????? ???
  const EmailInput = emailRequiredError || emailValidationError ? 'error' : null;
  const UserEmailAuthCodeInput = userEmailAuthCodeRequiredError || userEmailAuthCodeValidationError ? 'error' : null;
  const NicknameInput = nicknameRequiredError || nicknameValidationError || duplicatedNicknameCheckRequiredError || nicknameFailMsg !== '' ? 'error' : null;
  const PasswordCheckInput = passwordCheckRequiredError || passwordCheckError ? 'error' : null;
  const PasswordInput = passwordRequiredError || passwordLengthError ? 'error' : null;

  useEffect(() => { // ???????????? ??????
    if (me && me.userIdx) {
      Router.replace('/');
    }
  }, [me && me.userIdx]);

  useEffect(() => {
    if (signUpDone) {
      Router.replace('/login');
    }
  }, [signUpDone]);

  useEffect(() => {
    if (signUpError) { // ????????? ?????? ?????? ?????? ?????? ??? alert ?????????
      alert(signUpError.message);
    }
  }, [signUpError]);

  useEffect(() => {
    if (nicknameFailMsg !== '') { // ????????? ?????? ?????? ?????? ?????? ??? alert ?????????
      alert(nicknameFailMsg);
    }
  }, [nicknameFailMsg]);

  useEffect(() => {
    if (nicknamePassMsg !== '') { // ????????? ?????? ?????? ?????? ?????????
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
      if (emailRequiredError || emailValidationError) {
        return 0;
      }

      const result = await axios.post('/auth/emailAuthCode', {
        email,
      });
      setEmailAuthCode(result.data.toString());
      alert(`${email}??? ??????????????? ?????????????????????.`);
    },
    [email, emailRequiredError, emailValidationError],
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

      axios.post('/auth/nickname', {
        nickname: nickname.trim(),
      }).then((result) => {
        setNicknamePassMsg(result.data);
      }).catch((error) => {
        setNicknameFailMsg(error.response.data.message);
      });
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
    setNicknameFailMsg('');
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

    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname: nickname.trim() },
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
        <Logo className="font-carter-one" onClick={() => Router.replace('/')}>
          <span>P</span>
          ICKY
          <span>P</span>
          LAY
        </Logo>
        <SignUpForm browserWidth={browserSize.browserWidth} onFinish={onSubmit}>
          <div>
            <label htmlFor="email">?????????</label>
            <br />
            <InputField
              name="email"
              className={EmailInput}
              value={email}
              onChange={onChangeEmail}
              style={{ marginRight: 8 }}
            />
            {emailRequiredError && <InputError>???????????? ???????????? ?????????.</InputError>}
            {emailValidationError && <InputError>????????? ????????? ???????????????.</InputError>}
            <Button
              type="primary"
              onClick={getEmailAuthCode}
              loading={getEmailAuthCodeLoading}
              style={{
                backgroundColor: '#690096',
                borderColor: '#690096',
              }}
            >
              ??????????????????
            </Button>
          </div>
          <div>
            <label htmlFor="email">???????????? ??????</label>
            <br />
            <InputField name="email-authentication" className={UserEmailAuthCodeInput} value={userEmailAuthCode} onChange={onChangeUserEmailAuthCode} />
            {userEmailAuthCodeRequiredError && <InputError>??????????????? ???????????? ?????????.</InputError>}
            {userEmailAuthCodeValidationError && <InputError>??????????????? ???????????????.</InputError>}
          </div>
          <div>
            <label htmlFor="nickname">?????????</label>
            <br />
            <InputField
              name="nickname"
              className={`${NicknameInput} ${nicknamePassMsg ? 'pass' : ''}`}
              value={nickname}
              onChange={onChangeNickname}
              style={{ marginRight: 8 }}
            />
            {nicknameRequiredError && <InputError>???????????? ???????????? ?????????.</InputError>}
            {nicknameValidationError && <InputError>???????????? 2???~10??? ???????????? ?????????.</InputError>}
            {nicknamePassMsg !== '' && <div style={{ color: '#52c41a', marginBottom: '32px' }}>{nicknamePassMsg}</div>}
            {nicknameFailMsg !== '' && <InputError>{nicknameFailMsg}</InputError>}
            {duplicatedNicknameCheckRequiredError && <InputError>????????? ?????? ????????? ???????????? ?????????.</InputError>}
            <Button
              type="primary"
              onClick={checkDuplicatedNickname}
              style={{
                backgroundColor: '#690096',
                borderColor: '#690096',
              }}
            >
              ?????????????????????
            </Button>
          </div>
          <div>
            <label htmlFor="password">????????????</label>
            <br />
            <InputField
              type="password"
              name="password"
              className={PasswordInput}
              value={password}
              onChange={onChangePassword}
            />
            {passwordRequiredError && <InputError>??????????????? ???????????? ?????????.</InputError>}
            {passwordLengthError && <InputError>??????/??????/???????????? ??????, 8???~20???</InputError>}
          </div>
          <div>
            <label htmlFor="password-check">???????????? ?????????</label>
            <br />
            <InputField type="password" name="password-check" className={PasswordCheckInput} value={passwordCheck} onChange={onChangePasswordCheck} />
            {passwordCheckRequiredError && <InputError>??????????????? ??????????????? ?????????.</InputError>}
            {passwordCheckError && <InputError>??????????????? ???????????? ????????????.</InputError>}
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
            ????????????
          </Button>

        </SignUpForm>
      </Background>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  // ??????
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';

  if (context.req && cookie) { // ????????? ????????? ????????? ?????????????????? ????????? ???????????? ?????? ?????? ??????
    axios.defaults.headers.Cookie = cookie;

    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
  }
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Signup;
