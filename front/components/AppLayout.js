import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import styled from 'styled-components';

const Header = styled.div`
  position: absolute;
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  background-color: transparent;
  border-bottom: transparent;
`;

const Logo = styled.a`
  font-size: 35px;
  color: white;
  & span {
    color: #9400d3;
  }
`;

// const Footer = styled.div`
//   position: absolute;
//   bottom: 0;
//   width: 100%;
//   padding: 20px 40px;
//   background-color: rgba(0, 0, 0, 0.75);
//   color: #737373;
//   font-size: 17px;
// `;
const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.75);
  color: #737373;
`;

// const Scroll = styled.div`
// flex: 1;
//   width: 100px;
// `;

const aTagStyle = {
  textDecoration: 'none',
  color: '#fff',
};

const Input = styled.input`
  border-radius: 4px;
  box-sizing: border-box;
  color: #fff;
  width: 270px;
  height: 35px;
  font-size: 16px;

  ::placeholder {
    font-style: italic;
    font-size: 1em;
    color: #737373;
    text-align: center;  
  }
`;

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Header>

        <Link href="/">
          <Logo className="font-carter-one">
            <span>P</span>
            ICKY
            <span>P</span>
            LAY
          </Logo>
        </Link>

        <div className="search_box">
          <Input type="text" maxLength="225" placeholder="제목, 키워드, 장르, 사람" />
          <button type="submit" className="font-nanum-gothic" style={{ height: 34 }}>
            <img src="/free-icon-magnifying-glass-search-13311.png" alt="magnifying-glass-search" />
          </button>
        </div>

        {me ? (
          <Link href="/profile" className="font-nanum-gothic"><a style={{ fontSize: '18px', fontWeight: 'bold' }}>프로필</a></Link>
        ) : (
          <Link href="/login" className="font-nanum-gothic"><a style={{ fontSize: '18px', fontWeight: 'bold' }}>로그인</a></Link>
        )}

      </Header>
      {children}
      <Footer className="font-nanum-gothic">
        <div>
          <small>
            만든 이: leemagnon
            <br />
            이메일 주소: leemagnon@gmail.com
            <br />
            GitHub 주소:
            <a
              href="https://github.com/leemagnon/pickyplay"
              style={aTagStyle}
            >
              {' '}
              https://github.com/leemagnon/pickyplay
            </a>
            <br />
            블로그 주소:
            <a href="https://rat2.tistory.com/" style={aTagStyle}>
              {' '}
              https://rat2.tistory.com/
            </a>
          </small>
        </div>
        <div>
          <small>
            copyright ⓒ 2021 by leemagnon All Pictures cannot be copied
            without permission
            <br />
            아이콘 제작자 : <a href="https://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/kr/" title="Flaticon">www.flaticon.com</a>
          </small>
        </div>
      </Footer>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;

//  style={{ minWidth: '929px' }}
//  style={{ display: 'inline-block', verticalAlign: 'middle' }}
