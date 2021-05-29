import styled from 'styled-components';
import { Form } from 'antd';

export const Background = styled.div`
  position: relative;
  background-color: #1d2327;
  width: 100%;
  height: 100%;
`;

// export const Logo = styled.h1`
//   position: absolute;
//   top: 20%;
//   left: 50%;
//   -o-transform: translate(-50%, -50%);
//   -ms-transform: translate(-50%, -50%);
//   -moz-transform: translate(-50%, -50%);
//   -webkit-transform: translate(-50%, -50%);
//   transform: translate(-50%, -50%);
//   color: white;
//   font-size: 45px;
//   & span {
//     color: #9400d3;
//   }
// `;

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
