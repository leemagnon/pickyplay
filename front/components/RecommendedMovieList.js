import React from 'react';
import PropTypes from 'prop-types';

const RecommendedMovieList = ({ recommendedMovies }) => {
  console.log(recommendedMovies.top10Movies);
  console.log(recommendedMovies.randomMovies);
  return <div>영화 추천 목록</div>;
};

RecommendedMovieList.propTypes = {
  recommendedMovies: PropTypes.shape({
    top10Movies: PropTypes.arrayOf(PropTypes.object),
    randomMovies: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default RecommendedMovieList;
