/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import styled from 'styled-components';
import AppContext from '../contexts/appContext';

const PosterCards = styled.div`
    margin: 0 auto;
    margin-bottom: 30px;
    
    .slick-slide > div {
      position: relative;
      margin: 0 10px;
    }
    .slick-prev:before, .slick-next:before {
      color: purple;
      font-size: 50px;
    }
    .slick-prev {
      left: 3% !important;
      z-index: 1;
    }
    .slick-next {
      right: 7% !important;
      z-index: 1;
    }
`;

const PosterCard = styled.img`
    width: 100%;
    height: 250px;
    line-height: 250px;
    color: white;
    text-align: center;
    background-blend-mode: multiply;
    background-color: dodgerblue;
`;

const SimpleInfo = styled.div`
    display: none;
    z-index: 1;
    background-color: rgb(0,0,0,0.7);
    position: absolute;
    float: left;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 100%;
    height: 100%;
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
    & button {
      width: 70px;
      margin: auto;
      background-color: #c73bbd;
      border-width: 3px;
      border-color: #7d217d;
      border-radius: 3px;
      &:hover {
        background-color: purple;
      }
    }
`;

const RecommendedMovieList = ({ recommendedMovies }) => {
  const browserSize = useContext(AppContext);
  const [recommendedMoviesHover, setRecommendedMoviesHover] = useState(false);
  const [randomMoviesHover, setRandomMoviesHover] = useState(false);

  const recommendedMoviesSettings = { // slider1 세팅
    arrows: recommendedMoviesHover,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 5,
    autoplay: false,
    speed: 800,
    responsive: [
      {
        breakpoint: 950,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: recommendedMoviesHover,
        },
      },
      {
        breakpoint: 690,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: recommendedMoviesHover,
        },
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: recommendedMoviesHover,
        },
      },
    ],
  };

  const randomMoviesSettings = { // slider2 세팅
    arrows: randomMoviesHover,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 5,
    autoplay: false,
    speed: 800,
    responsive: [
      {
        breakpoint: 950,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: randomMoviesHover,
        },
      },
      {
        breakpoint: 690,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: randomMoviesHover,
        },
      },
      {
        breakpoint: 450,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: randomMoviesHover,
        },
      },
    ],
  };

  const recommendedMoviesReference = useRef();
  const randomMoviesReference = useRef();

  useEffect(() => {
    recommendedMoviesReference.current.addEventListener('mouseenter', () => {
      setRecommendedMoviesHover(true);
    });
    recommendedMoviesReference.current.addEventListener('mouseleave', () => {
      setRecommendedMoviesHover(false);
    });

    randomMoviesReference.current.addEventListener('mouseenter', () => {
      setRandomMoviesHover(true);
    });
    randomMoviesReference.current.addEventListener('mouseleave', () => {
      setRandomMoviesHover(false);
    });
  }, []);

  const toggleSimpleInfo = useCallback((DOCID, show = false) => {
    if (show) {
      document.getElementById(DOCID).style.display = 'flex';
      document.getElementById(DOCID).style.flexDirection = 'column';
    } else {
      document.getElementById(DOCID).style.display = 'none';
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <PosterCards>
        <label style={{ color: 'white', fontSize: '30px', marginLeft: '10px' }}>오늘 PICKYPLAY의 TOP 10 콘텐츠</label>
        <div ref={recommendedMoviesReference} style={{ marginTop: '10px' }}>
          <Slider {...recommendedMoviesSettings}>
            {recommendedMovies
              .top10Movies
              .map((v) => (
                <div key={`${v.title}-wrapper`}>
                  <PosterCard
                    key={v.title}
                    src={v.posters}
                    onError={(e) => { e.target.style.backgroundcolor = 'dodgerblue'; }}
                    onMouseOverCapture={() => toggleSimpleInfo(v.DOCID, true)}
                    alt={v.title}
                  />
                  <SimpleInfo
                    key={v._id}
                    id={v.DOCID}
                    onMouseOutCapture={() => toggleSimpleInfo(v.DOCID)}
                    // onMouseOutCapture={() => console.log(`${v.DOCID} 아웃`)}
                  >
                    <div><b>키워드 :</b> {v.keywords}</div>
                    <div><b>장르 :</b> {v.genre}</div>
                    <div><b>배우 :</b> {v.actors}</div>
                    <div style={{ display: 'flex' }}><button type="button">상세보기</button></div>
                  </SimpleInfo>
                </div>
              ))}
          </Slider>
        </div>
      </PosterCards>
      <PosterCards>
        <label style={{ color: 'white', fontSize: '30px', marginLeft: '10px' }}>추천 콘텐츠 ( {recommendedMovies.randomGenre} )</label>
        <div ref={randomMoviesReference} style={{ marginTop: '10px' }}>
          <Slider {...randomMoviesSettings}>
            {recommendedMovies
              .randomMovies
              .map((v) => (
                <PosterCard
                  key={v._source.DOCID}
                  src={v._source.posters}
                  onError={(e) => { e.target.style.backgroundcolor = 'dodgerblue'; }}
                  alt={v._source.title}
                />
              ))}
          </Slider>
        </div>
      </PosterCards>
    </div>
  );
};

RecommendedMovieList.propTypes = {
  recommendedMovies: PropTypes.shape({
    top10Movies: PropTypes.arrayOf(PropTypes.object),
    randomMovies: PropTypes.arrayOf(PropTypes.object),
    randomGenre: PropTypes.string,
  }).isRequired,
};

export default RecommendedMovieList;
