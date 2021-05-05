import React from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router-dom';
// import LogIn from '@pages/LogIn';
// import SignUp from '@pages/SignUp';

// 알아서 코드 스플리팅 하고 불러옴
// const LogIn = loadable(() => import('@pages/LogIn'));
// const SignUp = loadable(() => import('@pages/SignUp'));

const App = () => {
  return (
    /* Route => 컴포넌트들을 화면에 띄워주는 역할
    Switch => 여러 개의 컴포넌트 중 하나의 컴포넌트만 화면에 표시해주는 라우터. */
    <Switch>
      <Redirect exact path="/" to="/login" />
      {/* <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} /> */}
    </Switch>
  );
};

export default App;
