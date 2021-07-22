import React, { useEffect, useState, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import gravatar from 'gravatar';
import styled, { createGlobalStyle } from 'styled-components';
import Menu from './Menu';
import SearchedMovieList from './SearchedMovieList';
import RecommendedMovieList from './RecommendedMovieList';
import DetailedMovieModal from './DetailedMovieModal';
import Modal from './Modal';
import { SEARCH_MOVIE_REQUEST, REMOVE_CURRENT_MOVIE, LOAD_MOVIE_DETAIL_REQUEST } from '../reducers/movie';
import { LOG_OUT_REQUEST } from '../reducers/user';
import AppContext from '../contexts/appContext';

const Wrapper1 = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
  min-height: 70px;
  margin-bottom: 50px;
`;

const Wrapper2 = styled.div`
  display: flex;
  flex-direction: column;
  flex: 7;
  margin-top: 10px;
`;

const Header = styled.div`
  position: fixed;
  z-index: 3;
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: transparent;
  border-bottom: transparent;
`;

const Logo = styled.a`
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
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
  position: absolute;
  right: 30px;
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

const MenuButton = styled.button`
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

const RandomMovieContent = styled.div`
  position: absolute;
  z-index: 1;
  margin-left: 30px;
  display: flex;
  flex-direction: column;

  #detailInfo:hover {
    filter: brightness(0.8);
    cursor: pointer;
  }

  #title {
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
    font-weight: bold;
    color: white;
  }
  #plots {
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
    color: white;
    width: ${({ browserWidth }) => (browserWidth >= 1000 ? 700 : browserWidth / 2)}px;
    height: 150px;
  }
`;

/* drawer 열림 */
const openedStyle = {
  maxWidth: '100%' /* max-with is 100% when the drawer is opened */,
  opacity: 1,
  transition: 'max-width 0.5s, opacity 0.2s'
};

/* drawer 닫힘 */
const closedStyle = {
  maxWidth: 0 /* max-width is 0 in the closed drawer */,
  opacity: 0,
  transition: 'max-width 0.5s, opacity 0.2s'
};

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

const Blurry = styled.div`
  position: absolute;
  width: 100%;
  height: 35px;
  bottom: -20px;
  backdrop-filter: blur(2px);
