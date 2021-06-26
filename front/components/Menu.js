import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CreateMenu = styled.div`
    position: absolute;
    right: 30px;
    top: 56px;
    display: inline-block;
    --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
    box-shadow: 0 0 0 1px var(--saf-0), 0 4px 12px 0 rgba(0, 0, 0, 0.12);
    background-color: rgba(var(--sk_foreground_min_solid, 248, 248, 248), 1);
    border-radius: 6px;
    user-select: none;
    min-width: 360px;
    z-index: 512;
    max-height: calc(100vh - 20px);
    color: rgb(29, 28, 29);
`;

const Menu = ({ children, setShowUserMenu }) => {
  const onCloseModal = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  return (
    <CreateMenu onMouseLeave={onCloseModal}>
      {children}
    </CreateMenu>
  );
};

Menu.propTypes = {
  children: PropTypes.node.isRequired,
  setShowUserMenu: PropTypes.bool.isRequired,
};

export default Menu;
