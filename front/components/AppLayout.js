import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import styled from 'styled-components';

const Wrapper1 = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
  min-height: 70px;
`;

const Wrapper2 = styled.div`
  display: flex;
  flex-direction: column;
  flex: 7;
`;

const Header = styled.div`
  position: fixed;
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  background-color: transparent;
  border-bottom: transparent;
`;

const PosterImg = styled.div`
  width: 100%;
  height: 500px;
  background-image: url("/login_bg.jpg");
  background-size: cover;
  background-repeat: no-repeat;
`;

const Logo = styled.a`
  font-size: 35px;
  color: white;
  & span {
    color: #9400d3;
  }
`;

const Footer = styled.div`
  padding: 20px 30px;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.75);
  color: #737373;
`;

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

const AppLayout = ({ children, isMainPage }) => {
  const { me } = useSelector((state) => state.user);

  return (
    <div>
      <Wrapper1>
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
            <Input
              type="text"
              maxLength="225"
              placeholder="제목, 키워드, 장르, 사람"
            />
            <button
              type="submit"
              className="font-nanum-gothic"
              style={{ height: 34 }}
            >
              <img
                src="/free-icon-magnifying-glass-search-13311.png"
                alt="magnifying-glass-search"
              />
            </button>
          </div>

          {me ? (
            <Link href="/profile" className="font-nanum-gothic">
              <a style={{ fontSize: '18px', fontWeight: 'bold' }}>프로필</a>
            </Link>
          ) : (
            <Link href="/login" className="font-nanum-gothic">
              <a style={{ fontSize: '18px', fontWeight: 'bold' }}>로그인</a>
            </Link>
          )}
        </Header>

        {isMainPage && <PosterImg />}
      </Wrapper1>

      <Wrapper2>
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
                https://github.com/leemagnon/pickyplay
              </a>
              <br />
              블로그 주소:
              <a href="https://rat2.tistory.com/" style={aTagStyle}>
                https://rat2.tistory.com/
              </a>
            </small>
          </div>
          <div>
            <small>
              copyright ⓒ 2021 by leemagnon All Pictures cannot be copied
              without permission
              <br />
              아이콘 제작자 :{' '}
              <a href="https://www.freepik.com" title="Freepik">
                Freepik
              </a>
              from{' '}
              <a href="https://www.flaticon.com/kr/" title="Flaticon">
                www.flaticon.com
              </a>
            </small>
          </div>
        </Footer>
      </Wrapper2>

    </div>
  );
};

AppLayout.defaultProps = {
  isMainPage: false,
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
  isMainPage: PropTypes.bool,
};

export default AppLayout;
