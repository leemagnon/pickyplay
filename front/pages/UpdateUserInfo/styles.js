import styled from 'styled-components';
import { Form, Input } from 'antd';

export const Background = styled.div`
  position: relative;
  background-color: #1d2327;
  width: 100%;
  height: 200%;
`;

export const Title = styled.h1`
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%,-50%);
  color: white;
  font-size: 35px;
`;

export const UpdateUserInfoForm = styled(Form)`
  position: absolute;
  margin: 0 auto;
  top: 70%;
  left: 50%;
  transform: translate(-50%,-50%);
  & label {
    color: white;
  }
  & Input,
  Button {
    width: 400px;
    height: 40px;
    margin-bottom: 20px;
  }
`;

export const ProfileImg = styled.img`
    position: absolute;
    left: 50%;
    top: 39%;
    transform: translate(-50%,-50%);
    width: 120px;
    height: 120px;
    border-radius: 5px;
    &:hover {
        filter: brightness(70%);
    }
`;

export const InputContainer = styled.div`
    position:relative;
    & img {
        position:absolute;
        right: 15px;
        top: 11px;
        width: 18px;
        height: 18px;
    }
`;

export const InputField = styled(Input)`
  background-color: #1d2428;
  border-radius: 4px;
  color: #fff;

  &.error {
    margin-bottom: 5px;
    border-bottom-style: solid;
    border-bottom-color: #ffff00;
    border-bottom-width: 5px;
  }
  &.pass {
    margin-bottom: 5px;
    border-bottom-style: solid;
    border-bottom-color: #52c41a;
    border-bottom-width: 5px;
  }
`;

export const InputError = styled.div`
  color: #ffff00;
  margin-bottom: 32px;
`;
