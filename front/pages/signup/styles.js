import styled from 'styled-components';
import { Form, Input } from 'antd';

export const Background = styled.div`
  position: relative;
  background-color: #1d2327;
  width: 100%;
  height: 100%;
`;

export const Logo = styled.h1`
  position: absolute;
  width: 234px;
  margin: 0 auto;
  top: 50%;
  left: 50%;
  margin-top: -255px;
  margin-left: -117px;
  color: white;
  font-size: 45px;
  & span {
    color: #9400d3;
  }
`;

export const LoginForm = styled(Form)`
  position: absolute;
  width: 510px;
  height: 300px;
  margin: 0 auto;
  top: 50%;
  left: 50%;
  margin-top: -144px;
  margin-left: -200px;
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

export const InputField = styled(Input)`
  background: #1d2428;
  border-radius: 4px;
  color: #fff;
  &.error {
    margin-bottom: 5px;
    border-bottom-style: solid;
    border-bottom-color: #ffff00;
    border-bottom-width: 5px;
  }
`;

export const InputError = styled.div`
  color: #ffff00;
  margin-bottom: 32px;
`;
