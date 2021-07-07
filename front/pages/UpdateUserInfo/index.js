import React, { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Intro from '../../components/Intro';
import Activate2FA from '../../components/Activate2FA';
import UpdateProfile from '../../components/UpdateProfile';
import UpdateEmail from '../../components/UpdateEmail';
import UpdatePassword from '../../components/UpdatePassword';

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
      {component === 'UpdateProfile' && <UpdateProfile />}
      {component === 'UpdateEmail' && <UpdateEmail />}
      {component === 'UpdatePassword' && <UpdatePassword />}
    </>
  );
};

export default UpdateUserInfo;
