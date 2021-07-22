/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useContext, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import { END } from 'redux-saga';
import axios from 'axios';
import AppContext from '../../contexts/appContext';
import DetailedMovieModal from '../../components/DetailedMovieModal';
import Modal from '../../components/Modal';
import { LOAD_MOVIE_DETAIL_REQUEST, LOAD_MY_MOVIES_REQUEST } from '../../reducers/movie';
import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';

const Logo = styled.a`
    flex: 1;
    display: flex;
    align-items: flex-end;
    margin-left: 15px;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
    font-size: 35px;
    color: white;
    & span {
      color: #9400d3;
    }
`;

const Title = styled.div`
    flex: 1;
    display: flex;
    align-items: flex-end;
    font-size: 35px;
    color: #ffffff;
    margin-left: 15px;
    margin-bottom: 20px;
`;

const PosterCards = styled.div`
    margin: 0 auto;
    display: grid;
    grid-gap: 1rem;

    @media (min-width: 750px) {
        grid-template-columns: repeat(2, 1fr); 
    }
    @media (min-width: 1000px) {
        grid-template-columns: repeat(3, 1fr); 
    }
    @media (min-width: 1250px) {
        grid-template-columns: repeat(4, 1fr); 
    }
    @media (min-width: 1450px) {
        grid-template-columns: repeat(5, 1fr); 
    }
    @media (min-width: 1650px) {
        grid-template-columns: repeat(6, 1fr); 
    }
    @media (min-width: 1900px) {
        grid-template-columns: repeat(7, 1fr); 
    }
    @media (min-width: 2150px) {
        grid-template-columns: repeat(8, 1fr); 
    }
`;

const PosterCard = styled.img`
    width: 250px;
    min-width: 250px;
    height: 375px;
    line-height: 375px;
    color: white;
    text-align: center;
    background-blend-mode: multiply;
    background-color: dodgerblue;
`;

const SimpleInfo = styled.div`
    z-index: 1;
    display: none;
    background-color: rgb(0,0,0,0.7);
    position: absolute;
    float: left;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: ${({ browserWidth }) => (browserWidth >= 410 ? 400 : 350)}px;
    color: white;
    padding: 1rem;
    border: 5px solid;
    border-image-slice: 1;
    border-image-source: linear-gradient(to left, #743ad5, #d53a9d);
    & div {
      margin-bottom: 10px;
    }
    & b {
      font-size: 15px;
    }
`;

const Collection = () => {
  const dispatch = useDispatch();
  const browserSize = useContext(AppContext);
  const router = useRouter();
  const { me } = useSelector((state) => state.user);
  const {
    myMovies,
    currentMovieDetail,
    loadMovieDetailDone,
    loadMovieDetailError,
  } = useSelector((state) => state.movie);
  const [showMovieDetail, setShowMovieDetail] = useState({ show: false, data: {} });
  const [isTooltipVisible, setTooltipVisibility] = useState(false);

  useEffect(() => {
    if (!(me && me.userIdx)) {
      router.replace('/');
    }
  }, [me && me.id]);

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

  const toggleSimpleInfo = useCallback((DOCID, _id, show = false) => {
    if (show) {
      // tooltip
      setTooltipVisibility(true);
      // PosterCard
      document.getElementById(_id).style.filter = 'brightness(0.8)';
      // SimpleInfo
      document.getElementById(DOCID).style.display = 'flex';
      document.getElementById(DOCID).style.flexDirection = 'column';
    } else {
      // tooltip
      setTooltipVisibility(false);
      // PosterCard
      document.getElementById(_id).style.filter = 'none';
      // SimpleInfo
      document.getElementById(DOCID).style.display = 'none';
    }
  }, []);

  const toggleMovieDetail = useCallback((DOCID) => {
    dispatch({
      type: LOAD_MOVIE_DETAIL_REQUEST,
      data: DOCID.trim(),
    });
  }, []);

  return (
    <div style={{ width: '100%',
      height: '100%',
      backgroundColor: 'black',
      overflow: 'hidden',
      overflowY: 'scroll' }}
    >
      <Logo className="font-carter-one" href="/">
        <span>P</span>
        ICKY
        <span>P</span>
        LAY
      </Logo>
      <Title>무비컬렉션</Title>

      {myMovies?.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', color: 'white' }}>
          좋아요를 한 영화가 없습니다.
        </div>
      )
        : (
          <PosterCards>
            {myMovies?.map((v) => (
              <div
                key={v._id}
                style={{ position: 'relative',
                  display: 'flex',
                  justifyContent: 'center' }}
              >
                <PosterCard
                  id={v._id}
                  src={v.posters}
                  onError={(e) => { e.target.style.backgroundcolor = 'dodgerblue'; }}
                  alt={v.title}
                />

                <SimpleInfo
                  id={v.DOCID}
                  browserWidth={browserSize.browserWidth}
                >
                  <div><b>키워드 :</b> {v.keywords}</div>
                  <div><b>장르 :</b> {v.genre}</div>
                  <div><b>배우 :</b> {v.actors}</div>
                </SimpleInfo>

                <div
                  style={{
                    zIndex: 2,
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                  }}
                  onMouseOverCapture={() => toggleSimpleInfo(v.DOCID, v._id, true)}
                  onMouseOutCapture={() => toggleSimpleInfo(v.DOCID, v._id)}
                  onClick={() => toggleMovieDetail(v.DOCID)}
                  data-tip="상세보기"
                />
              </div>
            ))}
            {isTooltipVisible && <ReactTooltip place="top" type="dark" effect="float" />}
            <Modal visible={showMovieDetail.show}>
              <DetailedMovieModal
                data={showMovieDetail.data}
                onCloseModal={() => setShowMovieDetail({ show: false, data: {} })}
              />
            </Modal>
          </PosterCards>
        )}
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  // 쿠키
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';

  if (context.req && cookie) { // 프론트 서버가 한대라 브라우저들이 쿠키를 공유하게 되는 문제 예방
    axios.defaults.headers.Cookie = cookie;

    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });

    context.store.dispatch({
      type: LOAD_MY_MOVIES_REQUEST,
    });
  }
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Collection;
