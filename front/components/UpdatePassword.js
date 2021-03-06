import React, { useCallback, useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button } from 'antd';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import AppContext from '../contexts/appContext';
import { UPDATE_USER_PASSWORD_REQUEST } from '../reducers/user';
import { passwordRule } from '../util/regexp';

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

const UpdatePasswordForm = styled(Form)`
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

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const browserSize = useContext(AppContext);
  const {
    updateUserPasswordLoading,
    updateUserPasswordDone,
    updateUserPasswordError } = useSelector((state) => state.user);
  const [password, setPassword] = useState('');
  const [passwordRequiredError, setPasswordRequiredError] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordCheckRequiredError, setPasswordCheckRequiredError] = useState(false);
  const [passwordCheckError, setPasswordCheckError] = useState(false);

  const PasswordInput = passwordRequiredError || passwordLengthError ? 'error' : null;
  const PasswordCheckInput = passwordCheckRequiredError || passwordCheckError ? 'error' : null;

  useEffect(() => {
    if (updateUserPasswordDone) {
      alert('??????????????? ??????????????? ?????????????????????.');
      router.replace('/');
    }
  }, [updateUserPasswordDone]);

  useEffect(() => {
    if (updateUserPasswordError) {
      alert(`???????????? ?????? ??????. ${updateUserPasswordError.message}`);
    }
  }, [updateUserPasswordError]);

  const onChangePassword = useCallback((e) => {
    setPassword(e.target.value);

    if (e.target.value !== '') {
      setPasswordRequiredError(false);

      if (!passwordRule.test(e.target.value)) {
        setPasswordLengthError(true);
      } else {
        setPasswordLengthError(false);
      }
    } else {
      setPasswordRequiredError(false);
      setPasswordLengthError(false);
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
    if (password !== '') {
      if (!passwordRule.test(password)) {
        setPasswordRequiredError(false);
        return setPasswordLengthError(true);
      }

      if (passwordCheck === '') {
        setPasswordCheckError(false);
        return setPasswordCheckRequiredError(true);
      }

      if (password !== passwordCheck) {
        setPasswordCheckRequiredError(false);
        return setPasswordCheckError(true);
      }
    }

    dispatch({
      type: UPDATE_USER_PASSWORD_REQUEST,
      data: { password },
    });
  }, [password,
    passwordCheck,
  ]);

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden', flexDirection: 'column' }}>
      <Title>???????????? ??????</Title>
      <Contents>
        <UpdatePasswordForm browserWidth={browserSize.browserWidth} onFinish={onSubmit}>
          <div>
            <label htmlFor="password">??? ????????????</label>
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
            <label htmlFor="password-check">??? ???????????? ?????????</label>
            <br />
            <InputField type="password" name="password-check" className={PasswordCheckInput} value={passwordCheck} onChange={onChangePasswordCheck} />
            {passwordCheckRequiredError && <InputError>??????????????? ??????????????? ?????????.</InputError>}
            {passwordCheckError && <InputError>??????????????? ???????????? ????????????.</InputError>}
          </div>
          <Button
            type="primary"
            htmlType="submit"
            loading={updateUserPasswordLoading}
            style={{
              backgroundColor: '#690096',
              borderColor: '#690096',
              width: '100%',
            }}
          >
            ????????????
          </Button>
        </UpdatePasswordForm>
      </Contents>
    </div>
  );
};

export default UpdatePassword;
