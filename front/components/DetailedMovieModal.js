/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AppContext from '../contexts/appContext';
import ReviewForm from './ReviewForm';
import ReviewCard from './ReviewCard';
import Modal from './Modal';
import { ADD_LIKE_REQUEST, REMOVE_LIKE_REQUEST } from '../reducers/movie';

const Background = styled.div`
  width: ${({ browserWidth }) => (browserWidth >= 1100 ? 1000 : browserWidth - 120)}px;
  height: ${({ browserHeight }) => (browserHeight - 120)}px;
  background: #191919;
`;

const Title = styled.div`
  width: 100%;
  overflow: hidden;
  color: white;
  font-size: 80px;
  font-weight: 700;
  text-align: center;
  padding: 50px 0;
  margin-bottom: 30px;
`;

const DetailInfo = styled.div`
  display: flex;
  flex-direction: ${({ browserWidth }) => (browserWidth > 500 ? 'row' : 'column')};
  color: white;
  margin-bottom: 30px;

  #info {
    font-size: 16px;
    color: lightgrey;
  }
  #more {
    font-style: italic;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const InfoOne = styled.div`
  flex: 2.5;
  padding: 0 30px;
  #plot {
    font-size: ${({ browserWidth }) => (browserWidth > 500 ? 20 : 18)}px;
  }
`;

const InfoTwo = styled.div`
  flex: 1;
  font-size: 17px;
  padding: ${({ browserWidth }) => (browserWidth > 500 ? '0 10px' : '0 30px')};
  margin-top: 30px;
`;

const CloseModalButton = styled.button`
  z-index: 1;
  position: absolute;
  right: 10px;
  top: 6px;
  background: transparent;
  font-size: ${({ browserWidth }) => (browserWidth > 410 ? 35 : 25)}px;
  font-weight: bold;
  cursor: pointer;

  width: ${({ browserWidth }) => (browserWidth > 410 ? 40 : 30)}px;
  height: ${({ browserWidth }) => (browserWidth > 410 ? 40 : 30)}px;
  border-radius: 100px;
  border-width: thick;
  border-color: black;
  background-color: black;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CloseMoreActorModalButton = styled.button`
  position: absolute;
  right: 10px;
  top: 6px;
  background: transparent;
  border: none;
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
`;

const settings = { // slider ??????
  dots: false,
  arrows: false,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 2000,
};

const DetailedMovieModal = ({ data, onCloseModal }) => {
  const dispatch = useDispatch();
  const browserSize = useContext(AppContext);
  const userIdx = useSelector((state) => state.user.me?.userIdx);
  const reviews = useSelector((state) => state.movie.currentMovieDetail?.reviews);
  const likers = useSelector((state) => state.movie.currentMovieDetail?.likers);
  const [showMoreActorModal, setShowMoreActorModal] = useState(false);

  const liked = likers?.find((v) => v.userIdx === userIdx);

  const onLike = useCallback((DOCID) => {
    if (!userIdx) {
      return alert('???????????? ???????????????.');
    }
    return dispatch({
      type: ADD_LIKE_REQUEST,
      data: DOCID,
    });
  }, [userIdx]);

  const onUnlike = useCallback((DOCID) => {
    if (!userIdx) {
      return alert('???????????? ???????????????.');
    }
    return dispatch({
      type: REMOVE_LIKE_REQUEST,
      data: DOCID,
    });
  }, [userIdx]);

  const onClickMoreActors = useCallback(() => {
    setShowMoreActorModal(true);
  }, []);

  return (
    <Background className="scroll" browserWidth={browserSize.browserWidth} browserHeight={browserSize.browserHeight}>
      <CloseModalButton
        onClick={onCloseModal}
        browserWidth={browserSize.browserWidth}
      >
        &times;
      </CloseModalButton>
      {
        data.stlls[0] === ''
          ? <Title>{data.title}</Title>
          : (
            <Slider {...settings} style={{ width: '100%', height: '400px', overflow: 'hidden', marginBottom: '30px' }}>
              {data.stlls.map((v) => <div key={v}><img src={v} alt={v} style={{ width: '100%', height: '400px' }} /></div>)}
            </Slider>
          )
}
      <DetailInfo browserWidth={browserSize.browserWidth}>
        <InfoOne browserWidth={browserSize.browserWidth}>
          <div style={{ fontSize: '18px', marginBottom: '5px' }}>{data.prodYear} | {data.rating} | {data.runtime}</div>
          <div id="plot">{data.plots}</div>
        </InfoOne>
        <InfoTwo browserWidth={browserSize.browserWidth}>
          <div><span id="info">??????:</span> {data.actors[0]}, {data.actors[1]}, {data.actors[2]}, <span id="more" onClick={onClickMoreActors}>??? ??????</span></div>
          <div><span id="info">??????:</span> {data.genre}</div>
          <div><span id="info">?????????:</span> {data.keywords}</div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            {liked
              ? <HeartFilled key="heart" style={{ fontSize: '100px', color: 'red' }} onClick={() => onUnlike(data.DOCID)} />
              : <HeartOutlined key="heart" style={{ fontSize: '100px' }} onClick={() => onLike(data.DOCID)} />}
          </div>
        </InfoTwo>
      </DetailInfo>
      <ReviewForm DOCID={data.DOCID} />
      {reviews.map((review) => <ReviewCard key={review.reviewIdx} review={review} />)}
      <Modal visible={showMoreActorModal}>
        <div style={{ textAlign: 'center', padding: '30px 40px', background: 'white' }}>
          <CloseMoreActorModalButton
            onClick={() => setShowMoreActorModal(false)}
          >
            &times;
          </CloseMoreActorModalButton>
          {data.actors.map((v, i) => {
            if (i === data.actors.length - 1) {
              return v;
            }
            return `${v}, `;
          })}
        </div>
      </Modal>
    </Background>
  );
};

DetailedMovieModal.propTypes = {
  data: PropTypes.object.isRequired,
  onCloseModal: PropTypes.func.isRequired,
};

export default DetailedMovieModal;
