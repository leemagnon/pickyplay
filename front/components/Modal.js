import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SECOND_AUTH_REQUEST } from '../reducers/user';

const CreateModal = styled.div`
  position: fixed;
  text-align: center;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  z-index: 1022;
  & > div {
    margin-top: 200px;
    display: inline-block;
    width: 350px;
    height: 350px;
    background: white;
    --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
    box-shadow: 0 0 0 1px var(--saf-0), 0 4px 12px 0 rgba(0, 0, 0, 0.12);
    background-color: rgba(var(--sk_foreground_min_solid, 248, 248, 248), 1);
    border-radius: 6px;
    user-select: none;
    max-width: 350px;
    max-height: 400px;
    padding: 30px 40px 0;
    z-index: 1012;
    position: relative;
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

const Modal = ({ setShowQRCodeModal, email }) => {
  const dispatch = useDispatch();
  const [twoFactorAuthenticationCode, setTwoFactorAuthenticationCode] = useState('');

  const onChangeTwoFactorAuthenticationCode = useCallback((e) => {
    setTwoFactorAuthenticationCode(e.target.value);
  }, [twoFactorAuthenticationCode]);

  const onCloseModal = useCallback(() => {
    setShowQRCodeModal(false);
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
    <CreateModal>
      <div>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        <form onSubmit={onSubmit}>
          <div>
            <OTPInput
              id="secondAuthData"
              name="secondAuthData"
              value={twoFactorAuthenticationCode}
              onChange={onChangeTwoFactorAuthenticationCode}
              placeholder="otp 입력"
            />
            <OTPButton type="submit">제출</OTPButton>
          </div>
        </form>
      </div>
    </CreateModal>
  );
};

Modal.propTypes = {
  setShowQRCodeModal: PropTypes.bool.isRequired,
  email: PropTypes.string.isRequired,
};

export default Modal;
