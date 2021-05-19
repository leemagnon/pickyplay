import React from 'react';
import loadable from '@loadable/component';
import { Switch, Redirect, Route } from 'react-router-dom';
// import LoggingIn from '../../pages/LoggingIn';
// import Register from '../../pages/Register';
// import WaitingRoom from '../WaitingRoom';

// 알아서 코드 스플리팅 하고 불러옴
const LoggingIn = loadable(() => import('../../pages/LoggingIn'));
const Register = loadable(() => import('../../pages/Register'));
const WaitingRoom = loadable(() => import('../WaitingRoom'));

const App = () => (
  /* Route => 컴포넌트들을 화면에 띄워주는 역할
    Switch => 여러 개의 컴포넌트 중 하나의 컴포넌트만 화면에 표시해주는 라우터. */
  <Switch>
    <Redirect exact path="/" to="/login" />
    <Route path="/login" component={LoggingIn} />
    <Route path="/register" component={Register} />
    <Route path="/waitingroom" component={WaitingRoom} />
  </Switch>
);

export default App;