`;

const AppLayout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const browserSize = useContext(AppContext);
  const { me, myMovies } = useSelector((state) => state.user);
  const { randomMovie, recommendedMovies, searchedMovies, currentMovieDetail, loadRandomMovieDone, loadMovieDetailDone, loadMovieDetailError } = useSelector((state) => state.movie);
  const [isHome, setIsHome] = useState(true);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [opened, setOpened] = useState(false);
  const [showMovieDetail, setShowMovieDetail] = useState({ show: false, data: {} });

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
    if (isHome && loadRandomMovieDone) {
      if(browserSize.browserWidth < 700){
        document.getElementById('plots').style.display = 'none';
        document.getElementById('search_box').style.position = 'absolute';
        document.getElementById('search_box').style.left = '28px';
        document.getElementById('search_box').style.top = '60px';
      } else {
        document.getElementById('plots').style.display = 'block';
        document.getElementById('search_box').style.position = 'static';
      }
  
      if(browserSize.browserWidth > 1000){
        document.getElementById('detailInfo').style.width = '58px';
        document.getElementById('random-movie-content').style.bottom = '110px';
        document.getElementById('title').style.fontSize = '75px';
        document.getElementById('plots').style.fontSize = '30px';
      } else if(browserSize.browserWidth > 850){
        document.getElementById('detailInfo').style.width = '48px';
        document.getElementById('random-movie-content').style.bottom = '70px';
        document.getElementById('title').style.fontSize = '60px';
        document.getElementById('plots').style.fontSize = '20px';
      } else if (browserSize.browserWidth > 500){
        document.getElementById('detailInfo').style.width = '35px';
        document.getElementById('random-movie-content').style.bottom = '50px';
        document.getElementById('title').style.fontSize = '45px';
        document.getElementById('plots').style.fontSize = '18px';
      } else {
        document.getElementById('detailInfo').style.width = '18px';
        document.getElementById('random-movie-content').style.bottom = '25px';
        document.getElementById('title').style.fontSize = '18px';
        document.getElementById('plots').style.fontSize = '16px';
      }
    } else {
      if (browserSize.browserWidth < 700) {
        document.getElementById('search_box').style.position = 'absolute';
        document.getElementById('search_box').style.left = '28px';
        document.getElementById('search_box').style.top = '60px';
      } else {
        document.getElementById('search_box').style.position = 'static';
      }
    }
  }, [isHome && loadRandomMovieDone, browserSize.browserWidth]);

  useEffect(() => {
    if (loadMovieDetailError) {
      alert(loadMovieDetailError.message);
    }
  }, [loadMovieDetailError]);

  useEffect(() => {
    if (loadMovieDetailDone && currentMovieDetail) {
      setShowMovieDetail({ show: true, data: currentMovieDetail });
    }
  }, [loadMovieDetailDone && currentMovieDetail]);

  const onChangeText = useCallback((e) => {
    if (e.target.value !== '') {
      setIsHome(false);
      dispatch({
        type: REMOVE_CURRENT_MOVIE
      })
      dispatch({
        type: SEARCH_MOVIE_REQUEST,
        data: e.target.value,
      });
    } else {
      setIsHome(true);
    }
  }, []);

    const toggleUserProfile = useCallback(() => {
    setShowUserMenu(prev => !prev);
  }, []);

  const onLogOut = useCallback(() => {
    dispatch({ type: LOG_OUT_REQUEST });
  }, []);

  const toggleOpened = useCallback(() => {
    setOpened(prev => !prev);
  }, []);

  const toggleMovieDetail = useCallback((DOCID) => {
    dispatch({
      type: LOAD_MOVIE_DETAIL_REQUEST,
      data: DOCID,
    });
  }, []);

  const goToMyMovies = useCallback(() => {
    dispatch({
      type: REMOVE_CURRENT_MOVIE
    })
    return router.replace('/MyMovies');
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', overflowY: 'scroll', backgroundColor: 'black' }}>
      <Global />
      <Wrapper1>
        <Header>
          <Logo className="font-carter-one" href="/">
            <span>P</span>
            ICKY
            <span>P</span>
            LAY
          </Logo>

          <div id="search_box">
            <button
              type="submit"
              className="font-nanum-gothic"
              style={{ height: 34, background: 'transparent', border: 'none', cursor: 'pointer' }}
              onClick={toggleOpened}
            >
              <img
                src="/search.png"
                alt="magnifying-glass-search"
                style={{width: '42px'}}
              />
            </button>
            <Input
              type="text"
              onChange={onChangeText}
              maxLength="100"
              placeholder="제목, 키워드, 장르, 사람"
              style={opened ? openedStyle : closedStyle}
            />
          </div>

          {me ? (
            <>
              <div onMouseEnter={toggleUserProfile}>
                <ProfileImg src={me.profileImgUrl || gravatar.url(me.email, { s: '38px', d: 'retro' })} alt={me.nickname} />
              </div>
              {showUserMenu && (
                <Menu style={{ right: 0, top: 38 }} setShowUserMenu={setShowUserMenu}>
                  <ProfileModal>
                    <img src={me.profileImgUrl || gravatar.url(me.email, { s: '38px', d: 'retro' })} alt={me.nickname} style={{borderRadius: '5px', width: '38px', height: '38px'}} />
                    <div id="profile-name">{me.nickname}</div> 
                  </ProfileModal>
                  <MenuButton onClick={goToMyMovies}>무비컬렉션</MenuButton>
                  <MenuButton onClick={() => router.replace('/UpdateUserInfo')}>회원정보수정</MenuButton>
                  <MenuButton onClick={onLogOut}>로그아웃</MenuButton>
                </Menu>
              )}
            </>
          ) : (
            <Link href="/login" className="font-nanum-gothic">
              <a style={{ position: 'absolute', right: '30px', fontSize: '18px', fontWeight: 'bold', textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>로그인</a>
            </Link>
          )}
        </Header>

        {isHome && loadRandomMovieDone
        && (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <div style={{width: '100%', position: 'relative'}}>
          <RandomMovieContent id="random-movie-content" browserWidth={browserSize.browserWidth}>
            <div id="title">{randomMovie.title} <img id="detailInfo" src='/info-64.png' alt='info' onClick={() => toggleMovieDetail(randomMovie.DOCID)} /></div>
            <div id="plots">{randomMovie.plots.substring(0, 165)}&middot;&middot;&middot;</div>
          </RandomMovieContent>
          <Slider {...settings}>
            {randomMovie.stlls.map((v) => <div key={v}><img src={v} alt={v} style={{ width: '100%', height: `${(width / height) * 400}px`}} /></div>)}
          </Slider>
          <Blurry />
        </div>
        )}
      </Wrapper1>

      <Wrapper2>
        {isHome ? <RecommendedMovieList recommendedMovies={recommendedMovies} /> : <SearchedMovieList searchedMovies={searchedMovies} />}
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

      <Modal visible={showMovieDetail.show}>
        <DetailedMovieModal
          data={showMovieDetail.data}
          onCloseModal={() => setShowMovieDetail({ show: false, data: {} })}
        />
      </Modal>
    </div>
  );
};

AppLayout.defaultProps = {
  isMainPage: false,
};

AppLayout.propTypes = {
  isMainPage: PropTypes.bool,
};

export default AppLayout;
