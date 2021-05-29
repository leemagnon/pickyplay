import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input } from 'antd';

const AppLayout = ({ children }) => {
  return (
    <div>
      PICKYPLAY
      <Menu mode="horizontal">
        <Menu.Item key="home">
          <Link href="/home">
            <a>홈</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Input.Search enterButton />
        </Menu.Item>
      </Menu>
      {children}
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
