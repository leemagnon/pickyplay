import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import styled from 'styled-components';

const Lists = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: pink;

  li {
    float: left;
  }
`;

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  return (
    <div>
      <Header>
        <Lists>
          <li>
            <Link href="/">
              <a>PICKYPLAY</a>
            </Link>
          </li>
          <li>
            검색
          </li>
          {me ? (
            <li>
              <Link href="/profile"><a>프로필</a></Link>
            </li>
          ) : (
            <li>
              <Link href="/login"><a>로그인</a></Link>
            </li>
          )}
        </Lists>
      </Header>
      {children}
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
