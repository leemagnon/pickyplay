import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Slider from 'react-slick';
import AppContext from '../contexts/appContext';
import ReviewForm from './ReviewForm';
import ReviewCard from './ReviewCard';

const Background = styled.div`
  width: ${({browserWidth}) => (browserWidth >= 1100 ? 1000 : browserWidth - 120)}px;
  height: ${({browserHeight}) => (browserHeight - 120)}px
`;

const Title = styled.div`
  width: 100%;
  overflow: hidden;
  color: white;
  font-size: 80px;
  font-weight: 700;
  text-align: center;
  padding: 50px 0;
  background-color: #191919;
`;

const DetailInfo = styled.div`
  display: flex;
  flex-direction: row;
  color: white;
  background-color: #191919;
`;

const CloseModalButton = styled.button`
  z-index: 1;
  position: absolute;
  right: 10px;
  top: 6px;
  background: transparent;
  border: none;
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
`;

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

const DetailedMovieModal = ({ data, onCloseModal }) => {
  const browserSize = useContext(AppContext);
  return (
    <Background className="scroll" browserWidth={browserSize.browserWidth} browserHeight={browserSize.browserHeight}>
      <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
      {
        data.stlls[0] === "" ? 
          <Title>{data.title}</Title> 
          : 
          <Slider {...settings} style={{width: '100%', overflow: 'hidden'}}>
              {data.stlls.map((v) => <div key={v}><img src={v} alt={v} style={{ width: '100%', height: `400px`}} /></div>)}
          </Slider>
      }
      <DetailInfo>
        <div style={{flex: 2.5, padding: '0 30px'}}>
          <div style={{fontSize: '18px'}}>{data.prodYear} | {data.rating} | {data.runtime}</div>
          <div style={{fontSize: '20px'}}>{data.plots}</div>
        </div>
        <div style={{flex: 1, padding: '0 10px', fontSize: '17px'}}>
          <div><span>출연:</span> {data.actors[0]} {data.actors[1]} {data.actors[2]} 더보기</div>
          <div><span>장르:</span> {data.genre}</div>
          <div><span>키워드:</span> {data.keywords}</div>
        </div>
      </DetailInfo>
      <ReviewForm DOCID={data.DOCID} />
      <ReviewCard reviews={data.reviews} />
    </Background>
  );
};

DetailedMovieModal.propTypes = {
  data: PropTypes.object.isRequired,
  onCloseModal: PropTypes.func.isRequired,
};

export default DetailedMovieModal;
