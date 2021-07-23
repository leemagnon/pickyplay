/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import { LOAD_MOVIE_DETAIL_REQUEST } from '../reducers/movie';
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
    cursor: pointer;
    &:hover {
      filter: brightness(0.8);
    }
`;

const Label = styled.label`
  color: white; 
  font-size: ${({ browserWidth }) => (browserWidth > 450 ? 30 : 24)}px;
  margin-left: 10px;
`;

const RecommendedMovieList = ({ recommendedMovies }) => {
  const dispatch = useDispatch();
  const browserSize = useContext(AppContext);
  const [recommendedMoviesHover, setRecommendedMoviesHover] = useState(false);
  const [randomMoviesHover, setRandomMoviesHover] = useState(false);
  const [isTooltipVisible, setTooltipVisibility] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setTooltipVisibility(true);
  }, []);

  const recommendedMoviesSettings = { // slider1 세팅
    arrows: recommendedMoviesHover,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 5,
    autoplay: false,
    speed: 800,
    responsive: isClient ? [
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
    ] : null,
  };

  const randomMoviesSettings = { // slider2 세팅
    arrows: randomMoviesHover,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 5,
    autoplay: false,
    speed: 800,
    responsive: isClient ? [
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
    ] : null,
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

  const toggleMovieDetail = useCallback((DOCID) => {
    dispatch({
      type: LOAD_MOVIE_DETAIL_REQUEST,
      data: DOCID.trim(),
    });
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <PosterCards>
        <Label browserWidth={browserSize.browserWidth}>오늘 PICKYPLAY의 TOP 10 콘텐츠</Label>
        <div ref={recommendedMoviesReference} style={{ marginTop: '10px' }}>
          <Slider key={isClient ? 'client' : 'server'} {...recommendedMoviesSettings}>
            {recommendedMovies
              .top10Movies
              .map((v) => (
                <PosterCard
                  key={v._id}
                  src={v.posters}
                  onError={(e) => { e.target.style.backgroundcolor = 'dodgerblue'; }}
                  onClick={() => toggleMovieDetail(v.DOCID)}
                  alt={v.title}
                  data-tip="상세보기"
                />
              ))}
          </Slider>
        </div>
      </PosterCards>
      <PosterCards>
        <Label browserWidth={browserSize.browserWidth}>
          추천 콘텐츠 ( {recommendedMovies.randomGenre} )
        </Label>
        <div ref={randomMoviesReference} style={{ marginTop: '10px' }}>
          <Slider key={isClient ? 'client' : 'server'} {...randomMoviesSettings}>
            {recommendedMovies
              .randomMovies
              .map((v) => (
                <PosterCard
                  key={v._id}
                  src={v._source.posters}
                  onError={(e) => { e.target.style.backgroundcolor = 'dodgerblue'; }}
                  onClick={() => toggleMovieDetail(v._source.DOCID)}
                  alt={v._source.title}
                  data-tip="상세보기"
                />
              ))}
          </Slider>
        </div>
      </PosterCards>
      {isTooltipVisible && <ReactTooltip place="top" type="dark" effect="float" />}
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
