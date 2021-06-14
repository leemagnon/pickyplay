import React from 'react';
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

const PosterCard = styled.div`
    background-color: dodgerblue;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    color: white;
    padding: 1rem;
    width: 250px;
    height: 375px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const SearchedMovieList = ({ searchedMovies }) => (
  <PosterCards>
    {searchedMovies.map((v) => <PosterCard key={v._source.DOCID} style={{ backgroundImage: `url(${v._source.posters._cdata})`}}>{v._source.posters._cdata === '' ? v._source.title._cdata : null}</PosterCard>)}
  </PosterCards>
);


SearchedMovieList.propTypes = {
  searchedMovies: PropTypes.node.isRequired,
};

export default SearchedMovieList;
