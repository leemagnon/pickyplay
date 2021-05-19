import React from 'react';
import styled from 'styled-components';

type ErrorMessage = {
    errorMessage: string;
}

const StyledFormErrorMessage = styled.div`
    position: absolute;
    padding-left: 5px;
    color: ${(props) => props.theme.color.main};
`;

const FormErrorMessage = ({ errorMessage }: ErrorMessage) => (
  <StyledFormErrorMessage>{errorMessage}</StyledFormErrorMessage>
);

export default FormErrorMessage;
