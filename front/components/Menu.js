import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AppContext from '../contexts/appContext';

const CreateMenu = styled.div`
    position: absolute;
    right: 30px;
    top: 74px;
    display: inline-block;
    --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
    box-shadow: 0 0 0 1px var(--saf-0), 0 4px 12px 0 rgba(0, 0, 0, 0.12);
    background-color: rgba(var(--sk_foreground_min_solid, 248, 248, 248), 1);
    border-radius: 6px;
    user-select: none;
    min-width: ${({ browserWidth }) => (browserWidth > 450 ? 360 : 280)}px;
    z-index: 512;
    max-height: calc(100vh - 20px);
    color: rgb(29, 28, 29);
`;

const Menu = ({ children, setShowUserMenu }) => {
  const browserSize = useContext(AppContext);
  const onCloseModal = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  return (
    <CreateMenu onMouseLeave={onCloseModal} browserWidth={browserSize.browserWidth}>
      {children}
    </CreateMenu>
  );
};

Menu.propTypes = {
  children: PropTypes.node.isRequired,
  setShowUserMenu: PropTypes.func.isRequired,
};

export default Menu;
