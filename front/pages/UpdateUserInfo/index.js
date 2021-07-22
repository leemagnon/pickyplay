import React, { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { END } from 'redux-saga';
import axios from 'axios';
import Intro from '../../components/Intro';
import Activate2FA from '../../components/Activate2FA';
import Deactivate2FA from '../../components/Deactivate2FA';
import UpdateProfile from '../../components/UpdateProfile';
import UpdateEmail from '../../components/UpdateEmail';
import UpdatePassword from '../../components/UpdatePassword';
import wrapper from '../../store/configureStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';

const UpdateUserInfo = () => {
  const { me } = useSelector((state) => state.user);
  const router = useRouter();
  const component = useMemo(() => (router.query.component !== undefined ? router.query.component : 'Intro'), [router.query]);

  useEffect(() => {
    if (!me) {
      router.replace('/');
    }
  }, [me]);

  return (
    <>
      {component === 'Intro' && <Intro />}
      {component === 'Activate2FA' && <Activate2FA />}
      {component === 'Deactivate2FA' && <Deactivate2FA />}
      {component === 'UpdateProfile' && <UpdateProfile />}
      {component === 'UpdateEmail' && <UpdateEmail />}
      {component === 'UpdatePassword' && <UpdatePassword />}
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  // 쿠키
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';

  if (context.req && cookie) { // 프론트 서버가 한대라 브라우저들이 쿠키를 공유하게 되는 문제 예방
    axios.defaults.headers.Cookie = cookie;

    context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
  }

  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default UpdateUserInfo;
