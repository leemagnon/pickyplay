/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';
import Router from 'next/router';
import gravatar from 'gravatar';
import { Background, Title, UpdateUserInfoForm, ProfileImg, InputContainer, InputField, InputError } from './styles';
import { GET_EMAIL_AUTH_CODE_REQUEST, CHECK_DUPLICATED_NICKNAME_REQUEST, UPDATE_USER_INFO_REQUEST } from '../../reducers/user';

const UpdateUserInfo = () => {
  const dispatch = useDispatch();
  const {
    me,
    getEmailAuthCodeLoading,
    checkDuplicatedNicknameLoading,
    checkDuplicatedNicknameError,
    updateUserInfoLoading,
    updateUserInfoDone,
    updateUserInfoError,
    emailAuthCode,
    msg, // 닉네임 중복 검사 통과 메시지
  } = useSelector((state) => state.user);

  const [email, setEmail] = useState(me.email);
  const [emailRequiredError, setEmailRequiredError] = useState(false);
  const [emailValidationError, setEmailValidationError] = useState(false);
  const [userEmailAuthCode, setUserEmailAuthCode] = useState(''); // 사용자가 입력한 인증 번호
  const [userEmailAuthCodeRequiredError, setUserEmailAuthCodeRequiredError] = useState(false);
  const [userEmailAuthCodeValidationError, setUserEmailAuthCodeValidationError] = useState(false);
  const [nickname, setNickname] = useState(me.nickname);
  const [nicknameRequiredError, setNicknameRequiredError] = useState(false);
  const [nicknameValidationError, setNicknameValidationError] = useState(false);
  const [
    duplicatedNicknameCheckRequiredError,
    setDuplicatedNicknameCheckRequiredError,
  ] = useState(false);
  const [nicknamePassMsg, setNicknamePassMsg] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordRequiredError, setPasswordRequiredError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordCheckRequiredError, setPasswordCheckRequiredError] = useState(false);
  const [passwordCheckError, setPasswordCheckError] = useState(false);
  const [profileImg, setProfileImg] = useState(null);

  const imageInput = useRef();

  const emailRule = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  const nicknameRule = /^[\w\Wㄱ-ㅎㅏ-ㅣ가-힣]{2,10}$/;
  const passwordRule = /^.*(?=^.{8,20}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;

  // 클래스 명
  const EmailInput = emailRequiredError || emailValidationError ? 'error' : null;
  const UserEmailAuthCodeInput = userEmailAuthCodeRequiredError || userEmailAuthCodeValidationError ? 'error' : null;
  const NicknameInput = nicknameRequiredError || nicknameValidationError || duplicatedNicknameCheckRequiredError ? 'error' : null;
  const PasswordCheckInput = passwordCheckRequiredError || passwordCheckError ? 'error' : null;
  const PasswordInput = passwordRequiredError || passwordLengthError ? 'error' : null;

  useEffect(() => { // 수정 완료 시 홈 화면으로 이동
    if (updateUserInfoDone) {
      Router.replace('/');
    }
  }, [updateUserInfoDone]);

  useEffect(() => {
    if (updateUserInfoError) { // 이메일 중복 등의 에러 발생 시 alert 띄우기
      alert(updateUserInfoError.message);
    }
  }, [updateUserInfoError]);

  useEffect(() => {
    if (checkDuplicatedNicknameError) { // 닉네임 중복 등의 에러 발생 시 alert 띄우기
      alert(checkDuplicatedNicknameError.message);
    }
  }, [checkDuplicatedNicknameError]);

  useEffect(() => {
    if (msg) { // 닉네임 중복 검사 통과 메시지
      setDuplicatedNicknameCheckRequiredError(false);
      setNicknameValidationError(false);
      setNicknameRequiredError(false);
      setNicknamePassMsg(true);
    }
  }, [msg]);

  const getEmailAuthCode = useCallback(
    () => {
      setNicknamePassMsg(false); // 닉네임 중복 통과 초기화

      if (!email) {
        setEmailRequiredError(true);
        setEmailValidationError(false);
        return 0;
      }
      if (emailValidationError) {
        return 0;
      }

      return dispatch({
        type: GET_EMAIL_AUTH_CODE_REQUEST,
        data: email,
      });
    },
    [email],
  );

  const checkDuplicatedNickname = useCallback(
    () => {
      setDuplicatedNicknameCheckRequiredError(false);

      if (!nickname) {
        setNicknameRequiredError(true);
        setNicknameValidationError(false);
        setNicknamePassMsg(false);
        return 0;
      }

      if (nicknameValidationError) {
        setNicknameRequiredError(false);
        setNicknamePassMsg(false);
        return 0;
      }

      return dispatch({
        type: CHECK_DUPLICATED_NICKNAME_REQUEST,
        data: nickname,
      });
    }, [nickname, duplicatedNicknameCheckRequiredError],
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
    setNickname(e.target.value);

    if (e.target.value !== '') {
      setNicknameRequiredError(false);
      setNicknamePassMsg(false);
      setDuplicatedNicknameCheckRequiredError(true);
    }

    if (!nicknameRule.test(e.target.value)) {
      setNicknameValidationError(true);
      setNicknameRequiredError(false);
      setNicknamePassMsg(false);
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

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    setProfileImg(e.target.files[0]);
  }, [profileImg]);

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

    if (duplicatedNicknameCheckRequiredError || !msg) {
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
      type: UPDATE_USER_INFO_REQUEST,
      data: { email, password, nickname },
    });
  }, [email,
    emailAuthCode,
    userEmailAuthCode,
    nickname,
    password,
    passwordCheck,
    msg,
    duplicatedNicknameCheckRequiredError]);

  const removeText = useCallback((flag) => {
    if (flag === 'email') {
      setEmail('');
      setEmailValidationError(false);
    } else if (flag === 'userEmailAuthCode') {
      setUserEmailAuthCode('');
      setUserEmailAuthCodeValidationError(false);
    } else if (flag === 'nickname') {
      setNickname('');
      setNicknameValidationError(false);
      setDuplicatedNicknameCheckRequiredError(false);
    } else if (flag === 'password') {
      setPassword('');
      setPasswordLengthError(false);
    } else if (flag === 'passwordCheck') {
      setPasswordCheck('');
      setPasswordCheckError(false);
    }
  }, []);

  return (
    <Background>
      <Title className="font-carter-one">
        회원정보수정
      </Title>

      <ProfileImg src={gravatar.url(me.email, { s: '38px', d: 'retro' })} alt={me.nickname} onClick={onClickImageUpload} />

      <UpdateUserInfoForm encType="multipart/form-data" onFinish={onSubmit}>
        <input type="file" name="profile-img" hidden ref={imageInput} onChange={onChangeImages} />
        <div>
          <label htmlFor="email">이메일</label>
          <br />
          <InputContainer>
            <InputField
              name="email"
              className={EmailInput}
              value={email}
              onChange={onChangeEmail}
              style={{ marginRight: 8 }}
            />
            <img src="./remove.png" alt="" onClick={() => removeText('email')} />
            {emailRequiredError && <InputError>이메일을 입력해야 합니다.</InputError>}
            {emailValidationError && <InputError>이메일 형식이 틀렸습니다.</InputError>}
          </InputContainer>

          <div>
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
        </div>
        <div>
          <label htmlFor="email">인증번호 입력</label>
          <br />
          <InputContainer>
            <InputField name="email-authentication" className={UserEmailAuthCodeInput} value={userEmailAuthCode} onChange={onChangeUserEmailAuthCode} />
            {userEmailAuthCodeRequiredError && <InputError>인증번호를 입력해야 합니다.</InputError>}
            {userEmailAuthCodeValidationError && <InputError>인증번호가 틀렸습니다.</InputError>}
            <img src="./remove.png" alt="" onClick={() => removeText('userEmailAuthCode')} />
          </InputContainer>
        </div>
        <div>
          <label htmlFor="nickname">닉네임</label>
          <br />
          <InputContainer>
            <InputField
              name="nickname"
              className={`${NicknameInput} ${nicknamePassMsg ? 'pass' : ''}`}
              value={nickname}
              onChange={onChangeNickname}
              style={{ marginRight: 8 }}
            />
            <img src="./remove.png" alt="" onClick={() => removeText('nickname')} />
            {nicknameRequiredError && <InputError>닉네임을 입력해야 합니다.</InputError>}
            {nicknameValidationError && <InputError>닉네임은 2자~10자 사이여야 합니다.</InputError>}
            {nicknamePassMsg && <div style={{ color: '#52c41a', marginBottom: '32px' }}>사용할 수 있는 닉네임 입니다.</div>}
            {duplicatedNicknameCheckRequiredError && <InputError>닉네임 중복 여부를 확인해야 합니다.</InputError>}
          </InputContainer>
          <div>
            <Button
              type="primary"
              onClick={checkDuplicatedNickname}
              loading={checkDuplicatedNicknameLoading}
              style={{
                backgroundColor: '#690096',
                borderColor: '#690096',
                width: 120,
              }}
            >
              닉네임중복확인
            </Button>
          </div>
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          <br />
          <InputContainer>
            <InputField
              type="password"
              name="password"
              className={PasswordInput}
              value={password}
              onChange={onChangePassword}
            />
            <img src="./remove.png" alt="" onClick={() => removeText('password')} />
            {passwordRequiredError && <InputError>비밀번호를 입력해야 합니다.</InputError>}
            {passwordLengthError && <InputError>영문/숫자/특수문자 포함, 8자~20자</InputError>}
          </InputContainer>
        </div>
        <div>
          <label htmlFor="password-check">비밀번호 재확인</label>
          <br />
          <InputContainer>
            <InputField type="password" name="password-check" className={PasswordCheckInput} value={passwordCheck} onChange={onChangePasswordCheck} />
            {passwordCheckRequiredError && <InputError>비밀번호를 재확인해야 합니다.</InputError>}
            {passwordCheckError && <InputError>비밀번호가 일치하지 않습니다.</InputError>}
            <img src="./remove.png" alt="" onClick={() => removeText('passwordCheck')} />
          </InputContainer>
        </div>
        <div>
          <Button
            type="primary"
            htmlType="submit"
            loading={updateUserInfoLoading}
            style={{
              width: '400px',
              backgroundColor: '#690096',
              borderColor: '#690096',
            }}
          >
            수정하기
          </Button>
        </div>
      </UpdateUserInfoForm>
    </Background>
  );
};

export default UpdateUserInfo;
