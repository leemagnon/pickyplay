import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import Slider from 'react-slick';
import styled, { createGlobalStyle } from 'styled-components';
import Menu from './Menu';
import { LOAD_RANDOM_MOVIE_REQUEST, SEARCH_MOVIE_REQUEST } from '../reducers/movie';
import SearchedMovieList from './SearchedMovieList';
import gravatar from 'gravatar';

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
  margin-top: 10px;
`;

const Header = styled.div`
  position: fixed;
  z-index: 1;
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

const Footer = styled.div`
  padding: 20px 30px;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.75);
  color: #737373;
  margin-top: 10px;
`;

const aTagStyle = {
  textDecoration: 'none',
  color: '#fff',
};

const Input = styled.input`
  border-radius: 4px;
  box-sizing: border-box;
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

const Global = createGlobalStyle`
  .slick-slide {
    display: inline-block;
  }
`;

const ProfileImg = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 5px;
`;

const ProfileModal = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  & img {
    display: flex;
  }
  & > div {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }
  & #profile-name {
    display: inline-flex;
    font-weight: bold;
    font-size: 18px;
  }
  & #profile-menu {
    font-size: 15px;
  }
  & #home-img {
    margin-left: 10px;
  }
`;

const LogOutButton = styled.button`
  border: none;
  width: 100%;
  border-top: 1px solid rgb(29, 28, 29);
  background: transparent;
  display: block;
  height: 33px;
  padding: 5px 20px 5px;
  outline: none;
  cursor: pointer;
`;

const AppLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { randomMovie, loadRandomMovieDone, searchedMovies } = useSelector((state) => state.movie);
  const [isHome, setIsHome] = useState(true);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const settings = { // slider 세팅
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 2000,
  };

  const onChangeText = useCallback((e) => {
    if (e.target.value !== '') {
      setIsHome(false);
    } else {
      setIsHome(true);
    }
    dispatch({
      type: SEARCH_MOVIE_REQUEST,
      data: e.target.value,
    })
  }, []);

  useEffect(() => {
    setWidth(window.innerWidth);
    setHeight(screen.height);

    window.addEventListener(
      'resize',
      (event) => {
        setWidth(window.innerWidth);
      },
      true,
    );
  }, []);

  useEffect(() => {
    dispatch({
      type: LOAD_RANDOM_MOVIE_REQUEST,
    });
  }, []);

  const toggleUserProfile = useCallback(() => {
    setShowUserMenu(prev => !prev);
  }, []);

  return (
    <div style={{ backgroundColor: 'black' }}>
      <Global />
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
              onChange={onChangeText}
              maxLength="100"
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
            <>
              <div onMouseEnter={toggleUserProfile}>
                <ProfileImg src={gravatar.url(me.email, { s: '38px', d: 'retro' })} alt={me.nickname} />
              </div>
              {showUserMenu && (
                <Menu style={{ right: 0, top: 38 }} setShowUserMenu={setShowUserMenu}>
                  <ProfileModal>
                    <img src={gravatar.url(me.email, { s: '38px', d: 'retro' })} alt={me.nickname} style={{borderRadius: '5px'}} />
                    <div id="profile-name">쥐돌이이이이이이이이</div> 
                    <div id="profile-menu">마이페이지로 이동 👉 </div>
                    <img id="home-img" src='/home.png' alt={me.nickname} />
                  </ProfileModal>
                  <LogOutButton>로그아웃</LogOutButton>
                </Menu>
              )}
            </>
          ) : (
            <Link href="/login" className="font-nanum-gothic">
              <a style={{ fontSize: '18px', fontWeight: 'bold' }}>로그인</a>
            </Link>
          )}
        </Header>

        {isHome && loadRandomMovieDone
        && (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Slider {...settings}>
          {randomMovie.stlls.map((v) => <div key={v}><img src={v} alt={v} style={{ width: '100%', height: `${(width / height) * 400}px`}} /></div>)}
        </Slider>
        )}
      </Wrapper1>

      <Wrapper2>
        {isHome ? <div>{children}</div> : <SearchedMovieList searchedMovies={searchedMovies} />}
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
