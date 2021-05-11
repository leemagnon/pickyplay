import styled from 'styled-components';

export const Background = styled.div`
    background-image: url('/img/login_bg.jpg');
    width: 100%;
    height: 100%;
`;

export const Header = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 14%;
    border-bottom: transparent;
`;

export const Logo = styled.h1`
    position: absolute;
    top: -20px;
    left: 27px;
    color: white;
    font-size: 45px;
    & span {
        color: #9400D3;
    }
`;

export const LogInBody = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 460px;
    height: 500px;
    padding: 30px 65px;
    background-color: rgba(0,0,0,.75);
`;

export const LoginText = styled.h1`
    color: #fff;
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 30px;
`;

export const Input = styled.input`
  background: #333;
  border-radius: 4px;
  border-right-style: initial;
  border-bottom-style: initial;
  box-sizing: border-box;
  margin: 0 0 20px;
  margin-bottom: 37px; 
  width: 100%;
  color: #fff;
  padding: 16px;
  height: 50px;
  font-size: 16px;
  line-height: 1.33333333;

  &.error {
    border-bottom-style: solid;
    border-bottom-color: #FFFF00;
    margin-bottom: 5px;
  }
`;

export const InputError = styled.div`
  color: #FFFF00;
  margin-bottom: 32px;
`;

export const Button = styled.button`
  margin-top: 12px;
  width: 100%;
  max-width: 100%;
  color: #fff;
  background-color: #690096;
  border: none;
  font-size: 18px;
  font-weight: 900;
  height: 50px;
  min-width: 96px;
  padding: 0 16px 3px;
  transition: all 80ms linear;
  user-select: none;
  outline: none;
  cursor: pointer;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: rgba(99, 0, 142, 0.9);
    border: none;
  }
  &:focus {
    --saf-0: rgba(var(--sk_highlight, 18, 100, 163), 1);
    box-shadow: 0 0 0 1px var(--saf-0), 0 0 0 5px rgba(29, 155, 209, 0.3);
  }
`;

export const SignUp = styled.div`
  color: #737373;
  font-size: 17px;
  font-weight: 600;
  text-align: end;
  margin-top: 32px;
`;
