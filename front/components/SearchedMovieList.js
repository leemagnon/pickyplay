/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback, useState, useEffect, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import DetailedMovieModal from './DetailedMovieModal';
import Modal from './Modal';
import { LOAD_MOVIE_DETAIL_REQUEST } from '../reducers/movie';
import AppContext from '../contexts/appContext';

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

const SearchedMovieList = ({ searchedMovies }) => {
  const dispatch = useDispatch();
  const browserSize = useContext(AppContext);
  const { currentMovieDetail,
    loadMovieDetailDone,
    loadMovieDetailError,
  } = useSelector((state) => state.movie);
  const [showMovieDetail, setShowMovieDetail] = useState({ show: false, data: {} });
  const [isTooltipVisible, setTooltipVisibility] = useState(false);

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

  if (searchedMovies.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', color: 'white' }}>
        검색 결과가 없습니다.
      </div>
    );
  }
  return (
    <PosterCards>
      {searchedMovies.map((v) => {
        /**
           * actor 문자열 생성
           */
        let actorStr = '';
        const arr = [];
        if (!Object.prototype.hasOwnProperty.call(v._source.actors.actor, 'actorNm')) { // v._source.actors.actor 에 actorNm 이 없으면 v._source.actors.actor는 배열.
          if (v._source.actors.actor.length > 5) { // 만약 actor 들이 5명을 초과하면 5명만 출력. 5명 미만이면 전부 출력.
            actorStr = `${v._source.actors.actor[0].actorNm._cdata.trim()}, ${v._source.actors.actor[1].actorNm._cdata.trim()}, ${v._source.actors.actor[2].actorNm._cdata.trim()}, ${v._source.actors.actor[3].actorNm._cdata.trim()}, ${v._source.actors.actor[4].actorNm._cdata.trim()}`;
          } else {
            Object.values(v._source.actors.actor).forEach((value) => {
              arr.push(value.actorNm._cdata);
            });
            actorStr = arr.toString();
          }
        } else {
          actorStr = v._source.actors.actor.actorNm._cdata.trim();
        }

        return (
          <div key={v._id} style={{ position: 'relative' }}>
            <PosterCard
              id={v._id}
                // key={v._source.DOCID._cdata}
              src={v._source.posters._cdata}
              onError={(e) => { e.target.style.backgroundcolor = 'dodgerblue'; }}
              alt={v._source.title._cdata.trim()}
            />

            <SimpleInfo
                // key={v._id}
              id={v._source.DOCID._cdata}
              browserWidth={browserSize.browserWidth}
            >
              <div><b>키워드 :</b> {v._source.keywords._cdata}</div>
              <div><b>장르 :</b> {v._source.genre._cdata}</div>
              <div><b>배우 :</b> {actorStr}</div>
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
              onMouseOverCapture={() => toggleSimpleInfo(v._source.DOCID._cdata, v._id, true)}
              onMouseOutCapture={() => toggleSimpleInfo(v._source.DOCID._cdata, v._id)}
              onClick={() => toggleMovieDetail(v._source.DOCID._cdata)}
              data-tip="상세보기"
            />
          </div>
        );
      })}
      {isTooltipVisible && <ReactTooltip place="top" type="dark" effect="float" />}
      <Modal visible={showMovieDetail.show}>
        <DetailedMovieModal
          data={showMovieDetail.data}
          onCloseModal={() => setShowMovieDetail({ show: false, data: {} })}
        />
      </Modal>
    </PosterCards>
  );
};

SearchedMovieList.propTypes = {
  searchedMovies: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SearchedMovieList;
