import React, { useCallback, useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';
import axios from 'axios';
import { useRouter } from 'next/router';
import AppContext from '../contexts/appContext';
import { UPDATE_USER_EMAIL_REQUEST } from '../reducers/user';
import { emailRule } from '../util/regexp';

/** css */
const Title = styled.p`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 35px;
  color: black;
`;

const Contents = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UpdateEmailForm = styled(Form)`
  width: ${({ browserWidth }) => (browserWidth >= 510 ? '510px' : `${browserWidth - 30}px`)};

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
    border-bottom-color: #fb00ff;
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
  color: #fb00ff;
  margin-bottom: 32px;
`;

const UpdateEmail = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const browserSize = useContext(AppContext);
  const { me,
    updateUserEmailLoading,
    updateUserEmailDone,
    updateUserEmailError } = useSelector((state) => state.user);
  const [email, setEmail] = useState(me.email);
  const [emailRequiredError, setEmailRequiredError] = useState(false);
  const [emailValidationError, setEmailValidationError] = useState(false);
  const [emailAuthCode, setEmailAuthCode] = useState('');
  const [userEmailAuthCode, setUserEmailAuthCode] = useState(''); // 사용자가 입력한 인증 번호
  const [userEmailAuthCodeRequiredError, setUserEmailAuthCodeRequiredError] = useState(false);
  const [userEmailAuthCodeValidationError, setUserEmailAuthCodeValidationError] = useState(false);

  const EmailInput = emailRequiredError || emailValidationError ? 'error' : null;
  const UserEmailAuthCodeInput = userEmailAuthCodeRequiredError || userEmailAuthCodeValidationError ? 'error' : null;

  useEffect(() => {
    if (updateUserEmailDone) {
      alert('이메일이 성공적으로 변경되었습니다.');
      router.replace('/');
    }
  }, [updateUserEmailDone]);

  useEffect(() => {
    if (updateUserEmailError) {
      alert(updateUserEmailError.message);
    }
  }, [updateUserEmailError]);

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
      setEmailAuthCode(result.data);
      alert(`${email}로 인증코드가 전송되었습니다.`);
    },
    [email, emailRequiredError, emailValidationError],
  );

  const onChangeEmail = useCallback((e) => {
    setEmail(e.target.value);

    if (e.target.value !== '') {
      setEmailRequiredError(false);
      setEmailValidationError(!emailRule.test(e.target.value));
    } else {
      setEmailRequiredError(false);
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

  const onSubmit = useCallback(() => {
    if (email === '') {
      setEmailValidationError(false);
      return setEmailRequiredError(true);
    }

    if (!emailRule.test(email)) {
      setEmailRequiredError(false);
      return setEmailValidationError(true);
    }
    if (userEmailAuthCode === '') {
      setUserEmailAuthCodeValidationError(false);
      return setUserEmailAuthCodeRequiredError(true);
    }
    if (emailAuthCode !== userEmailAuthCode) {
      setUserEmailAuthCodeRequiredError(false);
      return setUserEmailAuthCodeValidationError(true);
    }

    dispatch({
      type: UPDATE_USER_EMAIL_REQUEST,
      data: { email },
    });
  }, [email,
    emailAuthCode,
    userEmailAuthCode,
  ]);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden', flexDirection: 'column' }}>
      <Title>이메일 변경</Title>
      <Contents>
        <UpdateEmailForm browserWidth={browserSize.browserWidth} onFinish={onSubmit}>
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
          <Button
            type="primary"
            htmlType="submit"
            loading={updateUserEmailLoading}
            style={{
              backgroundColor: '#690096',
              borderColor: '#690096',
              width: '100%',
            }}
          >
            변경하기
          </Button>
        </UpdateEmailForm>
      </Contents>
    </div>
  );
};

export default UpdateEmail;
