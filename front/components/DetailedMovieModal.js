import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CloseModalButton = styled.button`
  position: absolute;
  right: 10px;
  top: 6px;
  background: transparent;
  border: none;
  font-size: 30px;
  cursor: pointer;
`;

const DetailedMovieModal = ({ email, toggleMovieDetail }) => (
  <div>
    <CloseModalButton onClick={() => toggleMovieDetail((prev) => !prev)}>&times;</CloseModalButton>

  </div>
);

DetailedMovieModal.propTypes = {
  email: PropTypes.string.isRequired,
  toggleMovieDetail: PropTypes.bool.isRequired,
};

export default DetailedMovieModal;
