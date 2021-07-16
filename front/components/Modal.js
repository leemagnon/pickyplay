import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CreateModal = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  top: 0;
  right: 0;
  z-index: 1022;
  & > div {
    position: relative;
    display: inline-block;
    --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
    box-shadow: 0 0 0 1px var(--saf-0), 0 4px 12px 0 rgba(0, 0, 0, 0.12);
    border-radius: 6px;
    user-select: none;
    z-index: 1012;
  }
`;

const Modal = (props) => {
  const { visible = false, children } = props;

  if (!visible) {
    return null;
  }

  return (
    <CreateModal>
      {children}
    </CreateModal>
  );
};

Modal.propTypes = {
  visible: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default Modal;
