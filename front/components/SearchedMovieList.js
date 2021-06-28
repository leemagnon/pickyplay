import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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
    position: absolute;
    float: left;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 200px;
    height: 200px;
    background-color: pink;
   
    display: none;
`;

const SearchedMovieList = ({ searchedMovies }) => {
  const toggleSimpleInfo = useCallback((DOCID, show = false) => {
    if (show) {
      document.getElementById(DOCID).style.display = 'flex';
      document.getElementById(DOCID).style.flexDirection = 'column';
    } else {
      document.getElementById(DOCID).style.display = 'none';
    }
  }, []);

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
        }

        return (
          <div style={{ position: 'relative' }}>
            <PosterCard
              key={v._source.DOCID._cdata}
              onMouseEnter={() => toggleSimpleInfo(v._source.DOCID._cdata, true)}
              onMouseLeave={() => toggleSimpleInfo(v._source.DOCID._cdata)}
              src={v._source.posters._cdata}
              onError={(e) => { e.target.style.backgroundcolor = 'dodgerblue'; }}
              alt={v._source.title._cdata.trim()}
            />
            <SimpleInfo
              key={v._id}
              id={v._source.DOCID._cdata}
            >
              <div>{v._source.keywords._cdata}</div>
              <div>{v._source.genre._cdata}</div>
              <div>{actorStr}</div>
            </SimpleInfo>
          </div>
        );
      })}
    </PosterCards>

  );
};

SearchedMovieList.propTypes = {
  searchedMovies: PropTypes.node.isRequired,
};

export default SearchedMovieList;
