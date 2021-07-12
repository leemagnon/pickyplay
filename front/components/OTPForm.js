import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SECOND_AUTH_REQUEST, CLOSE_OTP_FORM_REQUEST } from '../reducers/user';

const OTPInput = styled.input`
  ::placeholder {
    font-style: italic;
    font-size: 1em;
    color: #737373;
    text-align: center;
  }
`;

const OTPButton = styled.button`
  margin-top: 12px;
  width: 120px;
  max-width: 120px;
  color: #fff;
  background-color: #690096;
  border: none;
  font-size: 18px;
  font-weight: 900;
  height: 40px;
  min-width: 96px;
  padding: 0 16px 3px;
  transition: all 80ms linear;
  user-select: none;
  outline: none;
  cursor: pointer;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: rgba(99, 0, 142, 0.9);
    border: none;
  }
  &:focus {
    --saf-0: rgba(var(--sk_highlight, 18, 100, 163), 1);
    box-shadow: 0 0 0 1px var(--saf-0), 0 0 0 5px rgba(29, 155, 209, 0.3);
  }
`;

const CloseModalButton = styled.button`
  position: absolute;
  right: 10px;
  top: 6px;
  background: transparent;
  border: none;
  font-size: 30px;
  cursor: pointer;
`;

const OTPForm = ({ email, onCloseModal }) => {
  const dispatch = useDispatch();
  const [twoFactorAuthenticationCode, setTwoFactorAuthenticationCode] = useState('');

  const onChangeTwoFactorAuthenticationCode = useCallback((e) => {
    setTwoFactorAuthenticationCode(e.target.value);
  }, [twoFactorAuthenticationCode]);

  const onCloseOTPForm = useCallback(() => {
    onCloseModal(false);
    dispatch({
      type: CLOSE_OTP_FORM_REQUEST,
    });
  }, []);

  const onSubmit = useCallback((e) => {
    e.preventDefault();

    console.log(twoFactorAuthenticationCode, email);

    dispatch({
      type: SECOND_AUTH_REQUEST,
      data: { twoFactorAuthenticationCode, email },
    });
  }, [twoFactorAuthenticationCode, email]);

  return (
    <div style={{ textAlign: 'center' }}>
      <CloseModalButton onClick={onCloseOTPForm}>&times;</CloseModalButton>
      <form onSubmit={onSubmit}>
        <div>
          <OTPInput
            id="secondAuthData"
            name="secondAuthData"
            value={twoFactorAuthenticationCode}
            onChange={onChangeTwoFactorAuthenticationCode}
            placeholder="otp 입력"
          />
          <div>
            <OTPButton type="submit">제출</OTPButton>
          </div>
        </div>
      </form>
    </div>
  );
};

OTPForm.propTypes = {
  email: PropTypes.string.isRequired,
  onCloseModal: PropTypes.bool.isRequired,
};

export default OTPForm;
